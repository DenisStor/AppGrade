import { Check } from 'lucide-react'
import { isLightColor } from '../../utils/color'

export function ColorSwatch({
  color,
  selected = false,
  size = 'md',
  showCheck = true,
  disabled = false,
  disabledStrike = false,
  onClick,
  className = '',
}) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const checkSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const isLight = isLightColor(color.hex)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${sizes[size]} rounded-full transition-all ${
        selected
          ? 'ring-2 ring-gray-dark ring-offset-2'
          : disabled
          ? 'ring-1 ring-gray-200 opacity-50 cursor-not-allowed'
          : 'ring-1 ring-gray-200 hover:ring-gray-300'
      } ${className}`}
      style={{ backgroundColor: color.hex }}
      title={`${color.name}${disabled ? ' (нет в наличии)' : ''}`}
      aria-label={`${color.name}${selected ? ' (выбран)' : ''}${disabled ? ' (нет в наличии)' : ''}`}
    >
      {selected && showCheck && (
        <Check
          className={`absolute inset-0 m-auto ${checkSizes[size]} ${
            isLight ? 'text-gray-dark' : 'text-white'
          }`}
        />
      )}
      {disabledStrike && disabled && (
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
}
