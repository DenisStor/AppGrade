import { formatMemory } from '../../data/products'

export function MemorySelector({
  options = [],
  selected,
  onChange,
  availableForColor = [],
  className = '',
}) {
  const getMemoryAvailability = (memory) => {
    const found = availableForColor.find((m) => m.memory === memory)
    return found ? found.inStock : false
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">Память</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((memory) => {
          const isSelected = memory === selected
          const isAvailable = getMemoryAvailability(memory)

          return (
            <button
              key={memory}
              onClick={() => onChange(memory)}
              disabled={!isAvailable}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gray-dark text-white'
                  : isAvailable
                  ? 'bg-gray-100 text-gray-dark hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
              }`}
              title={!isAvailable ? 'Нет в наличии' : undefined}
            >
              {formatMemory(memory)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
