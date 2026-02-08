import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import { getMinPrice, formatPrice, getBrandSlug } from '../../utils/product'

export function SearchDropdown({ results = [], query, onClose }) {
  const navigate = useNavigate()

  const displayedProducts = useMemo(() => results.slice(0, 5), [results])
  const hasMore = results.length > 5

  const handleShowAll = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
    onClose()
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in">
      <div className="max-h-96 overflow-y-auto">
        {displayedProducts.map((product) => {
          const variant = product.variants?.[0]
          const price = getMinPrice(product)

          const brandSlug = getBrandSlug(product.brand)

          return (
            <Link
              key={product.id}
              to={`/catalog/${product.category}/${brandSlug}/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 bg-gray-light rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithSkeleton
                  src={variant?.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-dark truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-medium truncate">
                  {product.shortDescription}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-dark flex-shrink-0">
                {formatPrice(price)}
              </span>
            </Link>
          )
        })}
      </div>

      {hasMore && (
        <button
          onClick={handleShowAll}
          className="w-full px-4 py-3 text-sm font-medium text-gray-dark hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 border-t border-gray-100"
        >
          Показать все ({results.length})
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
