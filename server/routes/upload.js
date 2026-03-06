import { Router } from 'express'
import multer from 'multer'
import { extname, join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadsDir = join(__dirname, '..', 'uploads')

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024

const SIZE_CONFIG = {
  products:   { maxWidth: 2000, thumbWidth: 400 },
  banners:    { maxWidth: 1920 },
  blog:       { maxWidth: 1200 },
  categories: { maxWidth: 800 },
}

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

async function optimizeImage(filePath, type) {
  const config = SIZE_CONFIG[type] || SIZE_CONFIG.products
  const ext = extname(filePath).toLowerCase()

  // GIF не обрабатываем Sharp'ом
  if (ext === '.gif') return

  try {
    const pipeline = sharp(filePath).rotate()

    // Ресайз + сжатие оригинала
    const resizeOpts = { width: config.maxWidth, withoutEnlargement: true }

    if (ext === '.png') {
      const buf = await pipeline.clone()
        .resize(resizeOpts)
        .png({ quality: 100, compressionLevel: 9 })
        .toBuffer()
      await sharp(buf).toFile(filePath)
    } else if (ext === '.webp') {
      const buf = await pipeline.clone()
        .resize(resizeOpts)
        .webp({ quality: 100 })
        .toBuffer()
      await sharp(buf).toFile(filePath)
    } else {
      const buf = await pipeline.clone()
        .resize(resizeOpts)
        .jpeg({ quality: 100, progressive: true })
        .toBuffer()
      await sharp(buf).toFile(filePath)
    }

    // Генерация WebP-версии (кроме если уже webp)
    if (ext !== '.webp') {
      const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp')
      await sharp(filePath)
        .resize(resizeOpts)
        .webp({ quality: 100 })
        .toFile(webpPath)
    }

    // Миниатюра для products
    if (config.thumbWidth) {
      const thumbPath = filePath.replace(/(\.[^.]+)$/, `-thumb.webp`)
      await sharp(filePath)
        .resize({ width: config.thumbWidth, withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(thumbPath)
    }
  } catch (err) {
    console.error('Image optimization error:', err.message)
  }
}

const router = Router()

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' })
  }

  const type = req.body.type || 'products'
  const allowed = ['products', 'banners', 'blog', 'categories']
  const folder = allowed.includes(type) ? type : 'products'

  await optimizeImage(req.file.path, folder)

  res.json({ url: `/uploads/${folder}/${req.file.filename}` })
})

router.use((err, req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (макс. 10 МБ)' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
