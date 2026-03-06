const img = (model, color, views) =>
  views.map((v) => `/images/iphone/${model}-${color}-${v}.png`)

export const iphoneProducts = [
  // ── iPhone 17 Pro Max ─────────────────────────────
  {
    id: 'iphone-17-pro-max',
    slug: 'iphone-17-pro-max',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 17 Pro Max',
    shortDescription: 'Титановый корпус. Чип A19 Pro. Камера 48 Мп.',
    badges: ['new'],
    simOptions: [
      { id: 'dual', name: 'nanoSIM + eSIM' },
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Cosmic Orange
      {
        id: 'iphone-17-pro-max-cosmic-orange-256',
        color: { id: 'cosmic-orange', name: 'Космический оранжевый', hex: '#e07840' },
        memory: 256,
        price: 179990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'cosmic-orange', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-max-cosmic-orange-512',
        color: { id: 'cosmic-orange', name: 'Космический оранжевый', hex: '#e07840' },
        memory: 512,
        price: 199990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'cosmic-orange', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-max-cosmic-orange-1tb',
        color: { id: 'cosmic-orange', name: 'Космический оранжевый', hex: '#e07840' },
        memory: 1024,
        price: 229990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'cosmic-orange', ['front', 'side', 'camera']),
      },
      // Deep Blue
      {
        id: 'iphone-17-pro-max-deep-blue-256',
        color: { id: 'deep-blue', name: 'Глубокий синий', hex: '#3a4f6f' },
        memory: 256,
        price: 179990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'deep-blue', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-max-deep-blue-512',
        color: { id: 'deep-blue', name: 'Глубокий синий', hex: '#3a4f6f' },
        memory: 512,
        price: 199990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'deep-blue', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-max-deep-blue-1tb',
        color: { id: 'deep-blue', name: 'Глубокий синий', hex: '#3a4f6f' },
        memory: 1024,
        price: 229990,
        oldPrice: null,
        inStock: false,
        images: img('17-pro-max', 'deep-blue', ['front', 'side', 'camera']),
      },
      // Silver
      {
        id: 'iphone-17-pro-max-silver-256',
        color: { id: 'silver', name: 'Серебристый', hex: '#c0c0c0' },
        memory: 256,
        price: 179990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'silver', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-max-silver-512',
        color: { id: 'silver', name: 'Серебристый', hex: '#c0c0c0' },
        memory: 512,
        price: 199990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro-max', 'silver', ['front', 'side', 'camera']),
      },
    ],
    specs: {
      display: '6.9" Super Retina XDR OLED',
      chip: 'A19 Pro',
      camera: '48 Мп + 12 Мп + 12 Мп',
      battery: 'До 33 часов видео',
      weight: '227 г',
    },
    description:
      'iPhone 17 Pro Max — самый мощный iPhone с титановым корпусом, чипом A19 Pro и улучшенной камерой ProMotion.',
    relatedIds: ['iphone-17-pro', 'iphone-17'],
  },

  // ── iPhone 17 Pro ─────────────────────────────────
  {
    id: 'iphone-17-pro',
    slug: 'iphone-17-pro',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 17 Pro',
    shortDescription: 'Титановый корпус. Чип A19 Pro. Камера 48 Мп.',
    badges: ['new'],
    simOptions: [
      { id: 'dual', name: 'nanoSIM + eSIM' },
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Cosmic Orange
      {
        id: 'iphone-17-pro-cosmic-orange-128',
        color: { id: 'cosmic-orange', name: 'Космический оранжевый', hex: '#e07840' },
        memory: 128,
        price: 149990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro', 'cosmic-orange', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-cosmic-orange-256',
        color: { id: 'cosmic-orange', name: 'Космический оранжевый', hex: '#e07840' },
        memory: 256,
        price: 164990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro', 'cosmic-orange', ['front', 'side', 'camera']),
      },
      // Deep Blue
      {
        id: 'iphone-17-pro-deep-blue-128',
        color: { id: 'deep-blue', name: 'Глубокий синий', hex: '#3a4f6f' },
        memory: 128,
        price: 149990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro', 'deep-blue', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-deep-blue-256',
        color: { id: 'deep-blue', name: 'Глубокий синий', hex: '#3a4f6f' },
        memory: 256,
        price: 164990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro', 'deep-blue', ['front', 'side', 'camera']),
      },
      // Silver
      {
        id: 'iphone-17-pro-silver-128',
        color: { id: 'silver', name: 'Серебристый', hex: '#c0c0c0' },
        memory: 128,
        price: 149990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro', 'silver', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-pro-silver-256',
        color: { id: 'silver', name: 'Серебристый', hex: '#c0c0c0' },
        memory: 256,
        price: 164990,
        oldPrice: null,
        inStock: true,
        images: img('17-pro', 'silver', ['front', 'side', 'camera']),
      },
    ],
    specs: {
      display: '6.3" Super Retina XDR OLED',
      chip: 'A19 Pro',
      camera: '48 Мп + 12 Мп + 12 Мп',
      battery: 'До 27 часов видео',
      weight: '199 г',
    },
    description:
      'iPhone 17 Pro — компактный флагман с титановым корпусом, чипом A19 Pro и профессиональной камерой.',
    relatedIds: ['iphone-17-pro-max', 'iphone-17'],
  },

  // ── iPhone 17 ─────────────────────────────────────
  {
    id: 'iphone-17',
    slug: 'iphone-17',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 17',
    shortDescription: 'Чип A19. Dynamic Island. Камера 48 Мп.',
    badges: ['new'],
    simOptions: [
      { id: 'dual', name: 'nanoSIM + eSIM' },
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Black
      {
        id: 'iphone-17-black-128',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 128,
        price: 109990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'black', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-black-256',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 256,
        price: 124990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'black', ['front', 'side', 'camera']),
      },
      // Lavender
      {
        id: 'iphone-17-lavender-128',
        color: { id: 'lavender', name: 'Лавандовый', hex: '#c8b4d4' },
        memory: 128,
        price: 109990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'lavender', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-lavender-256',
        color: { id: 'lavender', name: 'Лавандовый', hex: '#c8b4d4' },
        memory: 256,
        price: 124990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'lavender', ['front', 'side', 'camera']),
      },
      // Mist Blue
      {
        id: 'iphone-17-mist-blue-128',
        color: { id: 'mist-blue', name: 'Туманный голубой', hex: '#a8c9e2' },
        memory: 128,
        price: 109990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'mist-blue', ['front', 'side', 'camera']),
      },
      // Sage
      {
        id: 'iphone-17-sage-128',
        color: { id: 'sage', name: 'Шалфейный', hex: '#b2c5a8' },
        memory: 128,
        price: 109990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'sage', ['front', 'side', 'camera']),
      },
      // White
      {
        id: 'iphone-17-white-128',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: 128,
        price: 109990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'white', ['front', 'side', 'camera']),
      },
      {
        id: 'iphone-17-white-256',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: 256,
        price: 124990,
        oldPrice: null,
        inStock: true,
        images: img('17', 'white', ['front', 'side', 'camera']),
      },
    ],
    specs: {
      display: '6.1" Super Retina XDR OLED',
      chip: 'A19',
      camera: '48 Мп + 12 Мп',
      battery: 'До 22 часов видео',
      weight: '170 г',
    },
    description:
      'iPhone 17 — стильный и производительный смартфон с чипом A19, Dynamic Island и улучшенной камерой.',
    relatedIds: ['iphone-17-pro', 'iphone-17-pro-max'],
  },

  // ── iPhone 17 Air ─────────────────────────────────
  {
    id: 'iphone-17-air',
    slug: 'iphone-17-air',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 17 Air',
    shortDescription: 'Самый тонкий iPhone. Чип A19. Камера 48 Мп.',
    badges: ['new'],
    simOptions: [
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Black
      {
        id: 'iphone-17-air-black-256',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 256,
        price: 129990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
      {
        id: 'iphone-17-air-black-512',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 512,
        price: 144990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
      // Starlight
      {
        id: 'iphone-17-air-starlight-256',
        color: { id: 'starlight', name: 'Сияющая звезда', hex: '#f0e4d3' },
        memory: 256,
        price: 129990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
      // Green
      {
        id: 'iphone-17-air-green-256',
        color: { id: 'green', name: 'Зелёный', hex: '#a8c9a0' },
        memory: 256,
        price: 129990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
      // White
      {
        id: 'iphone-17-air-white-256',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: 256,
        price: 129990,
        oldPrice: null,
        inStock: true,
        images: ['/images/placeholder.jpg'],
      },
    ],
    specs: {
      display: '6.6" Super Retina XDR OLED',
      chip: 'A19',
      camera: '48 Мп',
      battery: 'До 20 часов видео',
      weight: '145 г',
    },
    description:
      'iPhone 17 Air — самый тонкий и лёгкий iPhone с чипом A19, элегантным дизайном и камерой 48 Мп.',
    relatedIds: ['iphone-17', 'iphone-17-pro'],
  },

  // ── iPhone 17e ────────────────────────────────────
  {
    id: 'iphone-17e',
    slug: 'iphone-17e',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 17e',
    shortDescription: 'Чип A18. Доступная цена. Face ID.',
    badges: ['new'],
    simOptions: [
      { id: 'dual', name: 'nanoSIM + eSIM' },
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Black
      {
        id: 'iphone-17e-black-128',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 128,
        price: 74990,
        oldPrice: null,
        inStock: true,
        images: img('17e', 'black', ['front', 'side']),
      },
      {
        id: 'iphone-17e-black-256',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 256,
        price: 84990,
        oldPrice: null,
        inStock: true,
        images: img('17e', 'black', ['front', 'side']),
      },
      // White
      {
        id: 'iphone-17e-white-128',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: 128,
        price: 74990,
        oldPrice: null,
        inStock: true,
        images: img('17e', 'white', ['front', 'side']),
      },
      {
        id: 'iphone-17e-white-256',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: 256,
        price: 84990,
        oldPrice: null,
        inStock: true,
        images: img('17e', 'white', ['front', 'side']),
      },
    ],
    specs: {
      display: '6.1" OLED',
      chip: 'A18',
      camera: '48 Мп',
      battery: 'До 26 часов видео',
      weight: '163 г',
    },
    description:
      'iPhone 17e — доступный iPhone с чипом A18, Face ID и камерой 48 Мп.',
    relatedIds: ['iphone-17', 'iphone-16'],
  },

  // ── iPhone 16 128GB ───────────────────────────────
  {
    id: 'iphone-16',
    slug: 'iphone-16',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 16',
    shortDescription: 'Чип A18. Dynamic Island. Камера 48 Мп.',
    badges: [],
    simOptions: [
      { id: 'dual', name: 'nanoSIM + eSIM' },
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Black
      {
        id: 'iphone-16-black-128',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 128,
        price: 89990,
        oldPrice: null,
        inStock: true,
        images: img('16', 'black', ['front', 'side']),
      },
      // Pink
      {
        id: 'iphone-16-pink-128',
        color: { id: 'pink', name: 'Розовый', hex: '#f4d4d4' },
        memory: 128,
        price: 89990,
        oldPrice: null,
        inStock: true,
        images: img('16', 'pink', ['front', 'side']),
      },
      // Teal
      {
        id: 'iphone-16-teal-128',
        color: { id: 'teal', name: 'Бирюзовый', hex: '#5fb5b0' },
        memory: 128,
        price: 89990,
        oldPrice: null,
        inStock: true,
        images: img('16', 'teal', ['front', 'side']),
      },
      // Ultramarine
      {
        id: 'iphone-16-ultramarine-128',
        color: { id: 'ultramarine', name: 'Ультрамарин', hex: '#4a5ec4' },
        memory: 128,
        price: 89990,
        oldPrice: null,
        inStock: true,
        images: img('16', 'ultramarine', ['front', 'side']),
      },
      // White
      {
        id: 'iphone-16-white-128',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: 128,
        price: 89990,
        oldPrice: null,
        inStock: true,
        images: img('16', 'white', ['front', 'side']),
      },
    ],
    specs: {
      display: '6.1" Super Retina XDR OLED',
      chip: 'A18',
      camera: '48 Мп + 12 Мп',
      battery: 'До 22 часов видео',
      weight: '170 г',
    },
    description:
      'iPhone 16 — стильный смартфон с чипом A18, Dynamic Island и камерой 48 Мп.',
    relatedIds: ['iphone-17', 'iphone-17e'],
  },

  // ── iPhone 15 128GB ───────────────────────────────
  {
    id: 'iphone-15',
    slug: 'iphone-15',
    category: 'smartphones',
    brand: 'Apple',
    name: 'iPhone 15',
    shortDescription: 'Чип A16. Dynamic Island. USB-C.',
    badges: [],
    simOptions: [
      { id: 'dual', name: 'nanoSIM + eSIM' },
      { id: 'esim', name: 'eSIM' },
    ],
    variants: [
      // Black
      {
        id: 'iphone-15-black-128',
        color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
        memory: 128,
        price: 79990,
        oldPrice: null,
        inStock: true,
        images: img('15', 'black', ['front', 'side']),
      },
      // Blue
      {
        id: 'iphone-15-blue-128',
        color: { id: 'blue', name: 'Голубой', hex: '#7eb4d3' },
        memory: 128,
        price: 79990,
        oldPrice: null,
        inStock: true,
        images: img('15', 'blue', ['front', 'side']),
      },
      // Green
      {
        id: 'iphone-15-green-128',
        color: { id: 'green', name: 'Зелёный', hex: '#a8c9a0' },
        memory: 128,
        price: 79990,
        oldPrice: null,
        inStock: true,
        images: img('15', 'green', ['front', 'side']),
      },
      // Pink
      {
        id: 'iphone-15-pink-128',
        color: { id: 'pink', name: 'Розовый', hex: '#f4d4d4' },
        memory: 128,
        price: 79990,
        oldPrice: null,
        inStock: true,
        images: img('15', 'pink', ['front', 'side']),
      },
      // Yellow
      {
        id: 'iphone-15-yellow-128',
        color: { id: 'yellow', name: 'Жёлтый', hex: '#f9e47a' },
        memory: 128,
        price: 79990,
        oldPrice: null,
        inStock: true,
        images: img('15', 'yellow', ['front', 'side']),
      },
    ],
    specs: {
      display: '6.1" Super Retina XDR OLED',
      chip: 'A16 Bionic',
      camera: '48 Мп + 12 Мп',
      battery: 'До 20 часов видео',
      weight: '171 г',
    },
    description:
      'iPhone 15 — надёжный выбор с современными возможностями по выгодной цене.',
    relatedIds: ['iphone-16', 'iphone-17e'],
  },
]
