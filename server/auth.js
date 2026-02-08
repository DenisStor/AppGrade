import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET
if (!SECRET) {
  console.error('FATAL: JWT_SECRET не задан в переменных окружения')
  console.error('Запустите: JWT_SECRET=your-secret-key node server/index.js')
  process.exit(1)
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '4h' })
}

export function verifyToken(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }

  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Невалидный токен' })
  }
}
