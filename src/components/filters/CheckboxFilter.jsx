export function CheckboxFilter({ options = [], selected = [], onChange }) {
  const toggleOption = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value)

        return (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleOption(option.value)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-gray-dark peer-checked:bg-gray-dark transition-colors" />
              <svg
                className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-dark group-hover:text-gray-medium transition-colors">
              {option.label}
            </span>
            {option.count !== undefined && (
              <span className="text-xs text-gray-medium ml-auto">
                {option.count}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )
}
