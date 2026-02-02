import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '../ui/Button'

export function ProductActions({
  product,
  currentVariant,
  selectedSim,
  isInCart,
  onAddToCart,
  onQuickBuy,
}) {
  const inCart = currentVariant && isInCart(product.id, currentVariant.id)

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
          onClick={() => currentVariant && onAddToCart(product, currentVariant, selectedSim)}
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
