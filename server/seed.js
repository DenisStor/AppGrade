import 'dotenv/config'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import db from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const productsDir = join(__dirname, '..', 'src', 'data', 'products')

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
function loadProductFile(filename) {
  let code = readFileSync(join(productsDir, filename), 'utf-8')

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
const { usedProducts } = loadProductFile('used.js')

const allProducts = [
  ...(iphoneProducts || []),
  ...(macProducts || []),
  ...(samsungProducts || []),
  ...(dysonProducts || []),
]

const allUsed = usedProducts || []

// Категории (хардкод — в исходниках используют Vite image imports)
const categoriesData = [
  { slug: 'smartphones', name: 'Смартфоны', description: 'iPhone, Samsung Galaxy', image_url: '/uploads/categories/smartphones.jpg' },
  { slug: 'laptops', name: 'Ноутбуки', description: 'MacBook Pro, MacBook Air, iMac', image_url: '/uploads/categories/laptops.jpg' },
  { slug: 'tablets', name: 'Планшеты', description: 'iPad Pro, iPad Air, iPad', image_url: '/uploads/categories/tablets.jpg' },
  { slug: 'watches', name: 'Умные часы', description: 'Apple Watch, Samsung Watch', image_url: '/uploads/categories/watches.jpg' },
  { slug: 'headphones', name: 'Наушники', description: 'AirPods, Galaxy Buds', image_url: '/uploads/categories/headphones.jpg' },
  { slug: 'hairdryers', name: 'Фены', description: 'Dyson Supersonic', image_url: '/uploads/categories/hairdryers.jpg' },
  { slug: 'stylers', name: 'Стайлеры', description: 'Dyson Airwrap, Corrale', image_url: null },
  { slug: 'accessories', name: 'Аксессуары', description: 'Чехлы, зарядки, кабели', image_url: '/uploads/categories/accessories.jpg' },
  { slug: 'gaming', name: 'Игровые консоли', description: 'PlayStation 5, DualSense', image_url: null },
]

const brandsData = [
  { slug: 'apple', name: 'Apple', logo_url: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png' },
  { slug: 'samsung', name: 'Samsung', logo_url: 'https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/mo/360_197_1.png' },
  { slug: 'dyson', name: 'Dyson', logo_url: 'https://dyson-h.assetsadobe2.com/is/content/content/dam/dyson/icons/logo.svg' },
]

const brandDisplayNames = {
  'apple-smartphones': 'iPhone',
  'apple-laptops': 'Mac',
  'apple-tablets': 'iPad',
  'apple-watches': 'Apple Watch',
  'apple-headphones': 'AirPods',
  'samsung-smartphones': 'Samsung Galaxy',
  'samsung-watches': 'Samsung Galaxy Watch',
  'samsung-headphones': 'Samsung Galaxy Buds',
  'dyson-hairdryers': 'Dyson',
  'dyson-stylers': 'Dyson',
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
    INSERT INTO products (name, slug, category_id, brand_id, short_description, description, badges, specs, is_used, condition, condition_label, warranty, sort_order, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `)
  const insertVariant = db.prepare(`
    INSERT INTO product_variants (product_id, color_name, color_hex, memory, price, old_price, stock_status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      order
    )
    const productId = result.lastInsertRowid
    productIdMap[p.id] = productId

    // Варианты
    if (p.variants?.length) {
      p.variants.forEach((v, vi) => {
        const colorName = v.color?.name || 'Default'
        const colorHex = v.color?.hex || '#000000'
        const stockStatus = v.inStock === false ? 'out_of_stock' : 'in_stock'

        const vResult = insertVariant.run(
          productId, colorName, colorHex,
          v.memory || null, v.price, v.oldPrice || null,
          stockStatus, vi
        )

        // Изображения
        if (v.images?.length) {
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

  // Итоги
  const stats = {
    categories: db.prepare('SELECT COUNT(*) as c FROM categories').get().c,
    brands: db.prepare('SELECT COUNT(*) as c FROM brands').get().c,
    products: db.prepare('SELECT COUNT(*) as c FROM products').get().c,
    variants: db.prepare('SELECT COUNT(*) as c FROM product_variants').get().c,
    images: db.prepare('SELECT COUNT(*) as c FROM product_images').get().c,
    blogPosts: db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c,
    banners: db.prepare('SELECT COUNT(*) as c FROM banners').get().c,
  }

  console.log('\nГотово!')
  console.log(`  Категорий: ${stats.categories}`)
  console.log(`  Брендов: ${stats.brands}`)
  console.log(`  Товаров: ${stats.products}`)
  console.log(`  Вариантов: ${stats.variants}`)
  console.log(`  Изображений: ${stats.images}`)
  console.log(`  Статей: ${stats.blogPosts}`)
  console.log(`  Баннеров: ${stats.banners}`)
  console.log(`\n  Логин: admin@appgrade.ru`)
})

try {
  seedTransaction()
} catch (e) {
  console.error('Ошибка seed:', e.message)
  process.exit(1)
}
