import { iphoneProducts, iphoneCategories } from './iphone'
import { macProducts, macCategory } from './mac'

export const allProducts = [...iphoneProducts, ...macProducts]

export const categories = {
  iphone: iphoneCategories,
  mac: macCategory,
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

export const getMaxPrice = (product) => {
  if (!product?.variants?.length) return 0
  return Math.max(...product.variants.map((v) => v.price))
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
  const memorySet = new Set(product.variants.map((v) => v.memory))
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

export { iphoneProducts, macProducts }
