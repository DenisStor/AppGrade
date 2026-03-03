import { ProductListCard } from './ProductListCard'
import { getBrandSlug } from '../../utils/product'

function ProductCardSkeleton() {
  return (
    <>
      {/* Мобильный скелетон */}
      <div className="lg:hidden flex flex-col">
        <div className="bg-gray-light/40 rounded-2xl overflow-hidden">
          <div className="aspect-square bg-gray-light/50 animate-shimmer" />
          <div className="flex justify-center gap-1.5 pb-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gray-200 animate-shimmer" />
            ))}
          </div>
        </div>
        <div className="pt-2 px-1 flex flex-col gap-1.5">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-shimmer" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-shimmer" />
        </div>
      </div>

      {/* Десктопный скелетон */}
      <div className="hidden lg:flex flex-col h-full">
        <div className="bg-gray-light/40 rounded-2xl overflow-hidden">
          <div className="aspect-square bg-gray-light/50 animate-shimmer" />
          <div className="flex justify-center gap-1.5 pb-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gray-200 animate-shimmer" />
            ))}
          </div>
        </div>
        <div className="pt-3 px-1 flex flex-col gap-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-shimmer" />
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-shimmer" />
        </div>
      </div>
    </>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-7">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductGrid({ products = [], category, brand, className = '' }) {
  if (!products.length) return null

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-7 ${className}`}>
      {products.map((product, index) => (
        <div key={product.id} className="h-full animate-card-appear"
             style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}>
          <ProductListCard
            product={product}
            category={category || product.category}
            brand={brand || getBrandSlug(product.brand)}
          />
        </div>
      ))}
    </div>
  )
}
