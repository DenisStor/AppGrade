import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'data', 'store.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER REFERENCES categories(id),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      logo_url TEXT,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS brand_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      display_name TEXT,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(brand_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      brand_id INTEGER NOT NULL REFERENCES brands(id),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_description TEXT,
      description TEXT,
      badges TEXT DEFAULT '[]',
      specs TEXT DEFAULT '{}',
      is_used INTEGER DEFAULT 0,
      condition TEXT,
      condition_label TEXT,
      warranty TEXT,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      memory INTEGER,
      price INTEGER NOT NULL,
      old_price INTEGER,
      stock_status TEXT DEFAULT 'in_stock' CHECK(stock_status IN ('in_stock','on_order','out_of_stock')),
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_sim_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      sim_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_relations (
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      related_product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      PRIMARY KEY (product_id, related_product_id)
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      image_desktop TEXT NOT NULL,
      image_mobile TEXT NOT NULL,
      alt TEXT,
      link TEXT,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image_url TEXT,
      excerpt TEXT,
      content TEXT,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')),
      published_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT DEFAULT 'order' CHECK(type IN ('order','quick_buy','repair','contact')),
      status TEXT DEFAULT 'new' CHECK(status IN ('new','processing','closed')),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      product_name TEXT,
      variant_info TEXT,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      comment TEXT,
      admin_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS service_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      time TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS service_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_item_id INTEGER NOT NULL REFERENCES service_items(id) ON DELETE CASCADE,
      model_id TEXT NOT NULL,
      price TEXT NOT NULL,
      UNIQUE(service_item_id, model_id)
    );
  `)

  // Миграции для существующих таблиц
  try {
    db.exec('ALTER TABLE product_sim_options ADD COLUMN price_modifier INTEGER DEFAULT 0')
  } catch { /* колонка уже существует */ }

  try { db.exec('ALTER TABLE product_variants ADD COLUMN sim_id TEXT') } catch {}
  try { db.exec('ALTER TABLE product_variants ADD COLUMN sim_name TEXT') } catch {}

  // Произвольные измерения (dimensions/attributes)
  try { db.exec("ALTER TABLE products ADD COLUMN dimensions TEXT DEFAULT '[]'") } catch {}
  try { db.exec("ALTER TABLE product_variants ADD COLUMN attributes TEXT DEFAULT '{}'") } catch {}

  migrateToAttributes()

  // Индексы для производительности
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
    CREATE INDEX IF NOT EXISTS idx_products_is_used ON products(is_used);
    CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_images_variant ON product_images(variant_id);
    CREATE INDEX IF NOT EXISTS idx_product_sim_product ON product_sim_options(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_relations_product ON product_relations(product_id);
    CREATE INDEX IF NOT EXISTS idx_brand_categories_category ON brand_categories(category_id);
    CREATE INDEX IF NOT EXISTS idx_brand_categories_brand ON brand_categories(brand_id);
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
    CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_service_prices_item ON service_prices(service_item_id);
    CREATE INDEX IF NOT EXISTS idx_service_items_active ON service_items(active);
  `)
}

function migrateToAttributes() {
  // Заполняет attributes/dimensions из legacy-колонок (однократно)
  const needMigration = db.prepare(
    "SELECT COUNT(*) as count FROM product_variants WHERE attributes = '{}' AND color_name IS NOT NULL AND color_name != ''"
  ).get()
  if (!needMigration.count) return

  const products = db.prepare('SELECT id FROM products').all()

  const updateVariant = db.prepare('UPDATE product_variants SET attributes = ? WHERE id = ?')
  const updateProduct = db.prepare('UPDATE products SET dimensions = ? WHERE id = ?')

  const tx = db.transaction(() => {
    for (const p of products) {
      const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(p.id)
      if (!variants.length) continue

      const dims = []
      const hasColor = variants.some(v => v.color_name)
      const hasMemory = variants.some(v => v.memory)
      const hasSim = variants.some(v => v.sim_id)

      if (hasColor) dims.push({ key: 'color', label: 'Цвет', type: 'color' })
      if (hasMemory) dims.push({ key: 'memory', label: 'Память', type: 'select' })
      if (hasSim) dims.push({ key: 'sim', label: 'Связь', type: 'select' })

      updateProduct.run(JSON.stringify(dims), p.id)

      for (const v of variants) {
        const attrs = {}
        if (v.color_name) {
          const colorId = v.color_hex
            ? v.color_hex.replace('#', '').toLowerCase()
            : v.color_name.toLowerCase().replace(/[^a-zа-яё0-9]/g, '-')
          attrs.color = { id: colorId, name: v.color_name, hex: v.color_hex || '#000000' }
        }
        if (v.memory) {
          attrs.memory = { id: String(v.memory), name: `${v.memory >= 1024 ? `${v.memory / 1024} ТБ` : `${v.memory} ГБ`}` }
        }
        if (v.sim_id) {
          attrs.sim = { id: v.sim_id, name: v.sim_name || v.sim_id }
        }
        updateVariant.run(JSON.stringify(attrs), v.id)
      }
    }
  })
  tx()
}

migrate()

export default db
