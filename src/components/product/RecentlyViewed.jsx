import { useMemo } from 'react'
import { useRecentlyViewedStore } from '../../stores/useRecentlyViewedStore'
import { getProductById } from '../../data/products'
import { ProductGrid } from '../catalog/ProductGrid'
import { SectionHeader } from '../ui/SectionHeader'

export function RecentlyViewed({ currentProductId, className = '' }) {
  const { items } = useRecentlyViewedStore()

  const products = useMemo(() => {
    return items
      .filter((id) => id !== currentProductId)
      .map((id) => getProductById(id))
      .filter(Boolean)
      .slice(0, 4)
  }, [items, currentProductId])

  if (!products.length) return null

  return (
    <section className={className}>
      <SectionHeader
        title="Вы недавно смотрели"
        linkText=""
        className="mb-6"
      />
      <ProductGrid products={products} />
    </section>
  )
}
