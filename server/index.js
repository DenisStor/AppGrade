import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { verifyToken } from './auth.js'

import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import dashboardRoutes from './routes/dashboard.js'
import bannersRoutes from './routes/banners.js'
import categoriesRoutes from './routes/categories.js'
import productsRoutes from './routes/products.js'
import requestsRoutes from './routes/requests.js'
import blogRoutes from './routes/blog.js'
import publicRoutes from './routes/public.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(compression())
app.use(cors({
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:4173'],
}))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(join(__dirname, 'uploads'), {
  maxAge: '7d',
}))

// Публичные
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
app.use('/api/blog', verifyToken, blogRoutes)

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
