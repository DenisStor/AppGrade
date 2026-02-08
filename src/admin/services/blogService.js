import { api } from './apiClient'

export const blogService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/blog${qs ? `?${qs}` : ''}`)
  },
  getById: (id) => api.get(`/blog/${id}`),
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.put(`/blog/${id}`, data),
  remove: (id) => api.delete(`/blog/${id}`),
}
