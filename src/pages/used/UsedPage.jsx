import { useState, useEffect, useMemo, useCallback } from 'react'
import { SlidersHorizontal, Shield, Clock, CheckCircle } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Drawer } from '../../components/ui/Drawer'
import { SortDropdown } from '../../components/catalog/SortDropdown'
import { UsedFilterSidebar } from '../../components/filters/UsedFilterSidebar'
import { ProductListCard } from '../../components/catalog/ProductListCard'
import {
  usedProducts,
  getMinPrice,
  getBrandSlug,
} from '../../data/products'
import { useMatchMedia } from '../../hooks/useMatchMedia'
import {
  useFilterSync,
  parseUsedPageUrl,
  buildUsedPageUrl,
  USED_PAGE_INITIAL_FILTERS,
} from '../../hooks/useFilterSync'
import { PRICE } from '../../data/constants'
import { formatProductCount } from '../../utils/pluralize'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'

export default function UsedPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isDesktop = useMatchMedia('(min-width: 1024px)')

  const buildUrl = useCallback(buildUsedPageUrl, [])
  const { filters, sortBy, setSortBy, setFilter, resetFilters } = useFilterSync(
    USED_PAGE_INITIAL_FILTERS,
    parseUsedPageUrl,
    buildUrl
  )

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    let result = [...usedProducts]

    // Фильтр по цене
    result = result.filter((product) => {
      const minPrice = getMinPrice(product)
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
    })

    // Фильтр по категории
    if (filters.categories.length) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      )
    }

    // Фильтр по состоянию
    if (filters.conditions.length) {
      result = result.filter((product) =>
        filters.conditions.includes(product.condition)
      )
    }

    // Фильтр по наличию
    if (filters.inStock) {
      result = result.filter((product) =>
        product.variants.some((v) => v.inStock)
      )
    }

    // Сортировка
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => getMinPrice(a) - getMinPrice(b))
        break
      case 'price-desc':
        result.sort((a, b) => getMinPrice(b) - getMinPrice(a))
        break
      case 'new':
        result.sort((a, b) => {
          // Сначала идеальное, потом отличное, потом хорошее
          const order = { perfect: 0, excellent: 1, good: 2 }
          return (order[a.condition] || 3) - (order[b.condition] || 3)
        })
        break
      default:
        break
    }

    return result
  }, [filters, sortBy])

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

  // SEO
  useEffect(() => {
    document.title = 'Проверенное б/у — купить в APPGRADE'
  }, [])

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
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="section-padding py-6 lg:py-10">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Hero секция */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 lg:p-8 mb-8">
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
              <UsedFilterSidebar
                filters={filters}
                availableCategories={availableCategories}
                priceRange={priceRange}
                onFilterChange={setFilter}
                onReset={resetFilters}
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
      </main>
      <Footer />
    </>
  )
}
