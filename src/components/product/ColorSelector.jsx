import { Check, X } from 'lucide-react'

export function ColorSelector({
  colors = [],
  selected,
  onChange,
  variants = [],
  className = '',
}) {
  const getColorAvailability = (colorId) => {
    const colorVariants = variants.filter((v) => v.color.id === colorId)
    return colorVariants.some((v) => v.inStock)
  }

  const selectedColor = colors.find((c) => c.id === selected)

  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">Цвет</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = color.id === selected
          const isAvailable = getColorAvailability(color.id)
          const isLight =
            color.hex.toLowerCase() === '#ffffff' ||
            color.hex.toLowerCase() === '#f5f5f0' ||
            color.hex.toLowerCase() === '#f0e4d3' ||
            color.hex.toLowerCase() === '#e3e4e5'

          return (
            <button
              key={color.id}
              onClick={() => onChange(color.id)}
              disabled={!isAvailable}
              className={`relative w-10 h-10 rounded-full transition-all ${
                isSelected
                  ? 'ring-2 ring-gray-dark ring-offset-2'
                  : isAvailable
                  ? 'ring-1 ring-gray-200 hover:ring-gray-300'
                  : 'ring-1 ring-gray-200 opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: color.hex }}
              title={`${color.name}${!isAvailable ? ' (нет в наличии)' : ''}`}
              aria-label={`${color.name}${isSelected ? ' (выбран)' : ''}${
                !isAvailable ? ' (нет в наличии)' : ''
              }`}
            >
              {isSelected && (
                <Check
                  className={`absolute inset-0 m-auto w-5 h-5 ${
                    isLight ? 'text-gray-dark' : 'text-white'
                  }`}
                />
              )}
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`block w-full h-0.5 rotate-45 ${
                      isLight ? 'bg-gray-400' : 'bg-white/50'
                    }`}
                  />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
