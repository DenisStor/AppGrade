import { api } from './apiClient'

export const requestService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/requests${qs ? `?${qs}` : ''}`)
  },
  update: (id, data) => api.put(`/requests/${id}`, data),
}
