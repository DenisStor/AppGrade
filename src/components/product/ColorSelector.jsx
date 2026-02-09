import { ColorSwatch } from '../ui/ColorSwatch'

export function ColorSelector({
  label = 'Цвет',
  colors = [],
  selected,
  onChange,
  variants = [],
  className = '',
}) {
  const getColorAvailability = (colorId) => {
    const colorVariants = variants.filter((v) =>
      (v.attributes?.color?.id || v.color?.id) === colorId
    )
    return colorVariants.some((v) => v.inStock)
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-dark">{label}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isAvailable = getColorAvailability(color.id)
          return (
            <ColorSwatch
              key={color.id}
              color={color}
              selected={color.id === selected}
              size="lg"
              disabled={!isAvailable}
              disabledStrike
              onClick={() => onChange(color.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
