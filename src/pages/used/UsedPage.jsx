import { useState, useMemo, useCallback } from 'react'
import { Shield, Clock, CheckCircle } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { SortDropdown } from '../../components/catalog/SortDropdown'
import { UsedFilterSidebar } from '../../components/filters/UsedFilterSidebar'
import { MobileFilterButton } from '../../components/filters/MobileFilterButton'
import { FilterDrawer } from '../../components/filters/FilterDrawer'
import { EmptyFilterResults } from '../../components/filters/EmptyFilterResults'
import { ProductListCard } from '../../components/catalog/ProductListCard'
import { usedProducts } from '../../data/products'
import { getBrandSlug, getMinPrice } from '../../utils/product'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import {
  useFilterSync,
  parseUsedPageUrl,
  buildUsedPageUrl,
  USED_PAGE_INITIAL_FILTERS,
} from '../../hooks/useFilterSync'
import { PRICE } from '../../data/constants'
import { formatProductCount } from '../../utils/pluralize'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useProductFiltering } from '../../hooks/useProductFiltering'
import { CONDITION_SORT_ORDER } from '../../data/products/used'
import { PageLayout } from '../../layouts/PageLayout'

// Фильтры специфичные для б/у товаров
const usedExtraFilters = (result, filters) => {
  if (filters.categories.length) {
    result = result.filter((p) => filters.categories.includes(p.category))
  }
  if (filters.conditions.length) {
    result = result.filter((p) => filters.conditions.includes(p.condition))
  }
  return result
}

const usedSortNew = (a, b) =>
  (CONDITION_SORT_ORDER[a.condition] ?? 3) - (CONDITION_SORT_ORDER[b.condition] ?? 3)

const USED_FILTERING_OPTIONS = {
  extraFilters: usedExtraFilters,
  sortNew: usedSortNew,
}

export default function UsedPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isDesktop = useMatchMedia('(min-width: 1024px)')

  const buildUrl = useCallback(buildUsedPageUrl, [])
  const { filters, sortBy, setSortBy, setFilter, resetFilters } = useFilterSync(
    USED_PAGE_INITIAL_FILTERS,
    parseUsedPageUrl,
    buildUrl
  )

  const filteredProducts = useProductFiltering(usedProducts, filters, sortBy, USED_FILTERING_OPTIONS)

  // Доступные категории
  const availableCategories = useMemo(() => {
    const catSet = new Set()
    usedProducts.forEach((p) => catSet.add(p.category))
    return Array.from(catSet)
  }, [])

  // Диапазон цен
  const priceRange = useMemo(() => {
    if (!usedProducts.length) return [0, PRICE.MAX]
    const prices = usedProducts.map(getMinPrice)
    return [Math.min(...prices), Math.max(...prices)]
  }, [])

  const activeFiltersCount =
    filters.categories.length +
    filters.conditions.length +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1] ? 1 : 0)

  usePageTitle('Проверенное б/у — купить в APPGRADE')

  const breadcrumbs = [
    { label: 'Проверенное б/у' },
  ]

  // Формирование URL для ProductListCard
  const getProductUrl = (product) => {
    const brandSlug = getBrandSlug(product.brand) || product.brand?.toLowerCase()
    return {
      category: product.category,
      brand: brandSlug,
    }
  }

  return (
    <PageLayout className="flex-1">
      <div className="section-padding py-6 lg:py-10">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        {/* Hero секция */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 lg:p-8 mb-8 rounded-card">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-3">
            Проверенное б/у
          </h1>
          <p className="text-gray-medium mb-6 max-w-2xl">
            Техника Apple и Samsung с гарантией качества. Каждое устройство проходит
            многоступенчатую проверку и имеет гарантию до 6 месяцев.
          </p>
          <div className="flex flex-wrap gap-4 lg:gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-dark">
              <Shield className="w-5 h-5 text-gray-dark" />
              <span>Гарантия до 6 мес.</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-dark">
              <CheckCircle className="w-5 h-5 text-gray-dark" />
              <span>Проверка качества</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-dark">
              <Clock className="w-5 h-5 text-gray-dark" />
              <span>Возврат 14 дней</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <p className="text-gray-medium">
              {formatProductCount(filteredProducts.length)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isDesktop && (
              <MobileFilterButton
                onClick={() => setIsFilterOpen(true)}
                activeCount={activeFiltersCount}
              />
            )}
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="flex gap-8">
          {isDesktop && (
            <aside className="w-64 flex-shrink-0">
              <UsedFilterSidebar
                filters={filters}
                availableCategories={availableCategories}
                priceRange={priceRange}
                onFilterChange={setFilter}
                onReset={resetFilters}
              />
            </aside>
          )}

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product) => {
                  const { category, brand } = getProductUrl(product)
                  return (
                    <ProductListCard
                      key={product.id}
                      product={product}
                      category={category}
                      brand={brand}
                    />
                  )
                })}
              </div>
            ) : (
              <EmptyFilterResults onReset={resetFilters} />
            )}
          </div>
        </div>

        {!isDesktop && (
          <FilterDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filteredCount={filteredProducts.length}
          >
            <UsedFilterSidebar
              filters={filters}
              availableCategories={availableCategories}
              priceRange={priceRange}
              onFilterChange={setFilter}
              onReset={resetFilters}
            />
          </FilterDrawer>
        )}
      </div>
    </PageLayout>
  )
}
