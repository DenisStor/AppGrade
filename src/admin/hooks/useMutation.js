import { useState, useCallback, useRef } from 'react'
import { api } from '../services/apiClient'
import toast from 'react-hot-toast'

export function useMutation(method, url, options = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const mutate = useCallback(async (data, urlOverride) => {
    setLoading(true)
    setError(null)
    try {
      const target = urlOverride || url
      let result
      if (method === 'POST') result = await api.post(target, data)
      else if (method === 'PUT') result = await api.put(target, data)
      else if (method === 'DELETE') result = await api.delete(target)
      else result = await api.get(target)

      if (optionsRef.current.successMessage) toast.success(optionsRef.current.successMessage)
      optionsRef.current.onSuccess?.(result)
      return result
    } catch (e) {
      setError(e.message)
      toast.error(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [method, url])

  return { mutate, loading, error }
}
