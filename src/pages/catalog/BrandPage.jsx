import { useState, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Skeleton } from '../../components/ui/Skeleton'
import { ProductGrid } from '../../components/catalog/ProductGrid'
import { SortDropdown } from '../../components/catalog/SortDropdown'
import { FilterSidebar } from '../../components/filters/FilterSidebar'
import { ActiveFilters } from '../../components/filters/ActiveFilters'
import { MobileFilterButton } from '../../components/filters/MobileFilterButton'
import { FilterDrawer } from '../../components/filters/FilterDrawer'
import { EmptyFilterResults } from '../../components/filters/EmptyFilterResults'
import { catalogApi } from '../../services/catalogApi'
import { useCatalogQuery } from '../../hooks/useCatalogQuery'
import { mapProducts } from '../../services/productMapper'
import { getMinPrice, getAvailableColorsFromProducts, getAvailableMemoryFromProducts } from '../../utils/product'
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

  const { data: rawProducts, loading, error } = useCatalogQuery(
    () => catalogApi.getProducts({ category, brand }),
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

  const availableColors = useMemo(() => getAvailableColorsFromProducts(allProducts), [allProducts])
  const availableMemory = useMemo(() => getAvailableMemoryFromProducts(allProducts), [allProducts])

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
    allProducts.length
      ? `${brandName} ${categoryName} — купить в APPGRADE`
      : null
  )

  if (error) {
    return (
      <div className="section-padding py-20 text-center">
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
      <div className="section-padding py-20 text-center">
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
    <div className="section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
            {brandName} {categoryName}
          </h1>
          <p className="text-gray-medium mt-1">
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
        onRemoveBrand={() => {}}
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
              availableBrands={[]}
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
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} category={category} brand={brand} />
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
        </FilterDrawer>
      )}
    </div>
  )
}
