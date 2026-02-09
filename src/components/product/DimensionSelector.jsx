export function DimensionSelector({ label, options = [], selected, onChange, className = '' }) {
  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">{label}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.id === selected
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gray-dark text-white scale-[1.05]'
                  : 'bg-gray-100 text-gray-dark hover:bg-gray-200'
              }`}
            >
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
