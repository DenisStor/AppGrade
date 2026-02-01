import { Check } from 'lucide-react'

export function ColorFilter({ colors = [], selected = [], onChange }) {
  const toggleColor = (colorId) => {
    const updated = selected.includes(colorId)
      ? selected.filter((c) => c !== colorId)
      : [...selected, colorId]
    onChange(updated)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const isSelected = selected.includes(color.id)
        const isLight =
          color.hex.toLowerCase() === '#ffffff' ||
          color.hex.toLowerCase() === '#f5f5f0' ||
          color.hex.toLowerCase() === '#f0e4d3' ||
          color.hex.toLowerCase() === '#e3e4e5'

        return (
          <button
            key={color.id}
            onClick={() => toggleColor(color.id)}
            className={`relative w-8 h-8 rounded-full transition-all ${
              isSelected
                ? 'ring-2 ring-gray-dark ring-offset-2'
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`${color.name}${isSelected ? ' (выбран)' : ''}`}
          >
            {isSelected && (
              <Check
                className={`absolute inset-0 m-auto w-4 h-4 ${
                  isLight ? 'text-gray-dark' : 'text-white'
                }`}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
