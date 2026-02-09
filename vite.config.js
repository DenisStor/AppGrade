import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

function heroPreloadPlugin() {
  let heroDesktopWebp = ''
  let heroMobileWebp = ''

  return {
    name: 'hero-preload',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const name of Object.keys(bundle)) {
        if (name.includes('hero-desktop') && name.endsWith('.webp'))
          heroDesktopWebp = name
        if (name.includes('hero-mobile') && name.endsWith('.webp'))
          heroMobileWebp = name
      }
    },
    transformIndexHtml(html) {
      if (!heroDesktopWebp) return html
      const tags = [
        `<link rel="preload" as="image" href="/${heroDesktopWebp}" type="image/webp" media="(min-width: 1024px)">`,
        `<link rel="preload" as="image" href="/${heroMobileWebp}" type="image/webp" media="(max-width: 1023px)">`,
      ]
      return html.replace('</head>', tags.join('\n') + '\n</head>')
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80, compressionLevel: 9 },
      jpeg: { quality: 80, progressive: true },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
      cache: true,
      cacheLocation: '.cache/image-optimizer',
    }),
    heroPreloadPlugin(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
})
