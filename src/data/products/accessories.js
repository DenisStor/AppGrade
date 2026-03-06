export const accessoriesProducts = [
  // ── Apple Pencil Pro ──────────────────────────────
  {
    id: 'apple-pencil-pro',
    slug: 'apple-pencil-pro',
    category: 'accessories',
    brand: 'Apple',
    name: 'Apple Pencil Pro',
    shortDescription: 'Сжатие, бочкообразное вращение, тактильная отдача, поиск.',
    badges: ['new'],
    variants: [
      {
        id: 'apple-pencil-pro-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 11990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
    ],
    specs: {
      compatibility: 'iPad Pro M4/M5, iPad Air M2/M3',
      features: 'Сжатие, вращение, тактильная отдача',
      charging: 'Магнитная (iPad)',
      weight: '20.7 г',
    },
    description:
      'Apple Pencil Pro — самый продвинутый стилус Apple с поддержкой сжатия, бочкообразного вращения и тактильной отдачи.',
    relatedIds: ['apple-pencil-usbc', 'ipad-pro-11-m5'],
  },

  // ── Apple Pencil USB-C ────────────────────────────
  {
    id: 'apple-pencil-usbc',
    slug: 'apple-pencil-usbc',
    category: 'accessories',
    brand: 'Apple',
    name: 'Apple Pencil USB-C',
    shortDescription: 'Точность пикселя, низкая задержка, зарядка USB-C.',
    badges: [],
    variants: [
      {
        id: 'apple-pencil-usbc-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 10000,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
    ],
    specs: {
      compatibility: 'iPad (USB-C), iPad Air, iPad Pro, iPad mini',
      features: 'Точность пикселя, низкая задержка',
      charging: 'USB-C',
      weight: '20.5 г',
    },
    description:
      'Apple Pencil USB-C — доступный стилус с точностью пикселя, низкой задержкой и удобной зарядкой через USB-C.',
    relatedIds: ['apple-pencil-pro', 'ipad-11'],
  },
]
