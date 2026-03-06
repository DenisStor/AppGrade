export function DimensionSelector({ label, options = [], selected, onChange, isOptionAvailable, className = '' }) {
  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">{label}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.id === selected
          const available = isOptionAvailable ? isOptionAvailable(option.id) : true
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              disabled={!available}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !available
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-gray-dark text-white scale-[1.05]'
                  : 'bg-gray-100 text-gray-dark hover:bg-gray-200'
              }`}
              title={!available ? 'Нет в наличии' : undefined}
            >
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
