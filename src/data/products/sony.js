export const sonyProducts = [
  // ── PlayStation 5 Slim 1TB Disk ───────────────────
  {
    id: 'ps5-slim-disk',
    slug: 'ps5-slim-disk',
    category: 'gaming',
    brand: 'Sony',
    name: 'PlayStation 5 Slim 1TB Disk',
    shortDescription: 'Дисковая версия. 1 ТБ SSD. DualSense в комплекте.',
    badges: [],
    variants: [
      {
        id: 'ps5-slim-disk-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 49990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
    ],
    specs: {
      cpu: 'AMD Zen 2, 8 ядер, 3.5 ГГц',
      gpu: 'AMD RDNA 2, 10.28 TFLOPS',
      storage: '1 ТБ SSD',
      resolution: 'До 4K 120 Гц',
      weight: '3.2 кг',
    },
    description:
      'PlayStation 5 Slim с дисководом — компактная версия консоли нового поколения с 1 ТБ SSD и контроллером DualSense.',
    relatedIds: ['ps5-pro'],
  },

  // ── PlayStation 5 Pro 2TB ─────────────────────────
  {
    id: 'ps5-pro',
    slug: 'ps5-pro',
    category: 'gaming',
    brand: 'Sony',
    name: 'PlayStation 5 Pro 2TB',
    shortDescription: 'Улучшенный GPU. 2 ТБ SSD. Ray tracing.',
    badges: ['new'],
    variants: [
      {
        id: 'ps5-pro-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 74990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
    ],
    specs: {
      cpu: 'AMD Zen 2, 8 ядер, 3.85 ГГц',
      gpu: 'AMD RDNA 3, 16.7 TFLOPS',
      storage: '2 ТБ SSD',
      resolution: 'До 4K 120 Гц / 8K',
      weight: '3.1 кг',
    },
    description:
      'PlayStation 5 Pro — самая мощная консоль Sony с улучшенным GPU, 2 ТБ SSD и продвинутым ray tracing для максимального качества графики.',
    relatedIds: ['ps5-slim-disk'],
  },
]
