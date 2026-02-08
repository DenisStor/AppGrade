import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC').all()
  res.json(categories)
})

router.get('/:id', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  if (!category) return res.status(404).json({ error: 'Категория не найдена' })
  res.json(category)
})

router.post('/', (req, res) => {
  const { name, slug, description, image_url, parent_id, active } = req.body
  if (!name || !slug) return res.status(400).json({ error: 'Название и slug обязательны' })

  const exists = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)
  if (exists) return res.status(400).json({ error: 'Slug уже используется' })

  const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM categories').get()
  const sort_order = (maxOrder.max || 0) + 1

  const result = db.prepare(
    'INSERT INTO categories (name, slug, description, image_url, parent_id, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, slug, description || null, image_url || null, parent_id || null, active ?? 1, sort_order)

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(category)
})

router.put('/reorder', (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids обязателен' })

  const stmt = db.prepare('UPDATE categories SET sort_order = ?, updated_at = datetime("now") WHERE id = ?')
  const update = db.transaction((ids) => {
    ids.forEach((id, i) => stmt.run(i, id))
  })
  update(ids)
  res.json({ success: true })
})

router.put('/:id', (req, res) => {
  const { name, slug, description, image_url, parent_id, active } = req.body
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Категория не найдена' })

  if (slug && slug !== existing.slug) {
    const dup = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(slug, req.params.id)
    if (dup) return res.status(400).json({ error: 'Slug уже используется' })
  }

  db.prepare(
    'UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, parent_id = ?, active = ?, updated_at = datetime("now") WHERE id = ?'
  ).run(
    name ?? existing.name,
    slug ?? existing.slug,
    description ?? existing.description,
    image_url ?? existing.image_url,
    parent_id !== undefined ? parent_id : existing.parent_id,
    active ?? existing.active,
    req.params.id
  )

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  res.json(category)
})

router.delete('/:id', (req, res) => {
  const hasChildren = db.prepare('SELECT COUNT(*) as count FROM categories WHERE parent_id = ?').get(req.params.id)
  if (hasChildren.count > 0) {
    return res.status(400).json({ error: 'Нельзя удалить категорию с подкатегориями' })
  }

  const hasProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(req.params.id)
  if (hasProducts.count > 0) {
    return res.status(400).json({ error: 'Нельзя удалить категорию с товарами' })
  }

  const result = db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Категория не найдена' })
  res.json({ success: true })
})

export default router
