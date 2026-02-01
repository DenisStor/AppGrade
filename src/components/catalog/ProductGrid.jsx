import { ProductListCard } from './ProductListCard'

export function ProductGrid({ products = [], category, className = '' }) {
  if (!products.length) return null

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductListCard
          key={product.id}
          product={product}
          category={category || product.category}
        />
      ))}
    </div>
  )
}
