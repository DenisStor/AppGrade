export function SimSelector({ options = [], selected, onChange, className = '' }) {
  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">Связь</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.id === selected
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                isSelected
                  ? 'border-gray-dark bg-white text-gray-dark'
                  : 'border-gray-200 bg-white text-gray-dark hover:border-gray-300'
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
