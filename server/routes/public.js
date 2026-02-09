import { Router } from 'express'
import db from '../db.js'

const router = Router()

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

// Batch-обогащение товаров вариантами, изображениями, SIM и связями
function enrichProducts(products, { includeRelations = false, includeRelatedProducts = false } = {}) {
  if (!products.length) return products

  const productIds = products.map(p => p.id)
  const placeholders = productIds.map(() => '?').join(',')

  // 1. Все варианты одним запросом
  const allVariants = db.prepare(`
    SELECT * FROM product_variants WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC
  `).all(...productIds)

  const variantIds = allVariants.map(v => v.id)

  // 2. Все изображения одним запросом
  let allImages = []
  if (variantIds.length) {
    const imgPlaceholders = variantIds.map(() => '?').join(',')
    allImages = db.prepare(`
      SELECT variant_id, url FROM product_images WHERE variant_id IN (${imgPlaceholders}) ORDER BY sort_order ASC
    `).all(...variantIds)
  }

  // 3. Все SIM-опции одним запросом
  const allSim = db.prepare(`
    SELECT product_id, sim_id, name, price_modifier FROM product_sim_options WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC
  `).all(...productIds)

  // 4. Все связи одним запросом (если нужны)
  let allRelations = []
  if (includeRelations) {
    allRelations = db.prepare(`
      SELECT product_id, related_product_id FROM product_relations WHERE product_id IN (${placeholders})
    `).all(...productIds)
  }

  // Группировка по ID
  const imagesByVariant = new Map()
  for (const img of allImages) {
    if (!imagesByVariant.has(img.variant_id)) imagesByVariant.set(img.variant_id, [])
    imagesByVariant.get(img.variant_id).push(img.url)
  }

  const variantsByProduct = new Map()
  for (const v of allVariants) {
    v.images = imagesByVariant.get(v.id) || []
    v.attributes = safeJsonParse(v.attributes, {})
    if (!variantsByProduct.has(v.product_id)) variantsByProduct.set(v.product_id, [])
    variantsByProduct.get(v.product_id).push(v)
  }

  const simByProduct = new Map()
  for (const s of allSim) {
    if (!simByProduct.has(s.product_id)) simByProduct.set(s.product_id, [])
    simByProduct.get(s.product_id).push({ sim_id: s.sim_id, name: s.name, price_modifier: s.price_modifier || 0 })
  }

  const relationsByProduct = new Map()
  for (const r of allRelations) {
    if (!relationsByProduct.has(r.product_id)) relationsByProduct.set(r.product_id, [])
    relationsByProduct.get(r.product_id).push(r.related_product_id)
  }

  // Обогащение
  for (const p of products) {
    p.badges = safeJsonParse(p.badges, [])
    p.specs = safeJsonParse(p.specs, {})
    p.dimensions = safeJsonParse(p.dimensions, [])
    p.variants = variantsByProduct.get(p.id) || []
    p.simOptions = simByProduct.get(p.id) || []
    if (includeRelations) {
      p.relatedIds = relationsByProduct.get(p.id) || []
    }
  }

  // 5. Связанные товары — полные данные (для ProductPage)
  if (includeRelatedProducts) {
    const allRelatedIds = [...new Set(allRelations.map(r => r.related_product_id))]
    if (allRelatedIds.length) {
      const relPlaceholders = allRelatedIds.map(() => '?').join(',')
      const relatedProducts = db.prepare(`
        SELECT p.*, c.slug as category_slug, b.slug as brand_slug, b.name as brand_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.id IN (${relPlaceholders}) AND p.active = 1
      `).all(...allRelatedIds)

      // Обогащаем связанные товары тоже batch-ом
      enrichProducts(relatedProducts)

      const relatedMap = new Map(relatedProducts.map(rp => [rp.id, rp]))
      for (const p of products) {
        if (p.relatedIds?.length) {
          p.relatedProducts = p.relatedIds
            .map(id => relatedMap.get(id))
            .filter(Boolean)
        }
      }
    }
  }

  return products
}

// GET /api/public/categories — все активные категории
router.get('/categories', (req, res) => {
  const categories = db.prepare(`
    SELECT id, name, slug, description, image_url, sort_order
    FROM categories WHERE active = 1
    ORDER BY sort_order ASC
  `).all()

  if (categories.length) {
    const catIds = categories.map(c => c.id)
    const placeholders = catIds.map(() => '?').join(',')
    const allBrands = db.prepare(`
      SELECT bc.category_id, b.id, b.name, b.slug, b.logo_url, bc.display_name
      FROM brand_categories bc
      JOIN brands b ON bc.brand_id = b.id
      WHERE bc.category_id IN (${placeholders}) AND b.active = 1
      ORDER BY bc.sort_order ASC
    `).all(...catIds)

    const brandsByCat = new Map()
    for (const b of allBrands) {
      if (!brandsByCat.has(b.category_id)) brandsByCat.set(b.category_id, [])
      brandsByCat.get(b.category_id).push({
        id: b.id, name: b.name, slug: b.slug,
        logo_url: b.logo_url, display_name: b.display_name,
      })
    }

    for (const cat of categories) {
      cat.brands = brandsByCat.get(cat.id) || []
    }
  }

  res.set('Cache-Control', 'public, max-age=300')
  res.json(categories)
})

// GET /api/public/categories/:slug/brands — бренды категории с мета-данными
router.get('/categories/:slug/brands', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE slug = ? AND active = 1').get(req.params.slug)
  if (!category) return res.status(404).json({ error: 'Категория не найдена' })

  const brands = db.prepare(`
    SELECT b.id, b.name, b.slug, b.logo_url, bc.display_name
    FROM brand_categories bc
    JOIN brands b ON bc.brand_id = b.id
    WHERE bc.category_id = ? AND b.active = 1
    ORDER BY bc.sort_order ASC
  `).all(category.id)

  if (brands.length) {
    const brandIds = brands.map(b => b.id)
    const bPlaceholders = brandIds.map(() => '?').join(',')

    // Статистика всех брендов одним запросом
    const stats = db.prepare(`
      SELECT p.brand_id,
        COUNT(DISTINCT p.id) as count,
        MIN(pv.price) as min_price
      FROM products p
      JOIN product_variants pv ON pv.product_id = p.id
      WHERE p.category_id = ? AND p.brand_id IN (${bPlaceholders}) AND p.active = 1 AND p.is_used = 0
      GROUP BY p.brand_id
    `).all(category.id, ...brandIds)

    const statsMap = new Map(stats.map(s => [s.brand_id, s]))

    // Flagship-изображения всех брендов одним запросом
    const flagships = db.prepare(`
      SELECT DISTINCT p.brand_id, pi.url FROM product_images pi
      JOIN product_variants pv ON pi.variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      WHERE p.category_id = ? AND p.brand_id IN (${bPlaceholders}) AND p.active = 1 AND p.is_used = 0
        AND pi.sort_order = 0 AND pv.sort_order = 0
      GROUP BY p.brand_id
    `).all(category.id, ...brandIds)

    const flagshipMap = new Map(flagships.map(f => [f.brand_id, f.url]))

    for (const brand of brands) {
      const s = statsMap.get(brand.id)
      brand.productCount = s?.count || 0
      brand.minPrice = s?.min_price || 0
      brand.flagshipImage = flagshipMap.get(brand.id) || null
    }
  }

  res.set('Cache-Control', 'public, max-age=300')
  res.json({ category, brands })
})

// GET /api/public/products — список товаров с фильтрами
router.get('/products', (req, res) => {
  const { category, brand, search, is_used, page = 1, limit = 100 } = req.query
  let where = ['p.active = 1']
  let params = []

  if (category) {
    where.push('c.slug = ?')
    params.push(category)
  }
  if (brand) {
    where.push('b.slug = ?')
    params.push(brand)
  }
  if (search) {
    where.push('(p.name LIKE ? OR p.short_description LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }
  if (is_used !== undefined) {
    where.push('p.is_used = ?')
    params.push(Number(is_used))
  }

  const whereClause = `WHERE ${where.join(' AND ')}`
  const safePage = Math.max(1, Number(page) || 1)
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 100))
  const offset = (safePage - 1) * safeLimit

  const products = db.prepare(`
    SELECT p.*,
      c.name as category_name, c.slug as category_slug,
      b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    ${whereClause}
    ORDER BY p.sort_order ASC, p.id DESC
    LIMIT ? OFFSET ?
  `).all(...params, safeLimit, offset)

  enrichProducts(products, { includeRelations: true })

  res.set('Cache-Control', 'public, max-age=60')
  res.json(products)
})

// GET /api/public/products/by-slugs?slugs=slug1,slug2 — для RecentlyViewed/Cart
router.get('/products/by-slugs', (req, res) => {
  const slugs = (req.query.slugs || '').split(',').filter(Boolean)
  if (!slugs.length) return res.json([])

  const placeholders = slugs.map(() => '?').join(',')
  const products = db.prepare(`
    SELECT p.*,
      c.name as category_name, c.slug as category_slug,
      b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.slug IN (${placeholders}) AND p.active = 1
  `).all(...slugs)

  enrichProducts(products)

  res.json(products)
})

// GET /api/public/products/:slug — детальная страница товара
router.get('/products/:slug', (req, res) => {
  const product = db.prepare(`
    SELECT p.*,
      c.name as category_name, c.slug as category_slug,
      b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.slug = ? AND p.active = 1
  `).get(req.params.slug)

  if (!product) return res.status(404).json({ error: 'Товар не найден' })

  enrichProducts([product], { includeRelations: true, includeRelatedProducts: true })

  res.json(product)
})

// GET /api/public/search?q= — поиск товаров
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim()
  if (!q) return res.json([])

  const products = db.prepare(`
    SELECT p.*,
      c.name as category_name, c.slug as category_slug,
      b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.active = 1 AND p.is_used = 0 AND (p.name LIKE ? OR p.short_description LIKE ?)
    ORDER BY p.sort_order ASC
    LIMIT 50
  `).all(`%${q}%`, `%${q}%`)

  enrichProducts(products)

  res.json(products)
})

// GET /api/public/services — активные услуги с ценами
router.get('/services', (req, res) => {
  const services = db.prepare(
    'SELECT * FROM service_items WHERE active = 1 ORDER BY sort_order ASC, id ASC'
  ).all()

  if (services.length) {
    const ids = services.map(s => s.id)
    const placeholders = ids.map(() => '?').join(',')

    const allPrices = db.prepare(
      `SELECT service_item_id, model_id, price FROM service_prices WHERE service_item_id IN (${placeholders}) ORDER BY id ASC`
    ).all(...ids)

    const pricesByItem = new Map()
    for (const p of allPrices) {
      if (!pricesByItem.has(p.service_item_id)) pricesByItem.set(p.service_item_id, [])
      pricesByItem.get(p.service_item_id).push({ model_id: p.model_id, price: p.price })
    }

    for (const s of services) {
      s.prices = pricesByItem.get(s.id) || []
    }
  }

  res.set('Cache-Control', 'public, max-age=300')
  res.json(services)
})

export default router
