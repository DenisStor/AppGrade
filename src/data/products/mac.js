export const macProducts = [
  {
    id: 'macbook-pro-16-m4-pro',
    slug: 'macbook-pro-16-m4-pro',
    category: 'mac',
    name: 'MacBook Pro 16" M4 Pro',
    shortDescription: 'Чип M4 Pro. 18 ГБ памяти. 512 ГБ SSD.',
    badges: ['new'],
    variants: [
      {
        id: 'macbook-pro-16-m4-pro-space-black-512',
        color: { id: 'space-black', name: 'Чёрный космос', hex: '#1d1d1f' },
        memory: 512,
        price: 329990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-pro-16-m4-pro-space-black-1tb',
        color: { id: 'space-black', name: 'Чёрный космос', hex: '#1d1d1f' },
        memory: 1024,
        price: 369990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-pro-16-m4-pro-silver-512',
        color: { id: 'silver', name: 'Серебристый', hex: '#e3e4e5' },
        memory: 512,
        price: 329990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-silver-select-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
    ],
    specs: {
      display: '16.2" Liquid Retina XDR',
      chip: 'Apple M4 Pro',
      memory: '18 ГБ',
      storage: '512 ГБ / 1 ТБ SSD',
      battery: 'До 24 часов',
      weight: '2.14 кг',
    },
    description:
      'MacBook Pro 16" с чипом M4 Pro — мощный ноутбук для профессионалов: разработчиков, дизайнеров, видеомонтажёров.',
    relatedIds: ['macbook-pro-14-m4-pro', 'magic-mouse'],
  },
  {
    id: 'macbook-pro-14-m4',
    slug: 'macbook-pro-14-m4',
    category: 'mac',
    name: 'MacBook Pro 14" M4',
    shortDescription: 'Чип M4. 16 ГБ памяти. 512 ГБ SSD.',
    badges: ['new'],
    variants: [
      {
        id: 'macbook-pro-14-m4-space-black-512',
        color: { id: 'space-black', name: 'Чёрный космос', hex: '#1d1d1f' },
        memory: 512,
        price: 229990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-pro-14-m4-silver-512',
        color: { id: 'silver', name: 'Серебристый', hex: '#e3e4e5' },
        memory: 512,
        price: 229990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
    ],
    specs: {
      display: '14.2" Liquid Retina XDR',
      chip: 'Apple M4',
      memory: '16 ГБ',
      storage: '512 ГБ SSD',
      battery: 'До 22 часов',
      weight: '1.55 кг',
    },
    description:
      'MacBook Pro 14" с чипом M4 — компактный и мощный ноутбук для творческих профессионалов.',
    relatedIds: ['macbook-pro-16-m4-pro', 'magic-keyboard'],
  },
  {
    id: 'macbook-air-15-m3',
    slug: 'macbook-air-15-m3',
    category: 'mac',
    name: 'MacBook Air 15" M3',
    shortDescription: 'Чип M3. 8 ГБ памяти. 256 ГБ SSD.',
    badges: ['hit'],
    variants: [
      {
        id: 'macbook-air-15-m3-midnight-256',
        color: { id: 'midnight', name: 'Тёмная ночь', hex: '#1e2732' },
        memory: 256,
        price: 169990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-air-15-m3-midnight-512',
        color: { id: 'midnight', name: 'Тёмная ночь', hex: '#1e2732' },
        memory: 512,
        price: 189990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-air-15-m3-starlight-256',
        color: { id: 'starlight', name: 'Сияющая звезда', hex: '#f0e4d3' },
        memory: 256,
        price: 169990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-starlight-select-202306?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-air-15-m3-silver-256',
        color: { id: 'silver', name: 'Серебристый', hex: '#e3e4e5' },
        memory: 256,
        price: 169990,
        oldPrice: null,
        inStock: false,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-silver-select-202306?wid=800&hei=800&fmt=png-alpha',
        ],
      },
    ],
    specs: {
      display: '15.3" Liquid Retina',
      chip: 'Apple M3',
      memory: '8 ГБ',
      storage: '256 ГБ / 512 ГБ SSD',
      battery: 'До 18 часов',
      weight: '1.51 кг',
    },
    description:
      'MacBook Air 15" с чипом M3 — невероятно тонкий и лёгкий ноутбук с большим экраном.',
    relatedIds: ['macbook-air-13-m3', 'magic-mouse'],
  },
  {
    id: 'macbook-air-13-m3',
    slug: 'macbook-air-13-m3',
    category: 'mac',
    name: 'MacBook Air 13" M3',
    shortDescription: 'Чип M3. 8 ГБ памяти. 256 ГБ SSD.',
    badges: [],
    variants: [
      {
        id: 'macbook-air-13-m3-midnight-256',
        color: { id: 'midnight', name: 'Тёмная ночь', hex: '#1e2732' },
        memory: 256,
        price: 129990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'macbook-air-13-m3-starlight-256',
        color: { id: 'starlight', name: 'Сияющая звезда', hex: '#f0e4d3' },
        memory: 256,
        price: 129990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-starlight-select-202402?wid=800&hei=800&fmt=png-alpha',
        ],
      },
    ],
    specs: {
      display: '13.6" Liquid Retina',
      chip: 'Apple M3',
      memory: '8 ГБ',
      storage: '256 ГБ SSD',
      battery: 'До 18 часов',
      weight: '1.24 кг',
    },
    description:
      'MacBook Air 13" с чипом M3 — самый портативный Mac для повседневных задач.',
    relatedIds: ['macbook-air-15-m3', 'magic-keyboard'],
  },
  {
    id: 'imac-24-m4',
    slug: 'imac-24-m4',
    category: 'mac',
    name: 'iMac 24" M4',
    shortDescription: 'Чип M4. 4.5K Retina. 256 ГБ SSD.',
    badges: ['new'],
    variants: [
      {
        id: 'imac-24-m4-blue-256',
        color: { id: 'blue', name: 'Синий', hex: '#5b9bd5' },
        memory: 256,
        price: 179990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'imac-24-m4-silver-256',
        color: { id: 'silver', name: 'Серебристый', hex: '#e3e4e5' },
        memory: 256,
        price: 179990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-silver-selection-hero-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
      {
        id: 'imac-24-m4-green-256',
        color: { id: 'green', name: 'Зелёный', hex: '#5a9a5a' },
        memory: 256,
        price: 179990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-green-selection-hero-202410?wid=800&hei=800&fmt=png-alpha',
        ],
      },
    ],
    specs: {
      display: '24" 4.5K Retina',
      chip: 'Apple M4',
      memory: '8 ГБ',
      storage: '256 ГБ SSD',
      camera: '12 Мп Center Stage',
      weight: '4.48 кг',
    },
    description:
      'iMac 24" с чипом M4 — стильный моноблок с потрясающим дисплеем для дома и офиса.',
    relatedIds: ['magic-keyboard', 'magic-mouse'],
  },
]

export const macCategory = {
  id: 'mac',
  name: 'Mac',
  slug: 'mac',
  description: 'Компьютеры Apple',
  seoTitle: 'Купить Mac в Калининграде — MacBook, iMac, Mac mini — APPGRADE',
  seoDescription:
    'MacBook Pro, MacBook Air, iMac с чипами M3 и M4. Официальная гарантия. Доставка по Калининграду.',
}
