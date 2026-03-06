import 'dotenv/config'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import db from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const productsDir = join(__dirname, '..', 'src', 'data', 'products')
const dataDir = join(__dirname, '..', 'src', 'data')

// Копия extractSeries из src/utils/product.js (seed не может использовать ESM-импорт с JSX)
function extractSeries(productName) {
  if (!productName) return null
  const iphoneMatch = productName.match(/iPhone\s+(SE|\d+e?)/i)
  if (iphoneMatch) return `iPhone ${iphoneMatch[1]}`
  const galaxyMatch = productName.match(/Galaxy\s+([A-Z]\s*(?:Flip|Fold)?\s*\d+)/i)
  if (galaxyMatch) return `Galaxy ${galaxyMatch[1]}`
  return null
}

// Маппинг Vite-импортов на реальные URL в server/uploads/
const imagePathMap = {
  'iphone-compare-iphone-17-pro-202509.jpeg': '/uploads/products/iphone-compare-iphone-17-pro-202509.jpeg',
}

function resolveImagePath(importPath) {
  for (const [filename, uploadPath] of Object.entries(imagePathMap)) {
    if (importPath.includes(filename)) return uploadPath
  }
  return importPath
}

// Загрузка JS-файлов с заменой Vite-импортов на строки-заглушки
function loadProductFile(filename, baseDir = productsDir) {
  let code = readFileSync(join(baseDir, filename), 'utf-8')

  // Заменяем import X from '...' на const X = resolved url
  code = code.replace(
    /^import\s+(\w+)\s+from\s+['"](.+?)['"]\s*;?\s*$/gm,
    (_, varName, path) => `const ${varName} = '${resolveImagePath(path)}';`
  )

  // Убираем export
  code = code.replace(/export\s+const\s+/g, 'const ')
  code = code.replace(/export\s*\{[^}]*\}/g, '')

  // Находим все const-переменные
  const varNames = [...code.matchAll(/^const\s+(\w+)\s*=/gm)].map(m => m[1])

  code += `\nreturn { ${varNames.join(', ')} };`

  try {
    return new Function(code)()
  } catch (e) {
    console.error(`Ошибка загрузки ${filename}:`, e.message)
    return {}
  }
}

// Данные
const { iphoneProducts } = loadProductFile('iphone.js')
const { macProducts } = loadProductFile('mac.js')
const { samsungProducts } = loadProductFile('samsung.js')
const { dysonProducts } = loadProductFile('dyson.js')
const { airpodsProducts } = loadProductFile('airpods.js')
const { watchProducts } = loadProductFile('watch.js')
const { ipadProducts } = loadProductFile('ipad.js')
const { sonyProducts } = loadProductFile('sony.js')
const { accessoriesProducts } = loadProductFile('accessories.js')
const { usedProducts } = loadProductFile('used.js')

const allProducts = [
  ...(iphoneProducts || []),
  ...(macProducts || []),
  ...(samsungProducts || []),
  ...(dysonProducts || []),
  ...(airpodsProducts || []),
  ...(watchProducts || []),
  ...(ipadProducts || []),
  ...(sonyProducts || []),
  ...(accessoriesProducts || []),
]

const allUsed = usedProducts || []

const { SERVICE_PRICING } = loadProductFile('service.js', dataDir)

// Категории (хардкод — в исходниках используют Vite image imports)
const categoriesData = [
  { slug: 'smartphones', name: 'Смартфоны', description: 'iPhone, Samsung Galaxy', image_url: '/uploads/categories/smartphones.png' },
  { slug: 'laptops', name: 'Ноутбуки', description: 'MacBook Pro, MacBook Air, iMac', image_url: '/uploads/categories/laptops.png' },
  { slug: 'tablets', name: 'Планшеты', description: 'iPad Pro, iPad Air, iPad', image_url: '/uploads/categories/tablets.png' },
  { slug: 'watches', name: 'Умные часы', description: 'Apple Watch, Samsung Watch', image_url: '/uploads/categories/watches.png' },
  { slug: 'headphones', name: 'Наушники', description: 'AirPods, Galaxy Buds', image_url: '/uploads/categories/headphones.png' },
  { slug: 'dyson', name: 'Dyson', description: 'Supersonic, Airwrap, Corrale', image_url: '/uploads/categories/dyson.png' },
  { slug: 'accessories', name: 'Аксессуары', description: 'Чехлы, зарядки, кабели', image_url: '/uploads/categories/accessories.png' },
  { slug: 'gaming', name: 'Игровые консоли', description: 'PlayStation 5, DualSense', image_url: '/uploads/categories/gaming.png' },
]

const brandsData = [
  { slug: 'apple', name: 'Apple', logo_url: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png' },
  { slug: 'samsung', name: 'Samsung', logo_url: 'https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/mo/360_197_1.png' },
  { slug: 'dyson', name: 'Dyson', logo_url: 'https://dyson-h.assetsadobe2.com/is/content/content/dam/dyson/icons/logo.svg' },
  { slug: 'sony', name: 'Sony', logo_url: 'https://www.sony.com/en/SonyInfo/CorporateInfo/Data/images/sony_logo.png' },
]

const brandDisplayNames = {
  'apple-smartphones': 'iPhone',
  'apple-laptops': 'Mac',
  'apple-tablets': 'iPad',
  'apple-watches': 'Apple Watch',
  'apple-headphones': 'AirPods',
  'samsung-smartphones': 'Samsung Galaxy',
  'apple-accessories': 'Apple',
  'dyson-dyson': 'Dyson',
  'sony-gaming': 'PlayStation',
}

// Новости → блог
const blogData = [
  {
    title: 'Эксперты APPGRADE предупреждают: без чехла ходить опасно для кармы',
    slug: 'bez-chekhla-opasno-dlya-karmy',
    excerpt: 'Наши специалисты провели масштабное исследование и выяснили, что iPhone без чехла притягивает неприятности.',
    content: '<p>Мы в APPGRADE всегда заботимся о наших клиентах, и сегодня хотим поделиться результатами нашего неофициального, но очень серьёзного исследования.</p><p>По статистике нашего сервисного центра, 73% обращений с разбитыми экранами приходятся на устройства без чехлов.</p><p>Наши мастера рекомендуют выбирать чехлы с усиленной защитой углов — именно туда приходится основной удар при падении.</p><p>В APPGRADE представлена коллекция оригинальных чехлов Apple, а также проверенные аксессуары от ведущих производителей.</p>',
    status: 'published',
    published_at: '2026-01-27T12:00:00.000Z',
  },
  {
    title: 'Apple Watch спас отношения — теперь он отвечает за тебя',
    slug: 'apple-watch-spas-otnosheniya',
    excerpt: 'Реальная история нашего клиента: как функция быстрых ответов на Apple Watch помогла сохранить мир в семье.',
    content: '<p>Один из наших постоянных клиентов поделился историей, которая заставила нас улыбнуться.</p><p>История простая: пока наш герой был на важном совещании, его жена написала «Что купить на ужин?». Apple Watch на запястье позволили за пару секунд отправить ответ.</p><p>С обновлением watchOS умные ответы стали ещё точнее.</p><p>В APPGRADE можно попробовать все модели Apple Watch — от SE до Ultra 2.</p>',
    status: 'published',
    published_at: '2026-01-24T12:00:00.000Z',
  },
  {
    title: 'Исследование: люди с новым iPhone зарабатывают на 40% больше',
    slug: 'iphone-i-zarplata',
    excerpt: 'Разбираемся в нашумевшем исследовании о связи между моделью смартфона и уровнем дохода.',
    content: '<p>В сети активно обсуждается исследование, согласно которому владельцы актуальных моделей iPhone в среднем зарабатывают на 40% больше.</p><p>Разумеется, покупка нового iPhone не повысит вашу зарплату автоматически. Исследование лишь фиксирует корреляцию.</p><p>Однако есть и практический аспект. Новые устройства действительно повышают продуктивность.</p><p>В APPGRADE мы помогаем клиентам выбирать технику осознанно. Программа Trade-in позволяет обменять старое устройство на новое с выгодой.</p>',
    status: 'published',
    published_at: '2026-01-20T12:00:00.000Z',
  },
]

// --- SEED ---

const seedTransaction = db.transaction(() => {
  // Сохраняем порядок изображений, настроенный в админке
  console.log('Сохранение порядка изображений...')
  const imageSortSnapshot = new Map()
  try {
    const rows = db.prepare(`
      SELECT p.slug, pv.color_name, pi.url, pi.sort_order
      FROM product_images pi
      JOIN product_variants pv ON pi.variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
    `).all()
    for (const row of rows) {
      imageSortSnapshot.set(`${row.slug}|${row.color_name}|${row.url}`, row.sort_order)
    }
    if (imageSortSnapshot.size > 0) {
      console.log(`  Сохранено ${imageSortSnapshot.size} записей порядка изображений`)
    }
  } catch (e) {
    // Таблицы могут не существовать при первом запуске
  }

  console.log('Очистка БД...')
  db.exec(`
    DELETE FROM product_relations;
    DELETE FROM product_sim_options;
    DELETE FROM product_images;
    DELETE FROM product_variants;
    DELETE FROM products;
    DELETE FROM brand_categories;
    DELETE FROM brands;
    DELETE FROM categories;
    DELETE FROM banners;
    DELETE FROM blog_posts;
    DELETE FROM service_prices;
    DELETE FROM service_items;
    DELETE FROM requests;
    DELETE FROM admin_users;
  `)

  // 1. Admin user
  console.log('Создание администратора...')
  const hash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)').run(
    'admin@appgrade.ru', hash, 'Администратор'
  )

  // 2. Категории
  console.log('Создание категорий...')
  const categoryMap = {} // slug → id
  const insertCat = db.prepare(
    'INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?)'
  )
  categoriesData.forEach((c, i) => {
    const result = insertCat.run(c.name, c.slug, c.description, c.image_url || null, i)
    categoryMap[c.slug] = result.lastInsertRowid
  })

  // 3. Бренды
  console.log('Создание брендов...')
  const brandMap = {} // slug → id
  const brandNameMap = {} // name → id
  const insertBrand = db.prepare(
    'INSERT INTO brands (name, slug, logo_url, sort_order) VALUES (?, ?, ?, ?)'
  )
  brandsData.forEach((b, i) => {
    const result = insertBrand.run(b.name, b.slug, b.logo_url, i)
    brandMap[b.slug] = result.lastInsertRowid
    brandNameMap[b.name] = result.lastInsertRowid
  })

  // 4. Brand-Category mappings
  console.log('Создание связей бренд-категория...')
  const insertBC = db.prepare(
    'INSERT OR IGNORE INTO brand_categories (brand_id, category_id, display_name, sort_order) VALUES (?, ?, ?, ?)'
  )
  let bcOrder = 0
  for (const [key, displayName] of Object.entries(brandDisplayNames)) {
    const [brandSlug, catSlug] = key.split('-')
    const brandId = brandMap[brandSlug]
    const catId = categoryMap[catSlug]
    if (brandId && catId) {
      insertBC.run(brandId, catId, displayName, bcOrder++)
    }
  }

  // 5. Товары
  console.log('Создание товаров...')
  const productIdMap = {} // original string id → db id
  const insertProduct = db.prepare(`
    INSERT INTO products (name, slug, category_id, brand_id, short_description, description, badges, specs, is_used, condition, condition_label, warranty, sort_order, active, dimensions, series)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `)
  const insertVariant = db.prepare(`
    INSERT INTO product_variants (product_id, color_name, color_hex, memory, price, old_price, stock_status, sort_order, sim_id, sim_name, attributes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertImage = db.prepare(
    'INSERT INTO product_images (variant_id, url, sort_order) VALUES (?, ?, ?)'
  )
  const insertSim = db.prepare(
    'INSERT INTO product_sim_options (product_id, sim_id, name, sort_order) VALUES (?, ?, ?, ?)'
  )

  function seedProduct(p, order, isUsed = false) {
    const catId = categoryMap[p.category]
    const brandId = brandNameMap[p.brand]
    if (!catId || !brandId) {
      console.warn(`  Пропуск ${p.name}: категория=${p.category} бренд=${p.brand}`)
      return
    }

    // Вычисляем dimensions из наличия color/memory/sim
    const dims = []
    const hasColor = p.variants?.some(v => v.color && v.color.name !== 'Default')
    const hasMemory = p.variants?.some(v => v.memory)
    const hasSim = p.simOptions?.length > 0
    if (hasColor) dims.push({ key: 'color', label: 'Цвет', type: 'color' })
    if (hasMemory) dims.push({ key: 'memory', label: 'Память', type: 'select' })
    if (hasSim) dims.push({ key: 'sim', label: 'Связь', type: 'select' })

    const result = insertProduct.run(
      p.name, p.slug, catId, brandId,
      p.shortDescription || null,
      p.description || null,
      JSON.stringify(p.badges || []),
      JSON.stringify(p.specs || {}),
      isUsed ? 1 : 0,
      p.condition || null,
      p.conditionLabel || null,
      p.warranty || null,
      order,
      JSON.stringify(dims),
      extractSeries(p.name) || null
    )
    const productId = result.lastInsertRowid
    productIdMap[p.id] = productId

    // Варианты — разворачиваем в комбинации с sim если есть simOptions
    if (p.variants?.length) {
      const variantsToSeed = []
      if (hasSim && p.simOptions?.length) {
        for (const v of p.variants) {
          for (const sim of p.simOptions) {
            variantsToSeed.push({ ...v, _sim: sim })
          }
        }
      } else {
        variantsToSeed.push(...p.variants.map(v => ({ ...v, _sim: null })))
      }

      variantsToSeed.forEach((v, vi) => {
        const colorName = v.color?.name || 'Default'
        const colorHex = v.color?.hex || '#000000'
        const stockStatus = v.inStock === false ? 'out_of_stock' : 'in_stock'

        // Собираем attributes
        const attrs = {}
        if (v.color && v.color.name !== 'Default') {
          const colorId = v.color.hex
            ? v.color.hex.replace('#', '').toLowerCase()
            : v.color.id || v.color.name.toLowerCase().replace(/[^a-zа-яё0-9]/g, '-')
          attrs.color = { id: colorId, name: v.color.name, hex: v.color.hex || '#000000' }
        }
        if (v.memory) {
          attrs.memory = { id: String(v.memory), name: v.memory >= 1024 ? `${v.memory / 1024} ТБ` : `${v.memory} ГБ` }
        }
        if (v._sim) {
          attrs.sim = { id: v._sim.id, name: v._sim.name }
        }

        const vResult = insertVariant.run(
          productId, colorName, colorHex,
          v.memory || null, v.price, v.oldPrice || null,
          stockStatus, vi,
          v._sim?.id || null, v._sim?.name || null,
          JSON.stringify(attrs)
        )

        // Изображения — только у первого sim-варианта (или если sim нет)
        const isFirstSim = !v._sim || v._sim === p.simOptions[0]
        if (isFirstSim && v.images?.length) {
          v.images.forEach((img, ii) => {
            const url = typeof img === 'string' ? img : String(img)
            insertImage.run(vResult.lastInsertRowid, url, ii)
          })
        }
      })
    }

    // SIM-опции
    if (p.simOptions?.length) {
      p.simOptions.forEach((s, i) => {
        insertSim.run(productId, s.id, s.name, i)
      })
    }
  }

  // Новые товары
  allProducts.forEach((p, i) => seedProduct(p, i, false))
  console.log(`  Новых товаров: ${allProducts.length}`)

  // Б/У товары
  allUsed.forEach((p, i) => seedProduct(p, i, true))
  console.log(`  Б/У товаров: ${allUsed.length}`)

  // 6. Связанные товары (после всех товаров)
  console.log('Создание связей товаров...')
  const insertRel = db.prepare(
    'INSERT OR IGNORE INTO product_relations (product_id, related_product_id) VALUES (?, ?)'
  )
  const allProductsList = [...allProducts, ...allUsed]
  for (const p of allProductsList) {
    if (p.relatedIds?.length) {
      const dbId = productIdMap[p.id]
      if (!dbId) continue
      for (const rid of p.relatedIds) {
        const relDbId = productIdMap[rid]
        if (relDbId) insertRel.run(dbId, relDbId)
      }
    }
  }

  // 7. Блог
  console.log('Создание статей блога...')
  const insertBlog = db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  for (const post of blogData) {
    insertBlog.run(post.title, post.slug, post.excerpt, post.content, post.status, post.published_at)
  }

  // 8. Баннеры
  console.log('Создание баннеров...')
  const insertBanner = db.prepare(`
    INSERT INTO banners (title, image_desktop, image_mobile, alt, link, active, sort_order)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `)
  const bannersData = [
    { title: 'iPhone 17 PRO MAX', image_desktop: '/uploads/banners/hero-desktop.png', image_mobile: '/uploads/banners/hero-mobile.png', alt: 'iPhone 17 PRO MAX', link: '/catalog/smartphones/apple/iphone-17-pro-max' },
    { title: 'Sony PlayStation 5', image_desktop: '/uploads/banners/banner-2-desktop.png', image_mobile: '/uploads/banners/banner-2-mobile.png', alt: 'Sony PlayStation 5', link: '/catalog/gaming' },
  ]
  bannersData.forEach((b, i) => {
    insertBanner.run(b.title, b.image_desktop, b.image_mobile, b.alt, b.link, i)
  })

  // 9. Услуги ремонта
  console.log('Создание услуг ремонта...')
  const servicePricing = SERVICE_PRICING || []
  const insertService = db.prepare(
    'INSERT INTO service_items (name, time, sort_order, active) VALUES (?, ?, ?, 1)'
  )
  const insertServicePrice = db.prepare(
    'INSERT INTO service_prices (service_item_id, model_id, price) VALUES (?, ?, ?)'
  )
  servicePricing.forEach((s, i) => {
    const result = insertService.run(s.name, s.time, i)
    const serviceId = result.lastInsertRowid
    if (s.prices) {
      for (const [modelId, price] of Object.entries(s.prices)) {
        if (price) insertServicePrice.run(serviceId, modelId, price)
      }
    }
  })

  // Восстанавливаем порядок изображений из snapshot
  if (imageSortSnapshot.size > 0) {
    console.log('Восстановление порядка изображений...')
    const updateSort = db.prepare(`
      UPDATE product_images SET sort_order = ?
      WHERE id = (
        SELECT pi.id FROM product_images pi
        JOIN product_variants pv ON pi.variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        WHERE p.slug = ? AND pv.color_name = ? AND pi.url = ?
      )
    `)
    let restored = 0
    for (const [key, sortOrder] of imageSortSnapshot) {
      const [slug, colorName, url] = key.split('|')
      const result = updateSort.run(sortOrder, slug, colorName, url)
      if (result.changes > 0) restored++
    }
    console.log(`  Восстановлено: ${restored} из ${imageSortSnapshot.size}`)
  }

  // Итоги
  const stats = {
    categories: db.prepare('SELECT COUNT(*) as c FROM categories').get().c,
    brands: db.prepare('SELECT COUNT(*) as c FROM brands').get().c,
    products: db.prepare('SELECT COUNT(*) as c FROM products').get().c,
    variants: db.prepare('SELECT COUNT(*) as c FROM product_variants').get().c,
    images: db.prepare('SELECT COUNT(*) as c FROM product_images').get().c,
    blogPosts: db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c,
    banners: db.prepare('SELECT COUNT(*) as c FROM banners').get().c,
    services: db.prepare('SELECT COUNT(*) as c FROM service_items').get().c,
  }

  console.log('\nГотово!')
  console.log(`  Категорий: ${stats.categories}`)
  console.log(`  Брендов: ${stats.brands}`)
  console.log(`  Товаров: ${stats.products}`)
  console.log(`  Вариантов: ${stats.variants}`)
  console.log(`  Изображений: ${stats.images}`)
  console.log(`  Статей: ${stats.blogPosts}`)
  console.log(`  Баннеров: ${stats.banners}`)
  console.log(`  Услуг: ${stats.services}`)
  console.log(`\n  Логин: admin@appgrade.ru`)
})

try {
  seedTransaction()
} catch (e) {
  console.error('Ошибка seed:', e.message)
  process.exit(1)
}
