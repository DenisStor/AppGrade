import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { CartItem } from '../../components/cart/CartItem'
import { CartRecommendations } from '../../components/cart/CartRecommendations'
import { useCartStore } from '../../stores/useCartStore'
import { formatPrice } from '../../utils/product'
import { useToast } from '../../hooks/useToast'
import { usePageTitle } from '../../hooks/usePageTitle'
import { api } from '../../services/api'
import { formatPhoneInput } from '../../utils/phone'
import { PageLayout } from '../../layouts/PageLayout'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const { toast } = useToast()
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: '', phone: '+7' })
  const [isOrderSuccess, setIsOrderSuccess] = useState(false)
  const [orderAgreed, setOrderAgreed] = useState(false)
  const [orderErrors, setOrderErrors] = useState({})

  usePageTitle('Корзина — APPGRADE')

  const handleOrderSubmit = useCallback(async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!orderForm.name.trim()) newErrors.name = 'Введите имя'
    const phoneDigits = orderForm.phone.replace(/\D/g, '').length
    if (phoneDigits < 11) {
      const missing = 11 - phoneDigits
      newErrors.phone = phoneDigits < 2 ? 'Введите номер телефона' : `Не хватает ${missing} ${missing === 1 ? 'цифры' : 'цифр'}`
    }
    if (!orderAgreed) newErrors.agreed = true
    if (Object.keys(newErrors).length > 0) {
      setOrderErrors(newErrors)
      toast('Заполните обязательные поля', 'error')
      return
    }
    try {
      await api.submitOrder({
        name: orderForm.name,
        phone: orderForm.phone,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
        })),
        total: getTotal(),
      })
      setIsOrderSuccess(true)
      clearCart()
    } catch {
      toast('Ошибка оформления заказа. Попробуйте позже', 'error')
    }
  }, [orderForm, items, getTotal, clearCart])

  const handleCloseModal = () => {
    setIsOrderModalOpen(false)
    setIsOrderSuccess(false)
    setOrderForm({ name: '', phone: '+7' })
    setOrderAgreed(false)
    setOrderErrors({})
  }

  if (items.length === 0 && !isOrderSuccess) {
    return (
      <PageLayout className="flex-1 flex items-center justify-center">
        <div className="text-center section-padding py-20">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-dark mb-3">
            Корзина пуста
          </h1>
          <p className="text-gray-medium mb-8 max-w-md mx-auto">
            Добавьте товары из каталога, чтобы оформить заказ
          </p>
          <Link to="/catalog">
            <Button variant="primary" size="lg">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout className="flex-1 section-padding py-8 lg:py-12 pb-16 lg:pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-medium hover:text-gray-dark transition-colors mb-4">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Назад</span>
      </button>

      <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-8">
        Корзина
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Товары */}
        <div className="lg:col-span-2 order-1">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
              />
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-sm text-gray-medium hover:text-red-500 transition-colors"
          >
            Очистить корзину
          </button>
        </div>

        {/* Итого - на мобильном второй, на десктопе справа на всю высоту */}
        <div className="lg:col-span-1 lg:row-span-2 order-2">
          <div className="bg-gray-light p-6 rounded-card">
            <h2 className="text-lg font-semibold text-gray-dark mb-4">
              Итого
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-medium">
                  Товары ({items.reduce((sum, i) => sum + i.quantity, 0)} шт.)
                </span>
                <span className="text-gray-dark font-medium">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-medium">Доставка</span>
                <span className="text-green-600 font-medium">Бесплатно</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-dark">
                  К оплате
                </span>
                <span className="text-xl font-bold text-gray-dark">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setIsOrderModalOpen(true)}
            >
              Оформить заказ
            </Button>

            <p className="text-xs text-gray-medium text-center mt-4">
              Нажимая кнопку, вы соглашаетесь с{' '}
              <Link to="/terms" className="underline hover:text-gray-dark">
                условиями
              </Link>
            </p>
          </div>
        </div>

        {/* Рекомендации - на мобильном третий, на десктопе под товарами */}
        {items.length > 0 && (
          <div className="lg:col-span-2 order-3">
            <CartRecommendations cartItems={items} />
          </div>
        )}
      </div>

      {/* Модалка оформления заказа */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={handleCloseModal}
        title={isOrderSuccess ? 'Заказ оформлен!' : 'Оформление заказа'}
        size="sm"
      >
        {isOrderSuccess ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-dark mb-2">
              Спасибо за заказ!
            </p>
            <p className="text-sm text-gray-medium mb-6">
              Мы свяжемся с вами для подтверждения
            </p>
            <Link to="/catalog">
              <Button variant="primary" onClick={handleCloseModal}>
                Продолжить покупки
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-1">
                Ваше имя
              </label>
              <input
                type="text"
                value={orderForm.name}
                onChange={(e) => {
                  setOrderForm((prev) => ({ ...prev, name: e.target.value }))
                  setOrderErrors(prev => ({ ...prev, name: false }))
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 ${orderErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Иван"
              />
              {orderErrors.name && <p className="text-red-500 text-xs mt-1">{orderErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-1">
                Телефон
              </label>
              <input
                type="tel"
                value={orderForm.phone}
                onChange={(e) => {
                  setOrderForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value, prev.phone) }))
                  setOrderErrors(prev => ({ ...prev, phone: false }))
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 ${orderErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="+7 (___) ___-__-__"
              />
              {orderErrors.phone && <p className="text-red-500 text-xs mt-1">{orderErrors.phone}</p>}
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={orderAgreed}
                onChange={(e) => { setOrderAgreed(e.target.checked); setOrderErrors(prev => ({ ...prev, agreed: false })) }}
                className={`w-4 h-4 accent-gray-dark ${orderErrors.agreed ? 'ring-2 ring-red-500' : ''}`}
              />
              <span className={`text-xs ${orderErrors.agreed ? 'text-red-500' : 'text-gray-medium'}`}>
                Согласен на обработку{' '}
                <Link to="/privacy" className="underline hover:text-gray-dark">
                  персональных данных
                </Link>
              </span>
            </label>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Подтвердить заказ
            </Button>
          </form>
        )}
      </Modal>
    </PageLayout>
  )
}
