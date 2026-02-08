import { Router } from 'express'
import multer from 'multer'
import { extname, join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadsDir = join(__dirname, '..', 'uploads')

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const type = req.body.type || 'products'
    const allowed = ['products', 'banners', 'blog', 'categories']
    const folder = allowed.includes(type) ? type : 'products'
    cb(null, join(uploadsDir, folder))
  },
  filename(req, file, cb) {
    const ext = extname(file.originalname).toLowerCase()
    cb(null, `${randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter(req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Допустимые форматы: jpg, png, webp, gif'))
    }
  },
})

const router = Router()

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' })
  }

  const type = req.body.type || 'products'
  const allowed = ['products', 'banners', 'blog', 'categories']
  const folder = allowed.includes(type) ? type : 'products'

  res.json({ url: `/uploads/${folder}/${req.file.filename}` })
})

router.use((err, req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (макс. 5 МБ)' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
