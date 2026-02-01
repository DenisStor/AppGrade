import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, ShoppingCart, Check, Truck, Shield, CreditCard } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Badge, BadgeGroup } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Tabs } from '../../components/ui/Tabs'
import { ProductGallery } from '../../components/product/ProductGallery'
import { ColorSelector } from '../../components/product/ColorSelector'
import { MemorySelector } from '../../components/product/MemorySelector'
import { SimSelector } from '../../components/product/SimSelector'
import { RelatedProducts } from '../../components/product/RelatedProducts'
import { RecentlyViewed } from '../../components/product/RecentlyViewed'
import { ProductJsonLd, BreadcrumbJsonLd } from '../../components/seo/JsonLd'
import {
  getProductBySlug,
  getCategoryBySlug,
  getAvailableColors,
  getAvailableMemory,
  formatPrice,
  formatMemory,
} from '../../data/products'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { useRecentlyViewedStore } from '../../stores/useRecentlyViewedStore'
import { useCartStore } from '../../stores/useCartStore'

export default function ProductPage() {
  const { category, slug } = useParams()
  const product = getProductBySlug(slug)
  const categoryData = getCategoryBySlug(category)

  const { toggleItem, isFavorite } = useFavoritesStore()
  const { addItem } = useRecentlyViewedStore()
  const { addItem: addToCart, isInCart } = useCartStore()

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [selectedSim, setSelectedSim] = useState(null)
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)
  const [quickBuyForm, setQuickBuyForm] = useState({ name: '', phone: '' })

  const colors = useMemo(() => getAvailableColors(product), [product])
  const memoryOptions = useMemo(() => getAvailableMemory(product), [product])

  // Инициализация выбранных опций
  useEffect(() => {
    if (product?.variants?.length) {
      const firstInStock = product.variants.find((v) => v.inStock) || product.variants[0]
      setSelectedColor(firstInStock.color.id)
      setSelectedMemory(firstInStock.memory)
    }
    if (product?.simOptions?.length) {
      setSelectedSim(product.simOptions[0].id)
    }
  }, [product])

  // Добавление в недавно просмотренные
  useEffect(() => {
    if (product) {
      addItem(product.id)
    }
  }, [product, addItem])

  // Текущий вариант
  const currentVariant = useMemo(() => {
    if (!product) return null
    // Для товаров без памяти (например, Dyson) ищем только по цвету
    if (memoryOptions.length === 0) {
      return product.variants.find((v) => v.color.id === selectedColor)
    }
    return product.variants.find(
      (v) => v.color.id === selectedColor && v.memory === selectedMemory
    )
  }, [product, selectedColor, selectedMemory, memoryOptions])

  // Доступность памяти для выбранного цвета
  const availableMemoryForColor = useMemo(() => {
    if (!product || !selectedColor) return []
    return product.variants
      .filter((v) => v.color.id === selectedColor)
      .map((v) => ({ memory: v.memory, inStock: v.inStock }))
  }, [product, selectedColor])

  // SEO
  useEffect(() => {
    if (product && currentVariant) {
      const memoryPart = currentVariant.memory ? ` ${formatMemory(currentVariant.memory)}` : ''
      document.title = `${product.name}${memoryPart} — купить в APPGRADE`
    }
  }, [product, currentVariant])

  if (!product) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-dark mb-4">Товар не найден</h1>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: categoryData?.name || category, href: `/catalog/${category}` },
    { label: product.name },
  ]

  const discount = currentVariant?.oldPrice
    ? Math.round((1 - currentVariant.price / currentVariant.oldPrice) * 100)
    : 0

  const handleQuickBuySubmit = (e) => {
    e.preventDefault()
    // TODO: Интеграция с API
    alert(`Заявка отправлена!\nИмя: ${quickBuyForm.name}\nТелефон: ${quickBuyForm.phone}`)
    setIsQuickBuyOpen(false)
    setQuickBuyForm({ name: '', phone: '' })
  }

  const tabs = [
    {
      id: 'description',
      label: 'Описание',
      content: <p className="text-gray-dark leading-relaxed">{product.description}</p>,
    },
    {
      id: 'specs',
      label: 'Характеристики',
      content: (
        <div className="space-y-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-medium capitalize">{key}</span>
              <span className="text-gray-dark font-medium">{value}</span>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="section-padding py-6 lg:py-10">
      <ProductJsonLd product={product} variant={currentVariant} category={category} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Галерея */}
        <ProductGallery
          images={currentVariant?.images || []}
          productName={product.name}
        />

        {/* Информация */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <BadgeGroup badges={product.badges} className="mb-2" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
                {product.name}
                {currentVariant && (
                  <span className="block font-normal whitespace-nowrap">
                    ({currentVariant.color.name})
                  </span>
                )}
              </h1>
              <p className="text-gray-medium mt-1">{product.shortDescription}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleItem(product.id)}
                className={`p-3 rounded-full transition-colors ${
                  isFavorite(product.id)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-100 text-gray-dark hover:bg-gray-200'
                }`}
                aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'В избранное'}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                />
              </button>
              <button
                onClick={() => navigator.share?.({ url: window.location.href })}
                className="p-3 rounded-full bg-gray-100 text-gray-dark hover:bg-gray-200 transition-colors"
                aria-label="Поделиться"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Цена */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-dark">
                {currentVariant ? formatPrice(currentVariant.price) : '—'}
              </span>
              {currentVariant?.oldPrice && (
                <>
                  <span className="text-lg text-gray-medium line-through">
                    {formatPrice(currentVariant.oldPrice)}
                  </span>
                  <Badge variant="discount" label={`-${discount}%`} />
                </>
              )}
            </div>
            {currentVariant?.inStock ? (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                В наличии
              </p>
            ) : (
              <p className="text-gray-medium text-sm mt-1">Под заказ</p>
            )}
          </div>

          {/* Конфигуратор */}
          <div className="space-y-6 mb-8">
            <ColorSelector
              colors={colors}
              selected={selectedColor}
              onChange={(colorId) => {
                setSelectedColor(colorId)
                // Проверяем, доступна ли текущая память для нового цвета
                const variantsForColor = product.variants.filter(
                  (v) => v.color.id === colorId
                )
                if (!variantsForColor.find((v) => v.memory === selectedMemory)) {
                  setSelectedMemory(variantsForColor[0]?.memory)
                }
              }}
              variants={product.variants}
            />

            {memoryOptions.length > 0 && (
              <MemorySelector
                options={memoryOptions}
                selected={selectedMemory}
                onChange={setSelectedMemory}
                availableForColor={availableMemoryForColor}
              />
            )}

            {product.simOptions?.length > 0 && (
              <SimSelector
                options={product.simOptions}
                selected={selectedSim}
                onChange={setSelectedSim}
              />
            )}
          </div>

          {/* Кнопки */}
          <div className="space-y-3 mb-8">
            {currentVariant && isInCart(product.id, currentVariant.id) ? (
              <Link to="/cart" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  <Check className="w-5 h-5 mr-2" />
                  В корзине
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => currentVariant && addToCart(product, currentVariant, selectedSim)}
                disabled={!currentVariant}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Добавить в корзину
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setIsQuickBuyOpen(true)}
            >
              Купить в 1 клик
            </Button>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-light rounded-xl">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-gray-dark" />
              <p className="text-xs text-gray-medium">Бесплатная доставка</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-gray-dark" />
              <p className="text-xs text-gray-medium">Гарантия 1 год</p>
            </div>
            <div className="text-center">
              <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-dark" />
              <p className="text-xs text-gray-medium">Рассрочка 0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="mt-12 lg:mt-16">
        <Tabs tabs={tabs} defaultTab="description" />
      </div>

      {/* Похожие товары */}
      <RelatedProducts productId={product.id} className="mt-12 lg:mt-16" />

      {/* Недавно просмотренные */}
      <RecentlyViewed currentProductId={product.id} className="mt-12 lg:mt-16" />

      {/* Модалка "Купить в 1 клик" */}
      <Modal
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
        title="Купить в 1 клик"
        size="sm"
      >
        <form onSubmit={handleQuickBuySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-1">
              Ваше имя
            </label>
            <input
              type="text"
              required
              value={quickBuyForm.name}
              onChange={(e) =>
                setQuickBuyForm((prev) => ({ ...prev, name: e.target.value }))
              }
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
              value={quickBuyForm.phone}
              onChange={(e) =>
                setQuickBuyForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          <p className="text-sm text-gray-medium">
            Мы перезвоним вам для подтверждения заказа
          </p>
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Отправить заявку
          </Button>
        </form>
      </Modal>
    </div>
  )
}
