import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'new', label: 'Сначала новинки' },
]

export function SortDropdown({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentOption = sortOptions.find((o) => o.value === value) || sortOptions[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <span className="text-sm text-gray-dark">{currentOption.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-medium transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-fade-in">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span
                className={
                  option.value === value ? 'text-gray-dark font-medium' : 'text-gray-medium'
                }
              >
                {option.label}
              </span>
              {option.value === value && (
                <Check className="w-4 h-4 text-gray-dark" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
