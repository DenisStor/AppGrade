import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import { BadgeGroup } from '../ui/Badge'
import { getMinPrice, formatPrice, getAvailableColors } from '../../data/products'
import { useFavoritesStore } from '../../stores/useFavoritesStore'

export function ProductListCard({ product, category }) {
  const { toggleItem, isFavorite } = useFavoritesStore()

  const minPrice = getMinPrice(product)
  const colors = getAvailableColors(product)
  const firstVariant = product.variants?.[0]
  const hasDiscount = firstVariant?.oldPrice && firstVariant.oldPrice > firstVariant.price
  const discount = hasDiscount
    ? Math.round((1 - firstVariant.price / firstVariant.oldPrice) * 100)
    : 0

  return (
    <article className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-liquid">
      <Link
        to={`/catalog/${category}/${product.slug}`}
        className="block relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-light"
      >
        <ImageWithSkeleton
          src={firstVariant?.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {product.badges?.length > 0 && (
          <BadgeGroup
            badges={product.badges}
            className="absolute top-3 left-3"
          />
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleItem(product.id)
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorite(product.id)
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-gray-dark hover:bg-white'
          }`}
          aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'В избранное'}
        >
          <Heart
            className="w-5 h-5"
            fill={isFavorite(product.id) ? 'currentColor' : 'none'}
          />
        </button>
      </Link>

      <div className="space-y-2">
        {/* Цвета */}
        {colors.length > 1 && (
          <div className="flex gap-1.5">
            {colors.slice(0, 5).map((color) => (
              <span
                key={color.id}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-xs text-gray-medium">+{colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Название */}
        <Link
          to={`/catalog/${category}/${product.slug}`}
          className="block"
        >
          <h3 className="text-sm font-medium text-gray-dark line-clamp-2 group-hover:text-gray-medium transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Краткое описание */}
        <p className="text-xs text-gray-medium line-clamp-1">
          {product.shortDescription}
        </p>

        {/* Цена */}
        <div className="pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-dark">
              {formatPrice(minPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-medium line-through">
                {formatPrice(firstVariant.oldPrice)}
              </span>
            )}
          </div>

          {hasDiscount && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Кнопка */}
        <button className="w-full mt-3 py-2.5 px-4 bg-gray-dark text-white text-sm font-medium rounded-lg hover:bg-gray-dark/90 transition-colors flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          В корзину
        </button>
      </div>
    </article>
  )
}
