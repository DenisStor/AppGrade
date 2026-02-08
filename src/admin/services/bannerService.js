import { api } from './apiClient'

export const bannerService = {
  list: () => api.get('/banners'),
  getById: (id) => api.get(`/banners/${id}`),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  remove: (id) => api.delete(`/banners/${id}`),
  reorder: (ids) => api.put('/banners/reorder', { ids }),
}
