import { ProductGrid } from '../catalog/ProductGrid'
import { SectionHeader } from '../ui/SectionHeader'

export function RelatedProducts({ relatedProducts = [], className = '' }) {
  // relatedProducts передаются из ProductPage (уже замапленные)
  if (!relatedProducts?.length) return null

  return (
    <section className={className}>
      <SectionHeader title="Похожие товары" linkText="" className="mb-6" />
      <ProductGrid products={relatedProducts.slice(0, 4)} />
    </section>
  )
}
