export function SimSelector({ options = [], selected, onChange, availableForSelection = [], className = '' }) {
  const getSimAvailability = (simId) => {
    if (!availableForSelection.length) return true
    const found = availableForSelection.find(s => s.id === simId)
    return found ? found.inStock : false
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">Связь</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.id === selected
          const isAvailable = getSimAvailability(option.id)
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              disabled={!isAvailable}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                !isAvailable
                  ? 'border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                  : isSelected
                  ? 'border-gray-dark bg-white text-gray-dark scale-[1.05]'
                  : 'border-gray-200 bg-white text-gray-dark hover:border-gray-300'
              }`}
              title={!isAvailable ? 'Нет в наличии' : undefined}
            >
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
