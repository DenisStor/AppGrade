import { Router } from 'express'
import db from '../db.js'

const router = Router()

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str) } catch { return fallback }
}

function getProductFull(id) {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!product) return null

  product.badges = safeJsonParse(product.badges, [])
  product.specs = safeJsonParse(product.specs, {})
  product.dimensions = safeJsonParse(product.dimensions, [])

  const variants = db.prepare(
    'SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC, id ASC'
  ).all(id)

  for (const v of variants) {
    v.images = db.prepare(
      'SELECT * FROM product_images WHERE variant_id = ? ORDER BY sort_order ASC'
    ).all(v.id)
    v.attributes = safeJsonParse(v.attributes, {})
  }
  product.variants = variants

  product.simOptions = db.prepare(
    'SELECT * FROM product_sim_options WHERE product_id = ? ORDER BY sort_order ASC'
  ).all(id)

  const relations = db.prepare(
    'SELECT related_product_id FROM product_relations WHERE product_id = ?'
  ).all(id)
  product.relatedIds = relations.map(r => r.related_product_id)

  // Имена связанных товаров для отображения в админке
  if (relations.length) {
    product.relatedProducts = relations.map(r => {
      const p = db.prepare('SELECT id, name FROM products WHERE id = ?').get(r.related_product_id)
      return p || { id: r.related_product_id, name: `#${r.related_product_id}` }
    })
  }

  const category = db.prepare('SELECT slug, name FROM categories WHERE id = ?').get(product.category_id)
  const brand = db.prepare('SELECT slug, name FROM brands WHERE id = ?').get(product.brand_id)
  product.categorySlug = category?.slug
  product.categoryName = category?.name
  product.brandSlug = brand?.slug
  product.brandName = brand?.name

  return product
}

router.get('/', (req, res) => {
  const { category_id, brand_id, search, active, is_used, page = 1, limit = 50 } = req.query
  let where = []
  let params = []

  if (category_id) { where.push('p.category_id = ?'); params.push(category_id) }
  if (brand_id) { where.push('p.brand_id = ?'); params.push(brand_id) }
  if (active !== undefined) { where.push('p.active = ?'); params.push(active) }
  if (is_used !== undefined) { where.push('p.is_used = ?'); params.push(is_used) }
  if (search) { where.push('p.name LIKE ?'); params.push(`%${search}%`) }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const safePage = Math.max(1, Number(page) || 1)
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50))
  const offset = (safePage - 1) * safeLimit

  const total = db.prepare(`SELECT COUNT(*) as count FROM products p ${whereClause}`).get(...params)

  const products = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name, b.slug as brand_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    ${whereClause}
    ORDER BY p.sort_order ASC, p.id DESC
    LIMIT ? OFFSET ?
  `).all(...params, safeLimit, offset)

  for (const p of products) {
    p.badges = safeJsonParse(p.badges, [])
    const firstVariant = db.prepare(
      'SELECT price, old_price, stock_status FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1'
    ).get(p.id)
    p.minPrice = firstVariant?.price
    p.hasDiscount = !!firstVariant?.old_price
    p.variantCount = db.prepare('SELECT COUNT(*) as count FROM product_variants WHERE product_id = ?').get(p.id).count
  }

  res.json({ items: products, total: total.count, page: safePage, limit: safeLimit })
})

router.get('/:id', (req, res) => {
  const product = getProductFull(Number(req.params.id))
  if (!product) return res.status(404).json({ error: 'Товар не найден' })
  res.json(product)
})

router.post('/', (req, res) => {
  const { name, slug, category_id, brand_id, short_description, description, badges, specs, dimensions, is_used, condition, condition_label, warranty, active, variants, simOptions, relatedIds } = req.body

  if (!name || !slug || !category_id || !brand_id) {
    return res.status(400).json({ error: 'Название, slug, категория и бренд обязательны' })
  }

  const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)
  if (exists) return res.status(400).json({ error: 'Slug уже используется' })

  const catExists = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id)
  if (!catExists) return res.status(400).json({ error: 'Категория не найдена' })

  const brandExists = db.prepare('SELECT id FROM brands WHERE id = ?').get(brand_id)
  if (!brandExists) return res.status(400).json({ error: 'Бренд не найден' })

  const insertProduct = db.transaction(() => {
    const result = db.prepare(`
      INSERT INTO products (name, slug, category_id, brand_id, short_description, description, badges, specs, dimensions, is_used, condition, condition_label, warranty, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, slug, category_id, brand_id,
      short_description || null, description || null,
      JSON.stringify(badges || []), JSON.stringify(specs || {}),
      JSON.stringify(dimensions || []),
      is_used || 0, condition || null, condition_label || null, warranty || null,
      active ?? 1
    )

    const productId = result.lastInsertRowid

    if (variants?.length) {
      const insertVariant = db.prepare(`
        INSERT INTO product_variants (product_id, color_name, color_hex, memory, price, old_price, stock_status, sim_id, sim_name, attributes, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      const insertImage = db.prepare(
        'INSERT INTO product_images (variant_id, url, sort_order) VALUES (?, ?, ?)'
      )

      variants.forEach((v, vi) => {
        const attrs = v.attributes || {}
        const colorName = attrs.color?.name || v.color_name || 'Default'
        const colorHex = attrs.color?.hex || v.color_hex || '#000000'
        const memory = attrs.memory ? Number(attrs.memory.id) : (v.memory ?? null)
        const simId = attrs.sim?.id || v.sim_id || null
        const simName = attrs.sim?.name || v.sim_name || null
        const vResult = insertVariant.run(
          productId, colorName, colorHex, memory ?? null,
          v.price, v.old_price ?? null, v.stock_status || 'in_stock',
          simId, simName, JSON.stringify(attrs), vi
        )
        if (v.images?.length) {
          v.images.forEach((img, ii) => {
            insertImage.run(vResult.lastInsertRowid, typeof img === 'string' ? img : img.url, ii)
          })
        }
      })
    }

    if (simOptions?.length) {
      const insertSim = db.prepare(
        'INSERT INTO product_sim_options (product_id, sim_id, name, price_modifier, sort_order) VALUES (?, ?, ?, ?, ?)'
      )
      simOptions.forEach((s, i) => insertSim.run(productId, s.sim_id || s.id, s.name, s.price_modifier || 0, i))
    }

    if (relatedIds?.length) {
      const insertRel = db.prepare(
        'INSERT OR IGNORE INTO product_relations (product_id, related_product_id) VALUES (?, ?)'
      )
      ;[...new Set(relatedIds)].forEach(rid => insertRel.run(productId, rid))
    }

    return productId
  })

  const productId = insertProduct()
  const product = getProductFull(productId)
  res.status(201).json(product)
})

router.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ error: 'Товар не найден' })

  const { name, slug, category_id, brand_id, short_description, description, badges, specs, dimensions, is_used, condition, condition_label, warranty, active, variants, simOptions, relatedIds } = req.body

  if (slug && slug !== existing.slug) {
    const dup = db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(slug, id)
    if (dup) return res.status(400).json({ error: 'Slug уже используется' })
  }

  const updateProduct = db.transaction(() => {
    db.prepare(`
      UPDATE products SET name = ?, slug = ?, category_id = ?, brand_id = ?, short_description = ?, description = ?,
        badges = ?, specs = ?, dimensions = ?, is_used = ?, condition = ?, condition_label = ?, warranty = ?, active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name ?? existing.name,
      slug ?? existing.slug,
      category_id ?? existing.category_id,
      brand_id ?? existing.brand_id,
      short_description !== undefined ? short_description : existing.short_description,
      description !== undefined ? description : existing.description,
      JSON.stringify(badges ?? JSON.parse(existing.badges || '[]')),
      JSON.stringify(specs ?? JSON.parse(existing.specs || '{}')),
      JSON.stringify(dimensions ?? safeJsonParse(existing.dimensions, [])),
      is_used ?? existing.is_used,
      condition !== undefined ? condition : existing.condition,
      condition_label !== undefined ? condition_label : existing.condition_label,
      warranty !== undefined ? warranty : existing.warranty,
      active ?? existing.active,
      id
    )

    if (variants !== undefined) {
      db.prepare('DELETE FROM product_variants WHERE product_id = ?').run(id)

      if (variants?.length) {
        const insertVariant = db.prepare(`
          INSERT INTO product_variants (product_id, color_name, color_hex, memory, price, old_price, stock_status, sim_id, sim_name, attributes, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        const insertImage = db.prepare(
          'INSERT INTO product_images (variant_id, url, sort_order) VALUES (?, ?, ?)'
        )

        variants.forEach((v, vi) => {
          const attrs = v.attributes || {}
          const colorName = attrs.color?.name || v.color_name || 'Default'
          const colorHex = attrs.color?.hex || v.color_hex || '#000000'
          const memory = attrs.memory ? Number(attrs.memory.id) : (v.memory ?? null)
          const simId = attrs.sim?.id || v.sim_id || null
          const simName = attrs.sim?.name || v.sim_name || null
          const vResult = insertVariant.run(
            id, colorName, colorHex, memory ?? null,
            v.price, v.old_price ?? null, v.stock_status || 'in_stock',
            simId, simName, JSON.stringify(attrs), vi
          )
          if (v.images?.length) {
            v.images.forEach((img, ii) => {
              insertImage.run(vResult.lastInsertRowid, typeof img === 'string' ? img : img.url, ii)
            })
          }
        })
      }
    }

    if (simOptions !== undefined) {
      db.prepare('DELETE FROM product_sim_options WHERE product_id = ?').run(id)
      if (simOptions?.length) {
        const insertSim = db.prepare(
          'INSERT INTO product_sim_options (product_id, sim_id, name, price_modifier, sort_order) VALUES (?, ?, ?, ?, ?)'
        )
        simOptions.forEach((s, i) => insertSim.run(id, s.sim_id || s.id, s.name, s.price_modifier || 0, i))
      }
    }

    if (relatedIds !== undefined) {
      db.prepare('DELETE FROM product_relations WHERE product_id = ?').run(id)
      if (relatedIds?.length) {
        const insertRel = db.prepare(
          'INSERT OR IGNORE INTO product_relations (product_id, related_product_id) VALUES (?, ?)'
        )
        ;[...new Set(relatedIds)].forEach(rid => insertRel.run(id, rid))
      }
    }
  })

  updateProduct()
  const product = getProductFull(id)
  res.json(product)
})

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Товар не найден' })
  res.json({ success: true })
})

export default router
