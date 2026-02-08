import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const banners = db.prepare('SELECT * FROM banners ORDER BY sort_order ASC, id ASC').all()
  res.json(banners)
})

router.get('/:id', (req, res) => {
  const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id)
  if (!banner) return res.status(404).json({ error: 'Баннер не найден' })
  res.json(banner)
})

router.post('/', (req, res) => {
  const { title, image_desktop, image_mobile, alt, link, active } = req.body
  if (!image_desktop || !image_mobile) {
    return res.status(400).json({ error: 'Изображения обязательны' })
  }

  const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM banners').get()
  const sort_order = (maxOrder.max || 0) + 1

  const result = db.prepare(
    'INSERT INTO banners (title, image_desktop, image_mobile, alt, link, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title || null, image_desktop, image_mobile, alt || null, link || null, active ?? 1, sort_order)

  const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(banner)
})

router.put('/reorder', (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids обязателен' })

  const stmt = db.prepare('UPDATE banners SET sort_order = ?, updated_at = datetime("now") WHERE id = ?')
  const update = db.transaction((ids) => {
    ids.forEach((id, i) => stmt.run(i, id))
  })
  update(ids)
  res.json({ success: true })
})

router.put('/:id', (req, res) => {
  const { title, image_desktop, image_mobile, alt, link, active } = req.body
  const existing = db.prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Баннер не найден' })

  db.prepare(
    'UPDATE banners SET title = ?, image_desktop = ?, image_mobile = ?, alt = ?, link = ?, active = ?, updated_at = datetime("now") WHERE id = ?'
  ).run(
    title ?? existing.title,
    image_desktop ?? existing.image_desktop,
    image_mobile ?? existing.image_mobile,
    alt ?? existing.alt,
    link ?? existing.link,
    active ?? existing.active,
    req.params.id
  )

  const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id)
  res.json(banner)
})

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Баннер не найден' })
  res.json({ success: true })
})

export default router
