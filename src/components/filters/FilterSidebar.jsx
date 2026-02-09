import { useState, useMemo, useCallback } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { RangeSlider } from '../ui/RangeSlider'
import { CheckboxFilter } from './CheckboxFilter'
import { formatMemory } from '../../utils/product'
import { PRICE } from '../../data/constants'

function FilterSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="py-5 first:pt-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-gray-medium">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-medium transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className="filter-collapse" data-open={isOpen}>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  )
}

export function FilterSidebar({
  filters,
  availableMemory = [],
  availableBrands = [],
  priceRange = [0, PRICE.MAX],
  onFilterChange,
  onReset,
  hideBrandFilter = false,
  className = '',
}) {
  const hasActiveFilters = useMemo(() =>
    filters.memory.length > 0 ||
    filters.brands.length > 0 ||
    filters.inStock ||
    filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1]
  , [filters, priceRange])

  const handleToggleInStock = useCallback(() => {
    onFilterChange('inStock', !filters.inStock)
  }, [filters.inStock, onFilterChange])

  return (
    <aside className={`divide-y divide-gray-200/60 ${className}`}>
      {/* Бренд */}
      {!hideBrandFilter && availableBrands.length > 1 && (
        <FilterSection title="Бренд">
          <CheckboxFilter
            options={availableBrands.map((b) => ({
              value: b,
              label: b,
            }))}
            selected={filters.brands}
            onChange={(brands) => onFilterChange('brands', brands)}
          />
        </FilterSection>
      )}

      {/* Цена */}
      <FilterSection title="Цена, ₽">
        <RangeSlider
          min={priceRange[0]}
          max={priceRange[1]}
          step={1000}
          value={filters.priceRange}
          onChange={(value) => onFilterChange('priceRange', value)}
        />
      </FilterSection>

      {/* Память */}
      {availableMemory.length > 0 && (
        <FilterSection title="Память">
          <CheckboxFilter
            options={availableMemory.map((m) => ({
              value: m,
              label: formatMemory(m),
            }))}
            selected={filters.memory}
            onChange={(memory) => onFilterChange('memory', memory)}
          />
        </FilterSection>
      )}

      {/* В наличии — toggle switch */}
      <div className="py-5">
        <button
          type="button"
          onClick={handleToggleInStock}
          className="w-full flex items-center justify-between cursor-pointer group"
        >
          <span className="text-[13px] font-bold uppercase tracking-wide text-gray-medium">
            В наличии
          </span>
          <div
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              filters.inStock ? 'bg-gray-dark' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                filters.inStock ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Сброс */}
      {hasActiveFilters && (
        <div className="py-5 animate-scale-in">
          <button
            onClick={onReset}
            className="w-full py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Сбросить фильтры
          </button>
        </div>
      )}
    </aside>
  )
}
