import { useState, useCallback } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'

export function QuickBuyModal({ isOpen, onClose, product, variant }) {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.submitQuickBuy({
        name: form.name,
        phone: form.phone,
        productName: product?.name,
        variantInfo: [variant?.color?.name, variant?.memory && `${variant.memory} ГБ`].filter(Boolean).join(', ') || undefined,
        productId: product?._dbId,
      })
      toast('Заявка отправлена! Мы скоро свяжемся с вами', 'success')
      onClose()
      setForm({ name: '', phone: '' })
    } catch {
      toast('Ошибка отправки. Попробуйте позже', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [form, product, variant, onClose, toast])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Купить в 1 клик" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-1">
            Ваше имя
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            placeholder="Иван"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-dark mb-1">
            Телефон
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            placeholder="+7 (___) ___-__-__"
          />
        </div>
        <p className="text-sm text-gray-medium">
          Мы перезвоним вам для подтверждения заказа
        </p>
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить заявку'}
        </Button>
      </form>
    </Modal>
  )
}
