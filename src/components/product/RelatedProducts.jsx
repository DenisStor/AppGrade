import { memo } from 'react'
import { ProductGrid } from '../catalog/ProductGrid'
import { SectionHeader } from '../ui/SectionHeader'

export const RelatedProducts = memo(function RelatedProducts({ relatedProducts = [], className = '' }) {
  if (!relatedProducts?.length) return null

  return (
    <section className={className}>
      <SectionHeader title="Похожие товары" linkText="" className="mb-6" />
      <ProductGrid products={relatedProducts.slice(0, 4)} />
    </section>
  )
})
