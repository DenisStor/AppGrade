import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, extname, basename, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets')

const SIZE_CONFIG = {
  banners: 1920,
  categories: 800,
  products: 1200,
  'iphone-models': 800,
  news: 1200,
  about: 1200,
}
const DEFAULT_MAX_WIDTH = 1200

const SUPPORTED_EXTS = ['.png', '.jpg', '.jpeg']

let totalOriginal = 0
let totalOptimized = 0
let filesProcessed = 0
let filesSkipped = 0

function getMaxWidth(filePath) {
  const rel = relative(ASSETS_DIR, filePath)
  const folder = rel.split('/')[0]
  return SIZE_CONFIG[folder] || DEFAULT_MAX_WIDTH
}

async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase()
  if (!SUPPORTED_EXTS.includes(ext)) {
    filesSkipped++
    return
  }

  const stats = await stat(filePath)
  totalOriginal += stats.size

  const maxWidth = getMaxWidth(filePath)
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp')

  try {
    const pipeline = sharp(filePath).rotate()
    const metadata = await pipeline.metadata()

    const needsResize = metadata.width > maxWidth

    // Оптимизировать оригинал
    const resizeOpts = needsResize
      ? { width: maxWidth, withoutEnlargement: true }
      : undefined

    if (ext === '.png') {
      const buf = await pipeline.clone()
        .resize(resizeOpts)
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer()
      await sharp(buf).toFile(filePath)
      totalOptimized += buf.length
    } else {
      const buf = await pipeline.clone()
        .resize(resizeOpts)
        .jpeg({ quality: 80, progressive: true })
        .toBuffer()
      await sharp(buf).toFile(filePath)
      totalOptimized += buf.length
    }

    // Генерация WebP (из уже оптимизированного файла, resize не нужен)
    const webpBuf = await sharp(filePath)
      .webp({ quality: 80 })
      .toBuffer()
    await sharp(webpBuf).toFile(webpPath)

    const saved = stats.size - (await stat(filePath)).size
    const percent = ((saved / stats.size) * 100).toFixed(1)

    filesProcessed++
    console.log(
      `✓ ${relative(ASSETS_DIR, filePath)}` +
      ` — ${formatSize(stats.size)} → ${formatSize((await stat(filePath)).size)}` +
      ` (−${percent}%) + WebP ${formatSize(webpBuf.length)}`
    )
  } catch (err) {
    console.error(`✗ ${relative(ASSETS_DIR, filePath)}: ${err.message}`)
  }
}

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkDir(fullPath))
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase()
      if (SUPPORTED_EXTS.includes(ext)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

async function main() {
  console.log(`\nОптимизация ассетов в ${ASSETS_DIR}\n`)

  const files = await walkDir(ASSETS_DIR)
  console.log(`Найдено ${files.length} изображений\n`)

  for (const file of files) {
    await processFile(file)
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Обработано: ${filesProcessed} файлов`)
  console.log(`Пропущено: ${filesSkipped} файлов`)
  console.log(`До: ${formatSize(totalOriginal)}`)
  console.log(`После: ${formatSize(totalOptimized)}`)
  console.log(`Экономия: ${formatSize(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`)
  console.log(`+ WebP версии для каждого файла`)
}

main().catch(console.error)
