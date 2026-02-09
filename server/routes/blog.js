import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const { status, page = 1, limit = 50 } = req.query
  const safePage = Math.max(1, Number(page) || 1)
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 50))
  let where = []
  let params = []

  if (status) { where.push('status = ?'); params.push(status) }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const offset = (safePage - 1) * safeLimit

  const total = db.prepare(`SELECT COUNT(*) as count FROM blog_posts ${whereClause}`).get(...params)
  const items = db.prepare(`
    SELECT * FROM blog_posts ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params, safeLimit, offset)

  res.json({ items, total: total.count, page: safePage, limit: safeLimit })
})

router.get('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ error: 'Статья не найдена' })
  res.json(post)
})

router.post('/', (req, res) => {
  const { title, slug, image_url, excerpt, content, status } = req.body
  if (!title || !slug) return res.status(400).json({ error: 'Заголовок и slug обязательны' })

  const exists = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(slug)
  if (exists) return res.status(400).json({ error: 'Slug уже используется' })

  const published_at = status === 'published' ? new Date().toISOString() : null

  const result = db.prepare(`
    INSERT INTO blog_posts (title, slug, image_url, excerpt, content, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, slug, image_url || null, excerpt || null, content || null, status || 'draft', published_at)

  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(post)
})

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Статья не найдена' })

  const { title, slug, image_url, excerpt, content, status } = req.body

  if (slug && slug !== existing.slug) {
    const dup = db.prepare('SELECT id FROM blog_posts WHERE slug = ? AND id != ?').get(slug, req.params.id)
    if (dup) return res.status(400).json({ error: 'Slug уже используется' })
  }

  let published_at = existing.published_at
  if (status === 'published' && existing.status !== 'published') {
    published_at = new Date().toISOString()
  }

  db.prepare(`
    UPDATE blog_posts SET title = ?, slug = ?, image_url = ?, excerpt = ?, content = ?, status = ?, published_at = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    title ?? existing.title,
    slug ?? existing.slug,
    image_url !== undefined ? image_url : existing.image_url,
    excerpt !== undefined ? excerpt : existing.excerpt,
    content !== undefined ? content : existing.content,
    status ?? existing.status,
    published_at,
    req.params.id
  )

  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id)
  res.json(post)
})

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Статья не найдена' })
  res.json({ success: true })
})

export default router
