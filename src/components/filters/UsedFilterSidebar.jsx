import { useMemo } from 'react'
import { RangeSlider } from '../ui/RangeSlider'
import { CheckboxFilter } from './CheckboxFilter'
import { PRICE } from '../../data/constants'
import { categories, CONDITIONS } from '../../data/products'

export function UsedFilterSidebar({
  filters,
  availableCategories = [],
  priceRange = [0, PRICE.MAX],
  onFilterChange,
  onReset,
  className = '',
}) {
  const hasActiveFilters = useMemo(() =>
    filters.categories.length > 0 ||
    filters.conditions.length > 0 ||
    filters.inStock ||
    filters.priceRange[0] > priceRange[0] ||
    filters.priceRange[1] < priceRange[1]
  , [filters, priceRange])

  // Опции категорий
  const categoryOptions = availableCategories.map((catSlug) => ({
    value: catSlug,
    label: categories[catSlug]?.name || catSlug,
  }))

  // Опции состояний
  const conditionOptions = Object.values(CONDITIONS).map((cond) => ({
    value: cond.id,
    label: cond.label,
  }))

  return (
    <aside className={`space-y-6 ${className}`}>
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

      {/* Категория */}
      {categoryOptions.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-dark mb-4">Категория</h3>
          <CheckboxFilter
            options={categoryOptions}
            selected={filters.categories}
            onChange={(categories) => onFilterChange('categories', categories)}
          />
        </div>
      )}

      {/* Состояние */}
      <div>
        <h3 className="text-sm font-semibold text-gray-dark mb-4">Состояние</h3>
        <CheckboxFilter
          options={conditionOptions}
          selected={filters.conditions}
          onChange={(conditions) => onFilterChange('conditions', conditions)}
        />
      </div>

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
