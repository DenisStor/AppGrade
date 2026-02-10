import { useState, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { ProductGrid, ProductGridSkeleton } from '../../components/catalog/ProductGrid'
import { SortDropdown } from '../../components/catalog/SortDropdown'
import { FilterSidebar } from '../../components/filters/FilterSidebar'
import { ActiveFilters } from '../../components/filters/ActiveFilters'
import { MobileFilterButton } from '../../components/filters/MobileFilterButton'
import { FilterDrawer } from '../../components/filters/FilterDrawer'
import { EmptyFilterResults } from '../../components/filters/EmptyFilterResults'
import { catalogApi } from '../../services/catalogApi'
import { useCatalogQuery } from '../../hooks/useCatalogQuery'
import { mapProducts } from '../../services/productMapper'
import { getMinPrice, getAvailableMemoryFromProducts } from '../../utils/product'
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

const brandExtraFilters = (result, filters) => {
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
  const [searchQuery, setSearchQuery] = useState('')
  const isDesktop = useMatchMedia('(min-width: 1024px)')

  const buildUrl = useCallback(buildBrandPageUrl, [])
  const { filters, sortBy, setSortBy, setFilter, resetFilters } = useFilterSync(
    BRAND_PAGE_INITIAL_FILTERS,
    parseBrandPageUrl,
    buildUrl
  )

  const { data: rawProducts, loading, error } = useCatalogQuery(
    () => catalogApi.getProducts({ category, brand, is_used: 0 }),
    [category, brand]
  )

  const { data: categoryBrandsData } = useCatalogQuery(
    () => catalogApi.getCategoryBrands(category),
    [category]
  )

  const allProducts = useMemo(() => mapProducts(rawProducts), [rawProducts])

  const categoryName = rawProducts?.[0]?.category_name
    || categoryBrandsData?.category?.name
    || category
  const brandName = rawProducts?.[0]?.brand_name
    || categoryBrandsData?.brands?.find(b => b.slug === brand)?.name
    || brand

  const filteredProducts = useProductFiltering(allProducts, filters, sortBy, BRAND_FILTERING_OPTIONS)

  const displayProducts = useMemo(() => {
    if (!searchQuery.trim()) return filteredProducts
    const q = searchQuery.toLowerCase()
    return filteredProducts.filter(p => p.name.toLowerCase().includes(q))
  }, [filteredProducts, searchQuery])

  const availableMemory = useMemo(() => getAvailableMemoryFromProducts(allProducts), [allProducts])

  const priceRange = useMemo(() => {
    if (!allProducts.length) return [0, PRICE.MAX]
    const prices = allProducts.map(getMinPrice)
    return [Math.min(...prices), Math.max(...prices)]
  }, [allProducts])

  const activeFiltersCount =
    filters.memory.length +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1] ? 1 : 0)

  usePageTitle(
    allProducts.length
      ? `${brandName} ${categoryName} — купить в APPGRADE`
      : null
  )

  if (error) {
    return (
      <div className="catalog-padding py-20 text-center">
        <p className="text-red-500 text-lg mb-2">Ошибка загрузки товаров</p>
        <p className="text-gray-medium text-sm mb-4">{error}</p>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  if (!loading && !allProducts.length && !rawProducts?.length) {
    return (
      <div className="catalog-padding py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-dark mb-4">Товары не найдены</h1>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: categoryName, href: `/catalog/${category}` },
    { label: brandName },
  ]

  return (
    <div className="catalog-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-6 lg:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
              {brandName} {categoryName}
            </h1>
            <p className="text-gray-medium mt-1">
              {formatProductCount(displayProducts.length)}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-48 pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-medium" />
                </button>
              )}
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {!isDesktop && (
          <div className="flex gap-2 mt-3 lg:hidden">
            <MobileFilterButton
              onClick={() => setIsFilterOpen(true)}
              activeCount={activeFiltersCount}
              className="flex-1"
            />
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              className="flex-1"
            />
          </div>
        )}
      </div>

      <ActiveFilters
        filters={filters}
        availableMemory={availableMemory}
        onRemoveMemory={(memory) =>
          setFilter('memory', filters.memory.filter((m) => m !== memory))
        }
        onRemoveBrand={() => {}}
        onResetPrice={() => setFilter('priceRange', [priceRange[0], priceRange[1]])}
        onResetStock={() => setFilter('inStock', false)}
        onResetAll={resetFilters}
        className="mb-6"
      />

      <div className="flex gap-10">
        {isDesktop && (
          <aside className="w-72 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
            <FilterSidebar
              filters={filters}
              availableBrands={[]}

              availableMemory={availableMemory}
              priceRange={priceRange}
              onFilterChange={setFilter}
              onReset={resetFilters}
              hideBrandFilter
            />
          </aside>
        )}

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : displayProducts.length > 0 ? (
            <ProductGrid products={displayProducts} category={category} brand={brand} />
          ) : (
            <EmptyFilterResults onReset={resetFilters} />
          )}
        </div>
      </div>

      {!isDesktop && (
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filteredCount={displayProducts.length}
        >
          <FilterSidebar
            filters={filters}
            availableBrands={[]}
            availableMemory={availableMemory}
            priceRange={priceRange}
            onFilterChange={setFilter}
            onReset={resetFilters}
            hideBrandFilter
          />
        </FilterDrawer>
      )}
    </div>
  )
}
