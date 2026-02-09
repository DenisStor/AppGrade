export const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

export const formatMemory = (memory) => {
  if (memory >= 1024) {
    return `${Math.round(memory / 1024)} ТБ`
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

export const getAvailableDimensionValues = (product, dimensionKey) => {
  if (!product?.variants?.length) return []
  const valueMap = new Map()
  product.variants.forEach((v) => {
    const val = v.attributes?.[dimensionKey]
    if (val && !valueMap.has(val.id)) valueMap.set(val.id, val)
  })
  return Array.from(valueMap.values())
}

export const getAvailableColors = (product) => {
  if (!product?.variants?.length) return []
  const colorMap = new Map()
  product.variants.forEach((v) => {
    const color = v.attributes?.color || v.color
    if (color && !colorMap.has(color.id)) {
      colorMap.set(color.id, color)
    }
  })
  return Array.from(colorMap.values())
}

export const getAvailableMemory = (product) => {
  if (!product?.variants?.length) return []
  const memorySet = new Set(
    product.variants
      .map((v) => v.attributes?.memory ? Number(v.attributes.memory.id) : v.memory)
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

export const getAvailableSims = (product) => {
  if (!product?.variants?.length) return []
  const simMap = new Map()
  product.variants.forEach((v) => {
    const sim = v.attributes?.sim || v.sim
    if (sim && !simMap.has(sim.id)) {
      simMap.set(sim.id, sim)
    }
  })
  return Array.from(simMap.values())
}

export const getBrandSlug = (brandName) => {
  const map = { 'Apple': 'apple', 'Samsung': 'samsung', 'Dyson': 'dyson' }
  return map[brandName] || brandName?.toLowerCase()
}
