import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import db from '../db.js'
import { verifyToken } from '../auth.js'

const router = Router()

const requestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Слишком много запросов, попробуйте позже' },
  standardHeaders: true,
  legacyHeaders: false,
})

const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_COMMENT_LENGTH = 5000

// Публичный: создание заявки
router.post('/', requestLimiter, (req, res) => {
  const { type, name, phone, email, product_name, variant_info, product_id, comment } = req.body
  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' })
  }

  if (!PHONE_RE.test(phone)) {
    return res.status(400).json({ error: 'Некорректный формат телефона' })
  }

  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Некорректный формат email' })
  }

  if (comment && comment.length > MAX_COMMENT_LENGTH) {
    return res.status(400).json({ error: `Комментарий не должен превышать ${MAX_COMMENT_LENGTH} символов` })
  }

  if (name.length > 200) {
    return res.status(400).json({ error: 'Имя слишком длинное' })
  }

  const safeProductId = Number.isInteger(Number(product_id)) && Number(product_id) > 0
    ? Number(product_id)
    : null

  try {
    const result = db.prepare(`
      INSERT INTO requests (type, name, phone, email, product_name, variant_info, product_id, comment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      type || 'order', name.trim(), phone.trim(), email?.trim() || null,
      product_name || null, variant_info || null, safeProductId,
      comment?.slice(0, MAX_COMMENT_LENGTH) || null
    )

    res.status(201).json({ id: result.lastInsertRowid, success: true })
  } catch (err) {
    console.error('Ошибка создания заявки:', err.message)
    res.status(500).json({ error: 'Ошибка сохранения заявки' })
  }
})

// Защищённые: список и обновление
router.get('/', verifyToken, (req, res) => {
  const { type, status, page = 1, limit = 50 } = req.query
  let where = []
  let params = []

  if (type) { where.push('type = ?'); params.push(type) }
  if (status) { where.push('status = ?'); params.push(status) }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const safePage = Math.max(1, Number(page) || 1)
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50))
  const offset = (safePage - 1) * safeLimit

  const total = db.prepare(`SELECT COUNT(*) as count FROM requests ${whereClause}`).get(...params)
  const items = db.prepare(`
    SELECT * FROM requests ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params, safeLimit, offset)

  res.json({ items, total: total.count, page: safePage, limit: safeLimit })
})

router.put('/:id', verifyToken, (req, res) => {
  const { status, admin_notes } = req.body
  const existing = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Заявка не найдена' })

  db.prepare(
    "UPDATE requests SET status = ?, admin_notes = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status ?? existing.status, admin_notes ?? existing.admin_notes, req.params.id)

  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id)
  res.json(request)
})

export default router
