import { api } from './apiClient'

export const productService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/products${qs ? `?${qs}` : ''}`)
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
}
