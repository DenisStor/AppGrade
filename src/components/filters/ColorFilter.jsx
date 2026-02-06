import { useCallback } from 'react'
import { ColorSwatch } from '../ui/ColorSwatch'

export function ColorFilter({ colors = [], selected = [], onChange }) {
  const toggleColor = useCallback((colorId) => {
    const updated = selected.includes(colorId)
      ? selected.filter((c) => c !== colorId)
      : [...selected, colorId]
    onChange(updated)
  }, [selected, onChange])

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <ColorSwatch
          key={color.id}
          color={color}
          selected={selected.includes(color.id)}
          size="md"
          onClick={() => toggleColor(color.id)}
        />
      ))}
    </div>
  )
}
