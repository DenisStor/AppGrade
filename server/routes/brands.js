import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (req, res) => {
  const brands = db.prepare('SELECT * FROM brands ORDER BY sort_order ASC').all()
  res.json(brands)
})

export default router
