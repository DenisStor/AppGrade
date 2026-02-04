import { Minus, Plus, Trash2 } from 'lucide-react'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import { formatPrice, formatMemory } from '../../data/products'

export function CartItem({ item, onRemove, onUpdateQuantity }) {
  const memoryLabel = item.memory ? formatMemory(item.memory) : ''
  const colorLabel = item.color?.name || ''
  const simLabel = item.sim ? `${item.sim}` : ''

  const options = [colorLabel, memoryLabel, simLabel].filter(Boolean).join(' • ')

  return (
    <div className="flex gap-4 p-4 bg-gray-light">
      <div className="w-24 h-24 shrink-0 bg-white overflow-hidden">
        <ImageWithSkeleton
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-2"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-dark truncate">{item.name}</h3>
        {options && (
          <p className="text-sm text-gray-medium mt-1">{options}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Уменьшить количество"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="Увеличить количество"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <span className="font-bold text-gray-dark">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="self-start p-2 text-gray-medium hover:text-red-500 transition-colors"
        aria-label="Удалить товар"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}
