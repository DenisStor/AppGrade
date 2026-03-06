/**
 * Маппинг API-ответа (snake_case) → формат, ожидаемый компонентами витрины.
 *
 * Поддерживает:
 * - attributes (новый формат) — произвольные измерения
 * - legacy-поля (color_name, color_hex, memory, sim_id) — backward compat
 */

export function mapProduct(raw) {
  if (!raw) return null

  const dimensions = raw.dimensions || []

  const product = {
    id: raw.slug,
    slug: raw.slug,
    _dbId: raw.id,
    name: raw.name,
    brand: raw.brand_name,
    category: raw.category_slug,
    categoryName: raw.category_name,
    brandSlug: raw.brand_slug,
    shortDescription: raw.short_description || '',
    description: raw.description || '',
    badges: raw.badges || [],
    specs: raw.specs || {},
    dimensions,
    series: raw.series || null,
    isUsed: !!raw.is_used,
    condition: raw.condition,
    conditionLabel: raw.condition_label,
    warranty: raw.warranty,
    relatedIds: (raw.relatedIds || []),
    variants: (raw.variants || []).map(v => {
      const attrs = v.attributes && Object.keys(v.attributes).length > 0
        ? v.attributes
        : buildLegacyAttributes(v, dimensions)

      // Variant ID из slug + attribute ids
      const attrParts = Object.values(attrs).map(a => a.id).filter(Boolean)
      const variantId = attrParts.length
        ? `${raw.slug}-${attrParts.join('-')}`
        : `${raw.slug}-${v.id || 'default'}`

      // Backward compat computed fields
      const color = attrs.color || { id: 'default', name: 'Default', hex: '#000000' }
      const memory = attrs.memory ? Number(attrs.memory.id) : (v.memory || null)
      const sim = attrs.sim ? { id: attrs.sim.id, name: attrs.sim.name } : null

      return {
        id: variantId,
        attributes: attrs,
        color,
        memory,
        sim,
        price: v.price,
        oldPrice: v.old_price || null,
        inStock: v.stock_status === 'in_stock',
        stockStatus: v.stock_status || 'in_stock',
        images: v.images || [],
      }
    }),
  }

  // simOptions — извлекаем из вариантов, fallback на product_sim_options
  // Не извлекать sim из legacy-полей если dimensions определены и не содержат 'sim'
  const hasDimensions = dimensions.length > 0
  const simFromVariants = new Map()
  for (const v of raw.variants || []) {
    const simAttr = v.attributes?.sim
    const simId = simAttr?.id || (!hasDimensions ? v.sim_id : null)
    const simName = simAttr?.name || (!hasDimensions ? v.sim_name : null)
    if (simId) simFromVariants.set(simId, { id: simId, name: simName || simId })
  }
  product.simOptions = simFromVariants.size > 0
    ? [...simFromVariants.values()]
    : (!hasDimensions && raw.simOptions?.length)
      ? raw.simOptions.map(s => ({ id: s.sim_id, name: s.name }))
      : []

  // Связанные товары (если есть полные данные)
  if (raw.relatedProducts?.length) {
    product._relatedProducts = raw.relatedProducts.map(mapProduct)
  }

  return product
}

function buildLegacyAttributes(v, dimensions = []) {
  const attrs = {}
  const hasDimensions = dimensions.length > 0
  if ((v.color_name || v.color_hex) && (!hasDimensions || dimensions.some(d => d.key === 'color'))) {
    const colorId = v.color_hex
      ? v.color_hex.replace('#', '').toLowerCase()
      : (v.color_name || 'default').toLowerCase().replace(/[^a-zа-яё0-9]/g, '-')
    attrs.color = { id: colorId, name: v.color_name || 'Default', hex: v.color_hex || '#000000' }
  }
  if (v.memory && (!hasDimensions || dimensions.some(d => d.key === 'memory'))) {
    attrs.memory = { id: String(v.memory), name: `${v.memory >= 1024 ? `${v.memory / 1024} ТБ` : `${v.memory} ГБ`}` }
  }
  if (v.sim_id && (!hasDimensions || dimensions.some(d => d.key === 'sim'))) {
    attrs.sim = { id: v.sim_id, name: v.sim_name || v.sim_id }
  }
  return attrs
}

export function mapProducts(rawList) {
  return (rawList || []).map(mapProduct).filter(Boolean)
}

export function mapCategory(raw) {
  if (!raw) return null
  return {
    id: raw.slug,
    slug: raw.slug,
    name: raw.name,
    description: raw.description || '',
    image: raw.image_url,
    href: `/catalog/${raw.slug}`,
    brands: raw.brands || [],
  }
}
