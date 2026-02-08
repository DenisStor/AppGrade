import { useState, useEffect } from 'react'
import { useRecentlyViewedStore } from '../../stores/useRecentlyViewedStore'
import { catalogApi } from '../../services/catalogApi'
import { mapProducts } from '../../services/productMapper'
import { ProductGrid } from '../catalog/ProductGrid'
import { SectionHeader } from '../ui/SectionHeader'

export function RecentlyViewed({ currentProductId, className = '' }) {
  const { items } = useRecentlyViewedStore()
  const [products, setProducts] = useState([])

  const slugs = items.filter((id) => id !== currentProductId).slice(0, 4)

  useEffect(() => {
    if (!slugs.length) {
      setProducts([])
      return
    }
    let cancelled = false
    catalogApi.getProductsBySlugs(slugs).then(raw => {
      if (!cancelled) {
        const mapped = mapProducts(raw)
        const ordered = slugs
          .map(slug => mapped.find(p => p.slug === slug))
          .filter(Boolean)
        setProducts(ordered)
      }
    }).catch(err => console.error('RecentlyViewed:', err.message))
    return () => { cancelled = true }
  }, [slugs.join(',')])

  if (!products.length) return null

  return (
    <section className={className}>
      <SectionHeader title="Вы недавно смотрели" linkText="" className="mb-6" />
      <ProductGrid products={products} />
    </section>
  )
}
