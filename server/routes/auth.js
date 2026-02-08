import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { signToken, verifyToken } from '../auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email)
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const token = signToken({ userId: user.id, email: user.email })
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  })
})

router.get('/me', verifyToken, (req, res) => {
  const user = db.prepare('SELECT id, email, name FROM admin_users WHERE id = ?').get(req.user.userId)
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
  res.json(user)
})

export default router
