import { useMemo } from 'react'
import { getMinPrice } from '../utils/product'

export function useProductFiltering(products, filters, sortBy, options = {}) {
  const { extraFilters, sortNew } = options

  return useMemo(() => {
    let result = [...products]

    // Фильтр по цене
    result = result.filter((p) => {
      const price = getMinPrice(p)
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Специфичные фильтры страницы
    if (extraFilters) {
      result = extraFilters(result, filters)
    }

    // Фильтр по наличию
    if (filters.inStock) {
      result = result.filter((p) => p.variants.some((v) => v.inStock))
    }

    // Сортировка
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => getMinPrice(a) - getMinPrice(b))
        break
      case 'price-desc':
        result.sort((a, b) => getMinPrice(b) - getMinPrice(a))
        break
      case 'new':
        if (sortNew) result.sort(sortNew)
        break
    }

    return result
  }, [products, filters, sortBy, extraFilters, sortNew])
}
