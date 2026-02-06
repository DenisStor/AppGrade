import { useState, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Drawer } from '../../components/ui/Drawer'
import { ProductGrid } from '../../components/catalog/ProductGrid'
import { SortDropdown } from '../../components/catalog/SortDropdown'
import { FilterSidebar } from '../../components/filters/FilterSidebar'
import { ActiveFilters } from '../../components/filters/ActiveFilters'
import {
  getProductsByCategoryAndBrand,
  getCategoryBySlug,
  getBrandBySlug,
} from '../../data/products'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import {
  useFilterSync,
  parseBrandPageUrl,
  buildBrandPageUrl,
  BRAND_PAGE_INITIAL_FILTERS,
} from '../../hooks/useFilterSync'
import { PRICE } from '../../data/constants'
import { formatProductCount } from '../../utils/pluralize'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useProductFiltering } from '../../hooks/useProductFiltering'

// Фильтры специфичные для страницы бренда
const brandExtraFilters = (result, filters) => {
  if (filters.colors.length) {
    result = result.filter((p) =>
      p.variants.some((v) => filters.colors.includes(v.color.id))
    )
  }
  if (filters.memory.length) {
    result = result.filter((p) =>
      p.variants.some((v) => filters.memory.includes(v.memory))
    )
  }
  return result
}

const brandSortNew = (a, b) => {
  const aNew = a.badges?.includes('new') ? 1 : 0
  const bNew = b.badges?.includes('new') ? 1 : 0
  return bNew - aNew
}

const BRAND_FILTERING_OPTIONS = {
  extraFilters: brandExtraFilters,
  sortNew: brandSortNew,
}

export default function BrandPage() {
  const { category, brand } = useParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isDesktop = useMatchMedia('(min-width: 1024px)')

  const buildUrl = useCallback(buildBrandPageUrl, [])
  const { filters, sortBy, setSortBy, setFilter, resetFilters } = useFilterSync(
    BRAND_PAGE_INITIAL_FILTERS,
    parseBrandPageUrl,
    buildUrl
  )

  const categoryData = getCategoryBySlug(category)
  const brandData = getBrandBySlug(brand)
  const allProducts = getProductsByCategoryAndBrand(category, brand)

  const filteredProducts = useProductFiltering(allProducts, filters, sortBy, BRAND_FILTERING_OPTIONS)

  // Доступные опции для фильтров
  const availableColors = useMemo(() => {
    const colorMap = new Map()
    allProducts.forEach((p) => {
      p.variants.forEach((v) => {
        if (!colorMap.has(v.color.id)) {
          colorMap.set(v.color.id, v.color)
        }
      })
    })
    return Array.from(colorMap.values())
  }, [allProducts])

  const availableMemory = useMemo(() => {
    const memorySet = new Set()
    allProducts.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.memory !== null && v.memory !== undefined) {
          memorySet.add(v.memory)
        }
      })
    })
    return Array.from(memorySet).sort((a, b) => a - b)
  }, [allProducts])

  const priceRange = useMemo(() => {
    if (!allProducts.length) return [0, PRICE.MAX]
    const prices = allProducts.map(getMinPrice)
    return [Math.min(...prices), Math.max(...prices)]
  }, [allProducts])

  const activeFiltersCount =
    filters.colors.length +
    filters.memory.length +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1] ? 1 : 0)

  usePageTitle(
    categoryData && brandData
      ? `${brandData.name} ${categoryData.name} — купить в APPGRADE`
      : null
  )

  if (!categoryData || !brandData) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-dark mb-4">
          {!categoryData ? 'Категория не найдена' : 'Бренд не найден'}
        </h1>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: categoryData.name, href: `/catalog/${category}` },
    { label: brandData.name },
  ]

  return (
    <div className="section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
            {brandData.name} {categoryData.name}
          </h1>
          <p className="text-gray-medium mt-1">
            {formatProductCount(filteredProducts.length)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isDesktop && (
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Фильтры</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-gray-dark text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <ActiveFilters
        filters={filters}
        availableColors={availableColors}
        availableMemory={availableMemory}
        onRemoveColor={(colorId) =>
          setFilter('colors', filters.colors.filter((c) => c !== colorId))
        }
        onRemoveMemory={(memory) =>
          setFilter('memory', filters.memory.filter((m) => m !== memory))
        }
        onRemoveBrand={() => {}} // Не используется — бренд в URL
        onResetPrice={() => setFilter('priceRange', [priceRange[0], priceRange[1]])}
        onResetStock={() => setFilter('inStock', false)}
        onResetAll={resetFilters}
        className="mb-6"
      />

      <div className="flex gap-8">
        {isDesktop && (
          <aside className="w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              availableBrands={[]} // Бренд уже выбран
              availableColors={availableColors}
              availableMemory={availableMemory}
              priceRange={priceRange}
              onFilterChange={setFilter}
              onReset={resetFilters}
              hideBrandFilter
            />
          </aside>
        )}

        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} category={category} brand={brand} />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-medium mb-4">Товары не найдены</p>
              <button
                onClick={resetFilters}
                className="text-blue-500 hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {!isDesktop && (
        <Drawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Фильтры"
          side="left"
        >
          <FilterSidebar
            filters={filters}
            availableBrands={[]}
            availableColors={availableColors}
            availableMemory={availableMemory}
            priceRange={priceRange}
            onFilterChange={setFilter}
            onReset={resetFilters}
            hideBrandFilter
          />
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-3 bg-gray-dark text-white rounded-lg font-medium hover:bg-gray-dark/90 transition-colors"
            >
              Показать {filteredProducts.length} товаров
            </button>
          </div>
        </Drawer>
      )}
    </div>
  )
}
