import { Router } from 'express'
import db from '../db.js'

const router = Router()

function enrichServices(services) {
  if (!services.length) return services

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

  return services
}

// GET / — все услуги с ценами
router.get('/', (req, res) => {
  const services = db.prepare('SELECT * FROM service_items ORDER BY sort_order ASC, id ASC').all()
  enrichServices(services)
  res.json(services)
})

// PUT /reorder — пересортировка (до /:id!)
router.put('/reorder', (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids обязателен' })

  const stmt = db.prepare('UPDATE service_items SET sort_order = ?, updated_at = datetime("now") WHERE id = ?')
  const update = db.transaction((ids) => {
    ids.forEach((id, i) => stmt.run(i, id))
  })
  update(ids)
  res.json({ success: true })
})

// GET /:id — одна услуга
router.get('/:id', (req, res) => {
  const service = db.prepare('SELECT * FROM service_items WHERE id = ?').get(req.params.id)
  if (!service) return res.status(404).json({ error: 'Услуга не найдена' })
  enrichServices([service])
  res.json(service)
})

// POST / — создать
router.post('/', (req, res) => {
  const { name, time, prices, active } = req.body
  if (!name || !time) return res.status(400).json({ error: 'Название и время обязательны' })

  const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM service_items').get()
  const sort_order = (maxOrder.max || 0) + 1

  const createTx = db.transaction(() => {
    const result = db.prepare(
      'INSERT INTO service_items (name, time, sort_order, active) VALUES (?, ?, ?, ?)'
    ).run(name, time, sort_order, active ?? 1)

    const serviceId = result.lastInsertRowid

    if (prices && typeof prices === 'object') {
      const insertPrice = db.prepare(
        'INSERT INTO service_prices (service_item_id, model_id, price) VALUES (?, ?, ?)'
      )
      for (const [modelId, price] of Object.entries(prices)) {
        if (price) insertPrice.run(serviceId, modelId, price)
      }
    }

    return serviceId
  })

  const serviceId = createTx()
  const service = db.prepare('SELECT * FROM service_items WHERE id = ?').get(serviceId)
  enrichServices([service])
  res.status(201).json(service)
})

// PUT /:id — обновить
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM service_items WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Услуга не найдена' })

  const { name, time, prices, active } = req.body

  const updateTx = db.transaction(() => {
    db.prepare(
      'UPDATE service_items SET name = ?, time = ?, active = ?, updated_at = datetime("now") WHERE id = ?'
    ).run(name ?? existing.name, time ?? existing.time, active ?? existing.active, req.params.id)

    if (prices && typeof prices === 'object') {
      db.prepare('DELETE FROM service_prices WHERE service_item_id = ?').run(req.params.id)
      const insertPrice = db.prepare(
        'INSERT INTO service_prices (service_item_id, model_id, price) VALUES (?, ?, ?)'
      )
      for (const [modelId, price] of Object.entries(prices)) {
        if (price) insertPrice.run(req.params.id, modelId, price)
      }
    }
  })
  updateTx()

  const service = db.prepare('SELECT * FROM service_items WHERE id = ?').get(req.params.id)
  enrichServices([service])
  res.json(service)
})

// DELETE /:id — удалить (CASCADE удалит service_prices)
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM service_items WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Услуга не найдена' })
  res.json({ success: true })
})

export default router
