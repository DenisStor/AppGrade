import { Router } from 'express'
import { join, extname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, readdir, stat, unlink } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadsDir = join(__dirname, '..', 'uploads')
const cacheDir = join(uploadsDir, '.cache')

if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true })

const ALLOWED_WIDTHS = [200, 400, 800, 1200, 1920]
const ALLOWED_FORMATS = ['webp', 'jpeg', 'png', 'avif']
const MAX_WIDTH = 1920
const CACHE_MAX_FILES = 500

async function evictCache() {
  try {
    const files = await readdir(cacheDir)
    if (files.length <= CACHE_MAX_FILES) return

    const entries = await Promise.all(
      files.map(async (name) => {
        const path = join(cacheDir, name)
        const s = await stat(path).catch(() => null)
        return s ? { path, mtimeMs: s.mtimeMs } : null
      })
    )

    const sorted = entries.filter(Boolean).sort((a, b) => a.mtimeMs - b.mtimeMs)
    const toDelete = sorted.slice(0, sorted.length - CACHE_MAX_FILES)
    await Promise.all(toDelete.map((e) => unlink(e.path).catch(() => {})))
  } catch {
    // не критично — пропускаем
  }
}

const router = Router()

router.get(/\.(png|jpe?g|webp)$/i, async (req, res, next) => {
  const { w, format } = req.query
  if (!w && !format) return next()

  const width = parseInt(w, 10)
  if (w && (isNaN(width) || width < 1 || width > MAX_WIDTH)) {
    return res.status(400).json({ error: `Ширина: 1-${MAX_WIDTH}px` })
  }

  const fmt = format?.toLowerCase()
  if (fmt && !ALLOWED_FORMATS.includes(fmt)) {
    return res.status(400).json({ error: `Формат: ${ALLOWED_FORMATS.join(', ')}` })
  }

  const sourcePath = join(uploadsDir, req.path)
  if (!existsSync(sourcePath)) return next()

  const snappedWidth = width
    ? ALLOWED_WIDTHS.reduce((prev, curr) =>
        Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
      )
    : null

  const ext = fmt || extname(req.path).slice(1).toLowerCase().replace('jpg', 'jpeg')
  const pathKey = req.path.replace(/^\//, '').replace(/\//g, '-').replace(/\.[^.]+$/, '')
  const cacheKey = `${pathKey}-${snappedWidth || 'orig'}.${ext}`
  const cachePath = join(cacheDir, cacheKey)

  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`

  try {
    if (existsSync(cachePath)) {
      const buf = await readFile(cachePath)
      res.type(contentType)
      res.send(buf)
      return
    }

    let pipeline = sharp(sourcePath)

    if (snappedWidth) {
      pipeline = pipeline.resize({ width: snappedWidth, withoutEnlargement: true })
    }

    switch (ext) {
      case 'webp':
        pipeline = pipeline.webp({ quality: 80 })
        break
      case 'avif':
        pipeline = pipeline.avif({ quality: 65 })
        break
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: 80, progressive: true })
        break
      case 'png':
        pipeline = pipeline.png({ quality: 80, compressionLevel: 9 })
        break
    }

    const buffer = await pipeline.toBuffer()
    writeFile(cachePath, buffer).catch(() => {})
    evictCache().catch(() => {})

    res.type(contentType)
    res.send(buffer)
  } catch (err) {
    console.error('Image resize error:', err.message)
    next()
  }
})

export default router
