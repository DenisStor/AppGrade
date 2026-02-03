import { ProductListCard } from './ProductListCard'
import { getBrandSlug } from '../../data/products'

export function ProductGrid({ products = [], category, brand, className = '' }) {
  if (!products.length) return null

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 ${className}`}>
      {products.map((product) => (
        <ProductListCard
          key={product.id}
          product={product}
          category={category || product.category}
          brand={brand || getBrandSlug(product.brand)}
        />
      ))}
    </div>
  )
}
