const BASE_URL = '/api'

let onUnauthorized = null

export function setOnUnauthorized(fn) {
  onUnauthorized = fn
}

export async function apiClient(url, options = {}) {
  const token = localStorage.getItem('admin_token')

  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(options.body)
  }

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    onUnauthorized?.()
    throw new Error('Сессия истекла')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Ошибка ${res.status}`)
  }

  return res.json()
}

export const api = {
  get: (url) => apiClient(url),
  post: (url, body) => apiClient(url, { method: 'POST', body }),
  put: (url, body) => apiClient(url, { method: 'PUT', body }),
  delete: (url) => apiClient(url, { method: 'DELETE' }),
  upload: (file, type = 'products') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return apiClient('/upload', { method: 'POST', body: formData })
  },
}
