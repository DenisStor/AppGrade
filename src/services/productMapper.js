/**
 * Маппинг API-ответа (snake_case) → формат, ожидаемый компонентами витрины.
 *
 * Компоненты ожидают:
 * - product.id = slug (для корзины/избранного)
 * - product.brand = имя бренда (строка)
 * - product.category = slug категории
 * - variant.id = строка "slug-color-memory"
 * - variant.color = { id, name, hex }
 * - variant.images = [url1, url2, ...]
 * - variant.inStock = boolean
 * - variant.oldPrice = число
 * - variant.memory = число
 * - product.simOptions = [{ id, name }]
 */

export function mapProduct(raw) {
  if (!raw) return null

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
    isUsed: !!raw.is_used,
    condition: raw.condition,
    conditionLabel: raw.condition_label,
    warranty: raw.warranty,
    relatedIds: (raw.relatedIds || []),
    simOptions: (raw.simOptions || []).map(s => ({
      id: s.sim_id,
      name: s.name,
    })),
    variants: (raw.variants || []).map(v => {
      const colorId = v.color_hex
        ? v.color_hex.replace('#', '').toLowerCase()
        : (v.color_name || 'default').toLowerCase().replace(/[^a-zа-яё0-9]/g, '-')
      const memPart = v.memory ? `-${v.memory}` : ''
      return {
        id: `${raw.slug}-${colorId}${memPart}`,
        color: {
          id: colorId,
          name: v.color_name || 'Default',
          hex: v.color_hex || '#000000',
        },
        memory: v.memory || null,
        price: v.price,
        oldPrice: v.old_price || null,
        inStock: v.stock_status === 'in_stock',
        images: v.images || [],
      }
    }),
  }

  // Связанные товары (если есть полные данные)
  if (raw.relatedProducts?.length) {
    product._relatedProducts = raw.relatedProducts.map(mapProduct)
  }

  return product
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
