import { iphoneProducts } from './iphone'
import { macProducts } from './mac'
import { samsungProducts } from './samsung'
import { dysonProducts } from './dyson'
import { usedProducts, CONDITIONS } from './used'

export const allProducts = [
  ...iphoneProducts,
  ...macProducts,
  ...samsungProducts,
  ...dysonProducts,
]

// Б/У товары
export { usedProducts, CONDITIONS }

export const getUsedProducts = () => usedProducts

// Конфигурация брендов
export const brands = {
  apple: {
    id: 'apple',
    slug: 'apple',
    name: 'Apple',
    logo: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png',
  },
  samsung: {
    id: 'samsung',
    slug: 'samsung',
    name: 'Samsung',
    logo: 'https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/mo/360_197_1.png',
  },
  dyson: {
    id: 'dyson',
    slug: 'dyson',
    name: 'Dyson',
    logo: 'https://dyson-h.assetsadobe2.com/is/content/content/dam/dyson/icons/logo.svg',
  },
}

// Маппинг имя бренда → slug
const brandSlugMap = {
  'Apple': 'apple',
  'Samsung': 'samsung',
  'Dyson': 'dyson',
}

// Получить бренды категории
export const getBrandsByCategory = (categorySlug) => {
  const products = getProductsByCategory(categorySlug)
  const brandSlugs = new Set()

  products.forEach((p) => {
    if (p.brand) {
      const slug = brandSlugMap[p.brand]
      if (slug) brandSlugs.add(slug)
    }
  })

  return Array.from(brandSlugs)
    .map((slug) => brands[slug])
    .filter(Boolean)
}

// Получить товары бренда в категории
export const getProductsByCategoryAndBrand = (categorySlug, brandSlug) => {
  const brand = brands[brandSlug]
  if (!brand) return []

  return allProducts.filter(
    (p) => p.category === categorySlug && p.brand === brand.name
  )
}

// Получить бренд по slug
export const getBrandBySlug = (slug) => brands[slug] || null

// Получить slug бренда по имени
export const getBrandSlug = (brandName) => brandSlugMap[brandName] || null

// Новая мультибрендовая система категорий
export const categories = {
  smartphones: {
    id: 'smartphones',
    name: 'Смартфоны',
    slug: 'smartphones',
    description: 'iPhone, Samsung Galaxy и другие смартфоны',
    seoTitle: 'Купить смартфон в Калининграде — APPGRADE',
    seoDescription:
      'iPhone, Samsung Galaxy с гарантией. Доставка по Калининграду.',
  },
  laptops: {
    id: 'laptops',
    name: 'Ноутбуки',
    slug: 'laptops',
    description: 'MacBook Pro, MacBook Air, iMac',
    seoTitle: 'Купить ноутбук в Калининграде — APPGRADE',
    seoDescription:
      'MacBook Pro, MacBook Air, iMac с гарантией. Доставка по Калининграду.',
  },
  tablets: {
    id: 'tablets',
    name: 'Планшеты',
    slug: 'tablets',
    description: 'iPad и другие планшеты',
    seoTitle: 'Купить планшет в Калининграде — APPGRADE',
    seoDescription:
      'iPad с гарантией. Доставка по Калининграду.',
  },
  watches: {
    id: 'watches',
    name: 'Умные часы',
    slug: 'watches',
    description: 'Apple Watch, Samsung Watch и другие',
    seoTitle: 'Купить умные часы в Калининграде — APPGRADE',
    seoDescription:
      'Apple Watch с гарантией. Доставка по Калининграду.',
  },
  headphones: {
    id: 'headphones',
    name: 'Наушники',
    slug: 'headphones',
    description: 'AirPods, Galaxy Buds и другие',
    seoTitle: 'Купить наушники в Калининграде — APPGRADE',
    seoDescription:
      'AirPods с гарантией. Доставка по Калининграду.',
  },
  hairdryers: {
    id: 'hairdryers',
    name: 'Фены',
    slug: 'hairdryers',
    description: 'Dyson Supersonic',
    seoTitle: 'Купить фен Dyson в Калининграде — APPGRADE',
    seoDescription:
      'Фены Dyson Supersonic с гарантией. Доставка по Калининграду.',
  },
  stylers: {
    id: 'stylers',
    name: 'Стайлеры',
    slug: 'stylers',
    description: 'Dyson Airwrap, Corrale',
    seoTitle: 'Купить стайлер Dyson в Калининграде — APPGRADE',
    seoDescription:
      'Стайлеры Dyson Airwrap, Corrale с гарантией. Доставка по Калининграду.',
  },
  accessories: {
    id: 'accessories',
    name: 'Аксессуары',
    slug: 'accessories',
    description: 'Чехлы, кабели и другие аксессуары',
    seoTitle: 'Купить аксессуары в Калининграде — APPGRADE',
    seoDescription:
      'Аксессуары Apple и Samsung с гарантией. Доставка по Калининграду.',
  },
  gaming: {
    id: 'gaming',
    name: 'Игровые консоли',
    slug: 'gaming',
    description: 'PlayStation 5, DualSense и другие',
    seoTitle: 'Купить игровую консоль в Калининграде — APPGRADE',
    seoDescription:
      'PlayStation 5 с гарантией. Доставка по Калининграду.',
  },
}

export const getProductsByCategory = (categorySlug) => {
  return allProducts.filter((p) => p.category === categorySlug)
}

export const getProductBySlug = (slug) => {
  return allProducts.find((p) => p.slug === slug)
}

export const getProductById = (id) => {
  return allProducts.find((p) => p.id === id)
}

export const getCategoryBySlug = (slug) => {
  return categories[slug] || null
}

export const searchProducts = (query) => {
  const q = query.toLowerCase().trim()
  if (!q) return []

  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  )
}

export const getRelatedProducts = (productId, limit = 4) => {
  const product = getProductById(productId)
  if (!product || !product.relatedIds) return []

  return product.relatedIds
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, limit)
}

export const getMinPrice = (product) => {
  if (!product?.variants?.length) return 0
  return Math.min(...product.variants.map((v) => v.price))
}

export const hasDiscount = (product) => {
  return product?.variants?.some((v) => v.oldPrice && v.oldPrice > v.price)
}

export const getAvailableColors = (product) => {
  if (!product?.variants?.length) return []
  const colorMap = new Map()
  product.variants.forEach((v) => {
    if (!colorMap.has(v.color.id)) {
      colorMap.set(v.color.id, v.color)
    }
  })
  return Array.from(colorMap.values())
}

export const getAvailableMemory = (product) => {
  if (!product?.variants?.length) return []
  const memorySet = new Set(
    product.variants
      .map((v) => v.memory)
      .filter((m) => m !== null && m !== undefined)
  )
  return Array.from(memorySet).sort((a, b) => a - b)
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

export const formatMemory = (memory) => {
  if (memory >= 1024) {
    return `${memory / 1024} ТБ`
  }
  return `${memory} ГБ`
}

export { iphoneProducts, macProducts, samsungProducts, dysonProducts }
