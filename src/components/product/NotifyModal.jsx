import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import { formatPhoneInput } from '../../utils/phone'

export function NotifyModal({ isOpen, onClose, product, variant }) {
  const [form, setForm] = useState({ name: '', phone: '+7' })
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const { toast } = useToast()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Введите имя'
    const phoneDigits = form.phone.replace(/\D/g, '').length
    if (phoneDigits < 11) {
      const missing = 11 - phoneDigits
      newErrors.phone = phoneDigits < 2 ? 'Введите номер телефона' : `Не хватает ${missing} ${missing === 1 ? 'цифры' : 'цифр'}`
    }
    if (!agreed) newErrors.agreed = true
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast('Заполните обязательные поля', 'error')
      return
    }
    setIsLoading(true)
    try {
      await api.submitNotify({
        name: form.name,
        phone: form.phone,
        productName: product?.name,
        variantInfo: variant?.attributes && Object.keys(variant.attributes).length > 0
          ? Object.values(variant.attributes).map(a => a.name).filter(Boolean).join(', ')
          : [variant?.color?.name, variant?.memory && `${variant.memory} ГБ`].filter(Boolean).join(', ') || undefined,
        productId: product?._dbId,
      })
      toast('Мы уведомим вас, когда товар появится в наличии', 'success')
      onClose()
      setForm({ name: '', phone: '+7' })
      setAgreed(false)
      setErrors({})
    } catch {
      toast('Ошибка отправки. Попробуйте позже', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [form, agreed, product, variant, onClose, toast])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Уведомить о поступлении" size="sm">
      <p className="text-gray-medium text-sm mb-4">
        Оставьте контакты — мы сообщим, когда товар появится в наличии.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-1">
            Ваше имя
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => { setForm((prev) => ({ ...prev, name: e.target.value })); setErrors(prev => ({ ...prev, name: false })) }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Иван"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-1">
            Телефон
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => { setForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value, prev.phone) })); setErrors(prev => ({ ...prev, phone: false })) }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="+7 (___) ___-__-__"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); setErrors(prev => ({ ...prev, agreed: false })) }}
            className={`w-4 h-4 accent-gray-dark ${errors.agreed ? 'ring-2 ring-red-500' : ''}`}
          />
          <span className={`text-xs ${errors.agreed ? 'text-red-500' : 'text-gray-medium'}`}>
            Согласен на обработку{' '}
            <Link to="/privacy" className="underline hover:text-gray-dark">
              персональных данных
            </Link>
          </span>
        </label>
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
        </Button>
      </form>
    </Modal>
  )
}
