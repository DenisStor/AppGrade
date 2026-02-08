import { useMemo } from 'react'
import { X } from 'lucide-react'
import { formatMemory, formatPrice } from '../../utils/product'
import { PRICE } from '../../data/constants'

export function ActiveFilters({
  filters,
  availableColors = [],
  availableMemory = [],
  onRemoveColor,
  onRemoveMemory,
  onRemoveBrand,
  onResetPrice,
  onResetStock,
  onResetAll,
  className = '',
}) {
  const hasFilters = useMemo(() =>
    filters.colors.length > 0 ||
    filters.memory.length > 0 ||
    filters.brands?.length > 0 ||
    filters.inStock ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < PRICE.MAX
  , [filters])

  if (!hasFilters) return null

  const getColorName = (colorId) => {
    const color = availableColors.find((c) => c.id === colorId)
    return color?.name || colorId
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-medium">Фильтры:</span>

      {/* Бренды */}
      {filters.brands?.map((brand) => (
        <Tag
          key={brand}
          label={brand}
          onRemove={() => onRemoveBrand(brand)}
        />
      ))}

      {/* Цена */}
      {(filters.priceRange[0] > 0 || filters.priceRange[1] < PRICE.MAX) && (
        <Tag
          label={`${formatPrice(filters.priceRange[0])} — ${formatPrice(filters.priceRange[1])}`}
          onRemove={onResetPrice}
        />
      )}

      {/* Цвета */}
      {filters.colors.map((colorId) => (
        <Tag
          key={colorId}
          label={getColorName(colorId)}
          onRemove={() => onRemoveColor(colorId)}
        />
      ))}

      {/* Память */}
      {filters.memory.map((memory) => (
        <Tag
          key={memory}
          label={formatMemory(memory)}
          onRemove={() => onRemoveMemory(memory)}
        />
      ))}

      {/* В наличии */}
      {filters.inStock && (
        <Tag label="В наличии" onRemove={onResetStock} />
      )}

      {/* Сбросить все */}
      <button
        onClick={onResetAll}
        className="text-sm text-gray-medium hover:text-gray-dark transition-colors underline underline-offset-2"
      >
        Сбросить все
      </button>
    </div>
  )
}

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-sm">
      <span className="text-gray-dark">{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
        aria-label={`Удалить фильтр: ${label}`}
      >
        <X className="w-3.5 h-3.5 text-gray-medium" />
      </button>
    </span>
  )
}
