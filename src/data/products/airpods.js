export const airpodsProducts = [
  // ── AirPods 4 (без ANC) ──────────────────────────
  {
    id: 'airpods-4-no-anc',
    slug: 'airpods-4-no-anc',
    category: 'headphones',
    brand: 'Apple',
    name: 'AirPods 4',
    shortDescription: 'Чип H2, персонализированное аудио, USB-C кейс.',
    badges: ['new'],
    variants: [
      {
        id: 'airpods-4-no-anc-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 14990,
        oldPrice: null,
        inStock: true,
        images: ['/images/airpods/airpods-4-anc-select-202409_FV1.png'],
      },
    ],
    specs: {
      chip: 'Apple H2',
      anc: 'Нет',
      transparency: 'Нет',
      battery: 'До 30 ч с кейсом',
      charging: 'USB-C',
    },
    description:
      'AirPods 4 — наушники открытого типа с чипом H2, персонализированным пространственным аудио и USB-C кейсом.',
    relatedIds: ['airpods-4', 'airpods-pro-2-usbc'],
  },

  // ── AirPods 4 с ANC ──────────────────────────────
  {
    id: 'airpods-4',
    slug: 'airpods-4',
    category: 'headphones',
    brand: 'Apple',
    name: 'AirPods 4 с ANC',
    shortDescription: 'Активное шумоподавление, чип H2, адаптивная прозрачность, USB-C кейс.',
    badges: ['new'],
    variants: [
      {
        id: 'airpods-4-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 17990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-4-anc-select-202409_FV1.png',
          '/images/airpods/airpods-4-202409-gallery-1.png',
        ],
      },
    ],
    specs: {
      chip: 'Apple H2',
      anc: 'Активное шумоподавление',
      transparency: 'Адаптивная прозрачность',
      battery: 'До 30 ч с кейсом',
      charging: 'USB-C',
    },
    description:
      'AirPods 4 с активным шумоподавлением — наушники с чипом H2, адаптивной прозрачностью и персонализированным пространственным аудио. USB-C кейс для удобной зарядки.',
    relatedIds: ['airpods-4-no-anc', 'airpods-pro-2-usbc'],
  },

  // ── AirPods Pro 2 USB-C ──────────────────────────
  {
    id: 'airpods-pro-2-usbc',
    slug: 'airpods-pro-2-usbc',
    category: 'headphones',
    brand: 'Apple',
    name: 'AirPods Pro 2 USB-C',
    shortDescription: 'Чип H2, улучшенное ANC, адаптивная прозрачность, USB-C.',
    badges: [],
    variants: [
      {
        id: 'airpods-pro-2-usbc-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 21990,
        oldPrice: null,
        inStock: true,
        images: ['/images/airpods/airpods-pro-3-hero-select-202509.png'],
      },
    ],
    specs: {
      chip: 'Apple H2',
      anc: 'Активное шумоподавление',
      transparency: 'Адаптивная прозрачность',
      battery: 'До 30 ч с кейсом',
      charging: 'USB-C',
    },
    description:
      'AirPods Pro 2 с USB-C — внутриканальные наушники с чипом H2, улучшенным шумоподавлением и адаптивной прозрачностью.',
    relatedIds: ['airpods-pro-3', 'airpods-4'],
  },

  // ── AirPods Pro 3 ────────────────────────────────
  {
    id: 'airpods-pro-3',
    slug: 'airpods-pro-3',
    category: 'headphones',
    brand: 'Apple',
    name: 'AirPods Pro 3',
    shortDescription: 'Чип H3, улучшенное ANC, защита слуха, USB-C кейс.',
    badges: ['new'],
    variants: [
      {
        id: 'airpods-pro-3-white',
        color: { id: 'white', name: 'Белый', hex: '#f5f5f0' },
        memory: null,
        price: 24990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-pro-3-gallery-1-202509.png',
          '/images/airpods/airpods-pro-3-hero-select-202509.png',
        ],
      },
    ],
    specs: {
      chip: 'Apple H3',
      anc: 'Активное шумоподавление',
      transparency: 'Адаптивная прозрачность',
      battery: 'До 30 ч с кейсом',
      charging: 'USB-C',
      hearingProtection: 'Защита слуха',
    },
    description:
      'AirPods Pro 3 — флагманские наушники с чипом H3, улучшенным шумоподавлением и функцией защиты слуха. Пространственное аудио с динамическим отслеживанием головы.',
    relatedIds: ['airpods-pro-2-usbc', 'airpods-max-2'],
  },

  // ── AirPods Max 2 (2024) ─────────────────────────
  {
    id: 'airpods-max-2',
    slug: 'airpods-max-2',
    category: 'headphones',
    brand: 'Apple',
    name: 'AirPods Max 2 (2024)',
    shortDescription: 'Полноразмерные наушники, чип H2, ANC, пространственное аудио, USB-C.',
    badges: ['new'],
    variants: [
      {
        id: 'airpods-max-2-blue',
        color: { id: 'blue', name: 'Синий', hex: '#5b7fa6' },
        memory: null,
        price: 59990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-max-select-202409-blue.png',
          '/images/airpods/airpods-max-select-202409-blue_FV1.png',
        ],
      },
      {
        id: 'airpods-max-2-midnight',
        color: { id: 'midnight', name: 'Тёмная ночь', hex: '#1c1c2e' },
        memory: null,
        price: 59990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-max-select-202409-midnight.png',
          '/images/airpods/airpods-max-select-202409-midnight_FV1.png',
        ],
      },
      {
        id: 'airpods-max-2-orange',
        color: { id: 'orange', name: 'Оранжевый', hex: '#e8734a' },
        memory: null,
        price: 59990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-max-select-202409-orange.png',
          '/images/airpods/airpods-max-select-202409-orange_FV1.png',
        ],
      },
      {
        id: 'airpods-max-2-purple',
        color: { id: 'purple', name: 'Фиолетовый', hex: '#8b6fa8' },
        memory: null,
        price: 59990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-max-select-202409-purple.png',
          '/images/airpods/airpods-max-select-202409-purple_FV1.png',
        ],
      },
      {
        id: 'airpods-max-2-starlight',
        color: { id: 'starlight', name: 'Сияющая звезда', hex: '#f0e8d8' },
        memory: null,
        price: 59990,
        oldPrice: null,
        inStock: true,
        images: [
          '/images/airpods/airpods-max-select-202409-starlight.png',
          '/images/airpods/airpods-max-select-202409-starlight_FV1.png',
        ],
      },
    ],
    specs: {
      chip: 'Apple H2',
      anc: 'Активное шумоподавление',
      spatialAudio: 'Пространственное аудио',
      battery: 'До 20 ч',
      charging: 'USB-C',
      weight: '384,8 г',
    },
    description:
      'AirPods Max 2 — полноразмерные наушники нового поколения с чипом H2, активным шумоподавлением и пространственным аудио. USB-C зарядка.',
    relatedIds: ['airpods-pro-3', 'airpods-4'],
  },
]
