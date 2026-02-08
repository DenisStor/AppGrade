import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { api, setOnUnauthorized } from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user'))
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [loading, setLoading] = useState(true)

  const signOut = useCallback(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setOnUnauthorized(signOut)
  }, [signOut])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then(u => { setUser(u); localStorage.setItem('admin_user', JSON.stringify(u)) })
      .catch(() => signOut())
      .finally(() => setLoading(false))
  }, [token, signOut])

  const signIn = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
