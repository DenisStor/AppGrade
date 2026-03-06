import { readdir, mkdir, stat, copyFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE_DIR = join(process.env.HOME, 'Desktop', 'iPhone_Shop_Photos_JPEG_NoBG')
const OUTPUT_DIR = join(__dirname, '..', 'public', 'images', 'iphone')

// Model folder → output prefix mapping
const MODEL_MAP = {
  'iPhone_17_Pro_Max': '17-pro-max',
  'iPhone_17_Pro': '17-pro',
  'iPhone_17': '17',
  'iPhone_Air': '17-air',
  'iPhone_16_Pro_Max': '16-pro-max',
  'iPhone_16_Pro': '16-pro',
  'iPhone_16_Plus': '16-plus',
  'iPhone_16': '16',
  'iPhone_16e': '17e',
  'iPhone_15_Pro_Max': '15-pro-max',
  'iPhone_15': '15',
}

// Color folder → output slug mapping
const COLOR_MAP = {
  'Cosmic_Orange': 'cosmic-orange',
  'Deep_Blue': 'deep-blue',
  'Silver': 'silver',
  'Black': 'black',
  'Lavender': 'lavender',
  'Mist_Blue': 'mist-blue',
  'Sage': 'sage',
  'White': 'white',
  'Pink': 'pink',
  'Teal': 'teal',
  'Ultramarine': 'ultramarine',
  'Black_Titanium': 'black-titanium',
  'Desert_Titanium': 'desert-titanium',
  'Natural_Titanium': 'natural-titanium',
  'White_Titanium': 'white-titanium',
  'Blue_Titanium': 'blue-titanium',
  'Blue': 'blue',
  'Green': 'green',
  'Yellow': 'yellow',
  'Cloud_White': 'cloud-white',
  'Light_Gold': 'light-gold',
  'Sky_Blue': 'sky-blue',
  'Space_Black': 'space-black',
}

// Photo file → view mapping
const VIEW_MAP = {
  '01_front_back.png': 'front',
  '02_side.png': 'side',
  '03_camera_closeup.png': 'camera',
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`)
    process.exit(1)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })

  let processed = 0
  let totalOriginal = 0
  let totalOptimized = 0

  for (const [modelDir, modelSlug] of Object.entries(MODEL_MAP)) {
    const modelPath = join(SOURCE_DIR, modelDir)
    if (!existsSync(modelPath)) {
      console.warn(`Skipping missing model: ${modelDir}`)
      continue
    }

    const colorDirs = await readdir(modelPath)

    for (const colorDir of colorDirs) {
      const colorSlug = COLOR_MAP[colorDir]
      if (!colorSlug) {
        console.warn(`Unknown color folder: ${modelDir}/${colorDir}`)
        continue
      }

      const colorPath = join(modelPath, colorDir)
      const files = await readdir(colorPath)

      for (const file of files) {
        const view = VIEW_MAP[file]
        if (!view) continue

        const srcPath = join(colorPath, file)
        const outName = `${modelSlug}-${colorSlug}-${view}.png`
        const outPath = join(OUTPUT_DIR, outName)

        const srcStats = await stat(srcPath)
        totalOriginal += srcStats.size

        await copyFile(srcPath, outPath)
        processed++

        console.log(`  ${outName} — ${formatSize(srcStats.size)}`)
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Copied: ${processed} files`)
  console.log(`Total:  ${formatSize(totalOriginal)}`)
  console.log(`Output: ${OUTPUT_DIR}`)
}

main().catch(console.error)
