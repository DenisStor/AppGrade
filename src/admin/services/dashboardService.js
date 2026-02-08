import { api } from './apiClient'

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
}
