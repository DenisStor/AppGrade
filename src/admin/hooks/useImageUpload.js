import { useState, useCallback } from 'react'
import { api } from '../services/apiClient'
import toast from 'react-hot-toast'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)

  const upload = useCallback(async (file, type = 'products') => {
    setUploading(true)
    try {
      const result = await api.upload(file, type)
      return result.url
    } catch (e) {
      toast.error('Ошибка загрузки: ' + e.message)
      throw e
    } finally {
      setUploading(false)
    }
  }, [])

  return { upload, uploading }
}
