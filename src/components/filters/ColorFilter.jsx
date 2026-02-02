import { Check } from 'lucide-react'
import { isLightColor } from '../../utils/color'

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
        const isLight = isLightColor(color.hex)

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
