const BASE = '/api/public'

async function fetchJson(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Ошибка сервера' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const catalogApi = {
  getCategories: () => fetchJson(`${BASE}/categories`),

  getCategoryBrands: (slug) => fetchJson(`${BASE}/categories/${slug}/brands`),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams()
    if (params.category) qs.set('category', params.category)
    if (params.brand) qs.set('brand', params.brand)
    if (params.search) qs.set('search', params.search)
    if (params.is_used !== undefined) qs.set('is_used', params.is_used)
    return fetchJson(`${BASE}/products?${qs}`)
  },

  getProduct: (slug) => fetchJson(`${BASE}/products/${slug}`),

  getProductsBySlugs: (slugs) => {
    if (!slugs.length) return Promise.resolve([])
    return fetchJson(`${BASE}/products/by-slugs?slugs=${slugs.join(',')}`)
  },

  search: (query, options) => fetchJson(`${BASE}/search?q=${encodeURIComponent(query)}`, options),
}
