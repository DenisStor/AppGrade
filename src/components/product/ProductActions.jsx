import { Link } from 'react-router-dom'
import { ShoppingCart, Check, Bell } from 'lucide-react'
import { Button } from '../ui/Button'

export function ProductActions({
  product,
  currentVariant,
  isInCart,
  onAddToCart,
  onQuickBuy,
  onNotify,
}) {
  const inCart = currentVariant && isInCart(product.id, currentVariant.id)
  const inStock = currentVariant?.inStock !== false

  const handleAddToCart = () => {
    if (!currentVariant) return
    onAddToCart(product, currentVariant)
  }

  if (!inStock) {
    return (
      <div className="space-y-3 mb-8">
        <Button variant="primary" size="lg" className="w-full" onClick={onNotify}>
          <Bell className="w-5 h-5 mr-2" />
          Уведомить о поступлении
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3 mb-8">
      {inCart ? (
        <Link to="/cart" className="block">
          <Button variant="outline" size="lg" className="w-full">
            <Check className="w-5 h-5 mr-2" />
            В корзине
          </Button>
        </Link>
      ) : (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!currentVariant}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Добавить в корзину
        </Button>
      )}
      <Button variant="outline" size="lg" className="w-full" onClick={onQuickBuy}>
        Купить в 1 клик
      </Button>
    </div>
  )
}
