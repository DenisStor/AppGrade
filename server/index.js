import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { verifyToken } from './auth.js'

import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import imageRoutes from './routes/image.js'
import dashboardRoutes from './routes/dashboard.js'
import bannersRoutes from './routes/banners.js'
import categoriesRoutes from './routes/categories.js'
import productsRoutes from './routes/products.js'
import requestsRoutes from './routes/requests.js'
import blogRoutes from './routes/blog.js'
import brandsRoutes from './routes/brands.js'
import servicesRoutes from './routes/services.js'
import publicRoutes from './routes/public.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const uploadsDir = join(__dirname, 'uploads')

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '0')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// Rate limiter для /api/auth/login
const loginAttempts = new Map()
const LOGIN_WINDOW = 15 * 60 * 1000 // 15 минут
const MAX_ATTEMPTS = 10

function loginRateLimiter(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (record) {
    if (now - record.firstAttempt > LOGIN_WINDOW) {
      loginAttempts.set(ip, { count: 1, firstAttempt: now })
    } else if (record.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((record.firstAttempt + LOGIN_WINDOW - now) / 1000)
      res.setHeader('Retry-After', retryAfter)
      return res.status(429).json({ error: 'Слишком много попыток. Попробуйте позже.' })
    } else {
      record.count++
    }
  } else {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  }

  next()
}

// Очистка устаревших записей раз в 15 минут
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of loginAttempts) {
    if (now - record.firstAttempt > LOGIN_WINDOW) loginAttempts.delete(ip)
  }
}, LOGIN_WINDOW)

app.use(compression())
app.use(cors({
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:4173'],
}))
app.use(express.json({ limit: '10mb' }))

// Изображения: on-the-fly ресайз → WebP content negotiation → статика
app.use('/uploads', imageRoutes)
app.use('/uploads', (req, res, next) => {
  if (req.headers.accept?.includes('image/webp') && !req.path.endsWith('.webp')) {
    const webpPath = req.path.replace(/\.(png|jpe?g)$/i, '.webp')
    const fullPath = join(uploadsDir, webpPath)
    if (existsSync(fullPath)) {
      res.type('image/webp')
      return res.sendFile(fullPath)
    }
  }
  next()
})
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
}))

// Публичные
app.post('/api/auth/login', loginRateLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/public', publicRoutes)
// POST /api/requests — публичный (middleware внутри роута)
app.use('/api/requests', requestsRoutes)

// Защищённые
app.use('/api/upload', verifyToken, uploadRoutes)
app.use('/api/dashboard', verifyToken, dashboardRoutes)
app.use('/api/banners', verifyToken, bannersRoutes)
app.use('/api/categories', verifyToken, categoriesRoutes)
app.use('/api/products', verifyToken, productsRoutes)
app.use('/api/brands', verifyToken, brandsRoutes)
app.use('/api/blog', verifyToken, blogRoutes)
app.use('/api/services', verifyToken, servicesRoutes)

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}:`, err.message)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Внутренняя ошибка сервера'
      : err.message,
  })
})

app.listen(PORT, () => {
  console.log(`API сервер запущен на http://localhost:${PORT}`)
})
