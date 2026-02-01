import { RangeSlider } from '../ui/RangeSlider'
import { ColorFilter } from './ColorFilter'
import { CheckboxFilter } from './CheckboxFilter'
import { formatMemory } from '../../data/products'

export function FilterSidebar({
  filters,
  availableColors = [],
  availableMemory = [],
  availableBrands = [],
  priceRange = [0, 500000],
  onFilterChange,
  onReset,
  className = '',
}) {
  const hasActiveFilters =
    filters.colors.length > 0 ||
    filters.memory.length > 0 ||
    filters.brands.length > 0 ||
    filters.inStock ||
    filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1]

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Бренд */}
      {availableBrands.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-dark mb-4">Бренд</h3>
          <CheckboxFilter
            options={availableBrands.map((b) => ({
              value: b,
              label: b,
            }))}
            selected={filters.brands}
            onChange={(brands) => onFilterChange('brands', brands)}
          />
        </div>
      )}

      {/* Цена */}
      <div>
        <h3 className="text-sm font-semibold text-gray-dark mb-4">Цена, ₽</h3>
        <RangeSlider
          min={priceRange[0]}
          max={priceRange[1]}
          step={1000}
          value={filters.priceRange}
          onChange={(value) => onFilterChange('priceRange', value)}
        />
      </div>

      {/* Цвет */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-dark mb-4">Цвет</h3>
          <ColorFilter
            colors={availableColors}
            selected={filters.colors}
            onChange={(colors) => onFilterChange('colors', colors)}
          />
        </div>
      )}

      {/* Память */}
      {availableMemory.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-dark mb-4">Память</h3>
          <CheckboxFilter
            options={availableMemory.map((m) => ({
              value: m,
              label: formatMemory(m),
            }))}
            selected={filters.memory}
            onChange={(memory) => onFilterChange('memory', memory)}
          />
        </div>
      )}

      {/* В наличии */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange('inStock', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-gray-dark peer-checked:bg-gray-dark transition-colors" />
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-dark group-hover:text-gray-medium transition-colors">
            Только в наличии
          </span>
        </label>
      </div>

      {/* Сброс */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full py-2.5 text-sm font-medium text-gray-medium hover:text-gray-dark border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          Сбросить фильтры
        </button>
      )}
    </aside>
  )
}
