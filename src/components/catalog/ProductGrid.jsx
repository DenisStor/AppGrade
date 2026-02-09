import { ProductListCard } from './ProductListCard'
import { getBrandSlug } from '../../utils/product'

function ProductCardSkeleton() {
  return (
    <>
      {/* Мобильный скелетон */}
      <div className="lg:hidden flex flex-col rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="aspect-[4/5] bg-gray-light/50 animate-shimmer" />
        <div className="p-3 flex flex-col gap-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-shimmer" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-shimmer" />
          <div className="h-9 w-full bg-gray-200 rounded-btn mt-1 animate-shimmer" />
        </div>
      </div>

      {/* Десктопный скелетон */}
      <div className="hidden lg:flex flex-col h-full bg-white p-6 rounded-card border border-gray-100 shadow-sm">
        <div className="aspect-[4/5] rounded-card bg-gray-light/50 mb-3 animate-shimmer" />
        <div className="h-7 mb-3 flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 animate-shimmer" />
          ))}
        </div>
        <div className="min-h-[3.5rem] mb-1 space-y-2">
          <div className="h-5 w-full bg-gray-200 rounded animate-shimmer" />
          <div className="h-5 w-2/3 bg-gray-200 rounded animate-shimmer" />
        </div>
        <div className="h-10 mb-4 space-y-1.5">
          <div className="h-4 w-full bg-gray-100 rounded animate-shimmer" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-shimmer" />
        </div>
        <div className="min-h-14 mb-3">
          <div className="h-7 w-1/2 bg-gray-200 rounded animate-shimmer" />
        </div>
        <div className="mt-auto">
          <div className="h-12 w-full bg-gray-200 rounded-btn animate-shimmer" />
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
