import { api } from './apiClient'

export const serviceService = {
  list: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  remove: (id) => api.delete(`/services/${id}`),
  reorder: (ids) => api.put('/services/reorder', { ids }),
}
