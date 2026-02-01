import { useState, useEffect, useCallback, useRef } from 'react'

export function RangeSlider({
  min = 0,
  max = 500000,
  step = 1000,
  value = [0, 500000],
  onChange,
  formatValue = (v) => v.toLocaleString('ru-RU'),
  className = '',
}) {
  const [localValue, setLocalValue] = useState(value)
  const trackRef = useRef(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = useCallback(
    (e) => {
      const newMin = Math.min(Number(e.target.value), localValue[1] - step)
      const newValue = [newMin, localValue[1]]
      setLocalValue(newValue)
      onChange?.(newValue)
    },
    [localValue, step, onChange]
  )

  const handleMaxChange = useCallback(
    (e) => {
      const newMax = Math.max(Number(e.target.value), localValue[0] + step)
      const newValue = [localValue[0], newMax]
      setLocalValue(newValue)
      onChange?.(newValue)
    },
    [localValue, step, onChange]
  )

  const handleMinInputChange = useCallback(
    (e) => {
      const inputValue = e.target.value.replace(/\D/g, '')
      const newMin = Math.max(min, Math.min(Number(inputValue) || min, localValue[1] - step))
      const newValue = [newMin, localValue[1]]
      setLocalValue(newValue)
      onChange?.(newValue)
    },
    [min, localValue, step, onChange]
  )

  const handleMaxInputChange = useCallback(
    (e) => {
      const inputValue = e.target.value.replace(/\D/g, '')
      const newMax = Math.min(max, Math.max(Number(inputValue) || max, localValue[0] + step))
      const newValue = [localValue[0], newMax]
      setLocalValue(newValue)
      onChange?.(newValue)
    },
    [max, localValue, step, onChange]
  )

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className={className}>
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-medium mb-1 block">От</label>
          <input
            type="text"
            value={formatValue(localValue[0])}
            onChange={handleMinInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-medium mb-1 block">До</label>
          <input
            type="text"
            value={formatValue(localValue[1])}
            onChange={handleMaxInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>

      <div className="relative h-6 px-2" ref={trackRef}>
        <div className="absolute top-1/2 left-2 right-2 h-1 -translate-y-1/2 bg-gray-200 rounded-full" />

        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 bg-gray-dark rounded-full"
          style={{
            left: `calc(${minPercent}% + 8px)`,
            right: `calc(${100 - maxPercent}% + 8px)`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="range-slider-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="range-slider-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
        />
      </div>
    </div>
  )
}
