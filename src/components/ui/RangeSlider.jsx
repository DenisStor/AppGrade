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
  const debounceRef = useRef(null)

  useEffect(() => {
    const clampedMin = Math.max(min, Math.min(value[0], max))
    const clampedMax = Math.max(min, Math.min(value[1], max))
    if (clampedMin !== localValue[0] || clampedMax !== localValue[1]) {
      setLocalValue([clampedMin, clampedMax])
    }
  }, [value[0], value[1], min, max])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const debouncedOnChange = useCallback((newValue) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onChange?.(newValue)
    }, 100)
  }, [onChange])

  const handleMinChange = useCallback(
    (e) => {
      const newMin = Math.min(Number(e.target.value), localValue[1] - step)
      const newValue = [newMin, localValue[1]]
      setLocalValue(newValue)
      debouncedOnChange(newValue)
    },
    [localValue[1], step, debouncedOnChange]
  )

  const handleMaxChange = useCallback(
    (e) => {
      const newMax = Math.max(Number(e.target.value), localValue[0] + step)
      const newValue = [localValue[0], newMax]
      setLocalValue(newValue)
      debouncedOnChange(newValue)
    },
    [localValue[0], step, debouncedOnChange]
  )

  const handleMinInputChange = useCallback(
    (e) => {
      const inputValue = e.target.value.replace(/\D/g, '')
      const newMin = Math.max(min, Math.min(Number(inputValue) || min, localValue[1] - step))
      const newValue = [newMin, localValue[1]]
      setLocalValue(newValue)
      debouncedOnChange(newValue)
    },
    [min, localValue[1], step, debouncedOnChange]
  )

  const handleMaxInputChange = useCallback(
    (e) => {
      const inputValue = e.target.value.replace(/\D/g, '')
      const newMax = Math.min(max, Math.max(Number(inputValue) || max, localValue[0] + step))
      const newValue = [localValue[0], newMax]
      setLocalValue(newValue)
      debouncedOnChange(newValue)
    },
    [max, localValue[0], step, debouncedOnChange]
  )

  const clampedMinValue = Math.max(min, Math.min(localValue[0], max))
  const clampedMaxValue = Math.max(min, Math.min(localValue[1], max))
  const minPercent = ((clampedMinValue - min) / (max - min)) * 100
  const maxPercent = ((clampedMaxValue - min) / (max - min)) * 100

  return (
    <div className={className}>
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-medium mb-1 block">От</label>
          <input
            type="text"
            value={formatValue(localValue[0])}
            onChange={handleMinInputChange}
            className="w-full px-3 py-2.5 text-sm bg-gray-light/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-dark/20 focus:border-gray-400 transition-all"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-medium mb-1 block">До</label>
          <input
            type="text"
            value={formatValue(localValue[1])}
            onChange={handleMaxInputChange}
            className="w-full px-3 py-2.5 text-sm bg-gray-light/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-dark/20 focus:border-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="relative h-6" ref={trackRef}>
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full" />

        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 bg-gray-dark rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="range-slider-thumb absolute top-0 left-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="range-slider-thumb absolute top-0 left-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
        />
      </div>
    </div>
  )
}
