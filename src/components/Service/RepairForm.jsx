import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { useToast } from '../../hooks/useToast'
import { api } from '../../services/api'
import { formatPhoneInput } from '../../utils/phone'

export function RepairForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    phone: '+7',
    device: '',
    problem: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }))
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhoneInput(value, prev.phone) : value,
    }))
  }

  const isPhoneValid = (phone) => phone.replace(/\D/g, '').length >= 11

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!isPhoneValid(formData.phone)) newErrors.phone = true
    if (!formData.device.trim()) newErrors.device = true
    if (!agreed) newErrors.agreed = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast('Заполните обязательные поля', 'error')
      return
    }

    setErrors({})

    setIsSubmitting(true)

    try {
      await api.submitRepairRequest(formData)
      toast('Заявка отправлена! Мы свяжемся с вами в ближайшее время', 'success')
      setFormData({ name: '', phone: '+7', device: '', problem: '' })
    } catch {
      toast('Не удалось отправить заявку. Попробуйте позже', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="repair-form" className="py-12 lg:py-20 bg-gray-light">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-4">
              Записаться на ремонт
            </h2>
            <p className="text-gray-medium">
              Оставьте заявку и мы свяжемся с вами для уточнения деталей
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white p-6 lg:p-10 rounded-card">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-dark mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван"
                  className={`w-full px-4 py-3 rounded-input border outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-dark focus:ring-1 focus:ring-gray-dark'}`}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-dark mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 123-45-67"
                  className={`w-full px-4 py-3 rounded-input border outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-dark focus:ring-1 focus:ring-gray-dark'}`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="device" className="block text-sm font-medium text-gray-dark mb-2">
                Модель устройства *
              </label>
              <input
                type="text"
                id="device"
                name="device"
                value={formData.device}
                onChange={handleChange}
                placeholder="iPhone 15 Pro Max"
                className={`w-full px-4 py-3 rounded-input border outline-none transition-colors ${errors.device ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-gray-dark focus:ring-1 focus:ring-gray-dark'}`}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="problem" className="block text-sm font-medium text-gray-dark mb-2">
                Опишите проблему
              </label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                placeholder="Разбился экран, не заряжается..."
                rows={4}
                className="w-full px-4 py-3 rounded-input border border-gray-200 focus:border-gray-dark focus:ring-1 focus:ring-gray-dark outline-none transition-colors resize-none"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: false })) }}
                className={`w-4 h-4 ${errors.agreed ? 'accent-red-500 ring-2 ring-red-500 rounded' : 'accent-gray-dark'}`}
              />
              <span className={`text-xs ${errors.agreed ? 'text-red-500' : 'text-gray-medium'}`}>
                Согласен на обработку{' '}
                <Link to="/privacy" className="underline hover:text-gray-dark">
                  персональных данных
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  )
}
