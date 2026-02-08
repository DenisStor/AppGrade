import { useState, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Check } from 'lucide-react'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import { BadgeGroup } from '../ui/Badge'
import { ColorSwatch } from '../ui/ColorSwatch'
import { getMinPrice, formatPrice, getAvailableColors } from '../../utils/product'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import { useCartStore } from '../../stores/useCartStore'
import { useToast } from '../../hooks/useToast'

export const ProductListCard = memo(function ProductListCard({ product, category, brand }) {
  const { toggleItem, isFavorite } = useFavoritesStore()
  const { addItem: addToCart, isInCart } = useCartStore()
  const { toast } = useToast()
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [selectedColorId, setSelectedColorId] = useState(null)

  const colors = getAvailableColors(product)

  const selectedVariant = useMemo(() => {
    if (selectedColorId) {
      return product.variants?.find(v => v.color.id === selectedColorId) || product.variants?.[0]
    }
    return product.variants?.[0]
  }, [product.variants, selectedColorId])

  const minPrice = getMinPrice(product)
  const hasDiscount = selectedVariant?.oldPrice && selectedVariant.oldPrice > selectedVariant.price
  const discount = hasDiscount
    ? Math.round((1 - selectedVariant.price / selectedVariant.oldPrice) * 100)
    : 0

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsHeartAnimating(true)
    toggleItem(product.id)
    setTimeout(() => setIsHeartAnimating(false), 400)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedVariant) {
      addToCart(product, selectedVariant)
      toast('Товар добавлен в корзину')
    }
  }

  const inCart = selectedVariant && isInCart(product.id, selectedVariant.id)

  const handleColorClick = (e, colorId) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedColorId(colorId)
  }

  const productUrl = `/catalog/${category}/${brand}/${product.slug}`

  return (
    <>
      {/* Мобильная версия — компактная карточка */}
      <article className="lg:hidden">
        <Link to={productUrl} className="block">
          <div className="aspect-square flex items-center justify-center">
            <ImageWithSkeleton
              src={selectedVariant?.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-dark mt-3 pb-2 text-center line-clamp-2">
            {product.name}
          </h3>
        </Link>
      </article>

      {/* Десктопная версия — flexbox с фиксированными высотами */}
      <article className="hidden lg:flex group flex-col h-full bg-white p-5 rounded-card border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Изображение */}
        <Link
          to={productUrl}
          className="block relative aspect-square rounded-card overflow-hidden mb-4"
        >
          <ImageWithSkeleton
            src={selectedVariant?.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {product.badges?.length > 0 && (
            <BadgeGroup
              badges={product.badges}
              className="absolute top-3 left-3"
            />
          )}

          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              isFavorite(product.id)
                ? 'bg-red-50 text-red-500'
                : 'bg-white/80 text-gray-dark hover:bg-white'
            }`}
            aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'В избранное'}
          >
            <Heart
              className={`w-5 h-5 ${isHeartAnimating ? 'animate-heart-beat' : ''}`}
              fill={isFavorite(product.id) ? 'currentColor' : 'none'}
            />
          </button>
        </Link>

        {/* Цвета — фиксированная высота */}
        <div className="h-6 mb-3">
          {colors.length > 1 && (
            <div className="flex gap-1.5">
              {colors.slice(0, 5).map((color) => (
                <ColorSwatch
                  key={color.id}
                  color={color}
                  selected={selectedColorId === color.id}
                  size="sm"
                  showCheck={false}
                  onClick={(e) => handleColorClick(e, color.id)}
                />
              ))}
              {colors.length > 5 && (
                <span className="text-xs text-gray-medium self-center">+{colors.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Название — минимальная высота для 2 строк */}
        <Link to={productUrl} className="block min-h-[3rem] mb-1">
          <h3 className="text-base font-medium text-gray-dark line-clamp-2 group-hover:text-gray-medium transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Описание — фиксированная высота для 2 строк */}
        <p className="text-sm text-gray-medium line-clamp-2 h-10 mb-3">
          {product.shortDescription}
        </p>

        {/* Цена + скидка — фиксированная высота */}
        <div className="min-h-14 mb-3">
          <div className="flex items-baseline gap-x-2 flex-wrap">
            <span className="text-xl font-bold text-gray-dark whitespace-nowrap">
              {formatPrice(minPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-medium line-through whitespace-nowrap">
                {formatPrice(selectedVariant.oldPrice)}
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Кнопка — прибита к низу через mt-auto */}
        <div className="mt-auto">
          {inCart ? (
            <Link
              to="/cart"
              onClick={(e) => e.stopPropagation()}
              className="group/btn w-full py-3 px-4 rounded-btn bg-white border border-gray-dark text-gray-dark text-sm font-medium hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              В корзине
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className="group/btn w-full py-3 px-4 rounded-btn bg-gray-dark text-white text-sm font-medium hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              В корзину
            </button>
          )}
        </div>
      </article>
    </>
  )
})
