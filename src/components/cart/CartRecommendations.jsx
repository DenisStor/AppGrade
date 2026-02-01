import { useMemo } from 'react'
import { ProductGrid } from '../catalog/ProductGrid'
import { allProducts, getProductById } from '../../data/products'

export function CartRecommendations({ cartItems }) {
  const recommendations = useMemo(() => {
    // ID товаров в корзине
    const cartProductIds = new Set(cartItems.map(item => item.productId))

    // Категории в корзине
    const cartCategories = new Set()
    const relatedSet = new Set()

    cartItems.forEach(item => {
      const product = getProductById(item.productId)
      if (product) {
        cartCategories.add(product.category)
        // Собираем relatedIds
        product.relatedIds?.forEach(id => {
          if (!cartProductIds.has(id)) {
            relatedSet.add(id)
          }
        })
      }
    })

    // 1. Сначала relatedIds
    const result = []
    relatedSet.forEach(id => {
      const product = getProductById(id)
      if (product && result.length < 4) {
        result.push(product)
      }
    })

    // 2. Дополняем товарами из других категорий
    if (result.length < 4) {
      const otherProducts = allProducts.filter(p =>
        !cartProductIds.has(p.id) &&
        !relatedSet.has(p.id) &&
        !cartCategories.has(p.category)
      )

      // Берём по одному из каждой категории
      const addedCategories = new Set()
      for (const product of otherProducts) {
        if (result.length >= 4) break
        if (!addedCategories.has(product.category)) {
          result.push(product)
          addedCategories.add(product.category)
        }
      }
    }

    return result
  }, [cartItems])

  if (recommendations.length === 0) return null

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-dark mb-6">
        С этим товаром покупают
      </h3>
      <ProductGrid products={recommendations} />
    </div>
  )
}
