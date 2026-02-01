import { useMemo } from 'react'
import { getRelatedProducts, getProductsByCategory, getProductById } from '../../data/products'
import { ProductGrid } from '../catalog/ProductGrid'
import { SectionHeader } from '../ui/SectionHeader'

export function RelatedProducts({ productId, className = '' }) {
  const relatedProducts = useMemo(() => {
    let products = getRelatedProducts(productId, 4)

    // Если нет связанных, берём товары из той же категории
    if (!products.length) {
      const product = getProductById(productId)
      if (product) {
        products = getProductsByCategory(product.category)
          .filter((p) => p.id !== productId)
          .slice(0, 4)
      }
    }

    return products
  }, [productId])

  if (!relatedProducts.length) return null

  return (
    <section className={className}>
      <SectionHeader
        title="Похожие товары"
        linkText=""
        className="mb-6"
      />
      <ProductGrid products={relatedProducts} />
    </section>
  )
}
