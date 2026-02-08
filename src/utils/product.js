export const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

export const formatMemory = (memory) => {
  if (memory >= 1024) {
    return `${memory / 1024} ТБ`
  }
  return `${memory} ГБ`
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

export const getAvailableColorsFromProducts = (products) => {
  const colorMap = new Map()
  products.forEach((p) => {
    p.variants?.forEach((v) => {
      if (v.color && !colorMap.has(v.color.id)) {
        colorMap.set(v.color.id, v.color)
      }
    })
  })
  return Array.from(colorMap.values())
}

export const getAvailableMemoryFromProducts = (products) => {
  const memorySet = new Set()
  products.forEach((p) => {
    p.variants?.forEach((v) => {
      if (v.memory !== null && v.memory !== undefined) {
        memorySet.add(v.memory)
      }
    })
  })
  return Array.from(memorySet).sort((a, b) => a - b)
}

export const getBrandSlug = (brandName) => {
  const map = { 'Apple': 'apple', 'Samsung': 'samsung', 'Dyson': 'dyson' }
  return map[brandName] || brandName?.toLowerCase()
}
