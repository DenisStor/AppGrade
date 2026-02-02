import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
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
  getMinPrice,
} from '../../data/products'
import { useProductStore } from '../../stores/useProductStore'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { PRICE } from '../../data/constants'

export default function BrandPage() {
  const { category, brand } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const { filters, sortBy, setSortBy, setFilter, resetFilters } = useProductStore()

  const categoryData = getCategoryBySlug(category)
  const brandData = getBrandBySlug(brand)
  const allProducts = getProductsByCategoryAndBrand(category, brand)

  // Синхронизация с URL
  useEffect(() => {
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || []
    const memory = searchParams.get('memory')?.split(',').map(Number).filter(Boolean) || []
    const priceMin = Number(searchParams.get('priceMin')) || 0
    const priceMax = Number(searchParams.get('priceMax')) || PRICE.MAX
    const inStock = searchParams.get('inStock') === 'true'
    const sort = searchParams.get('sort') || 'popular'

    setFilter('colors', colors)
    setFilter('memory', memory)
    setFilter('brands', []) // Бренд уже выбран через URL
    setFilter('priceRange', [priceMin, priceMax])
    setFilter('inStock', inStock)
    setSortBy(sort)
  }, [])

  // Обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.colors.length) params.set('colors', filters.colors.join(','))
    if (filters.memory.length) params.set('memory', filters.memory.join(','))
    if (filters.priceRange[0] > 0) params.set('priceMin', filters.priceRange[0])
    if (filters.priceRange[1] < PRICE.MAX) params.set('priceMax', filters.priceRange[1])
    if (filters.inStock) params.set('inStock', 'true')
    if (sortBy !== 'popular') params.set('sort', sortBy)

    setSearchParams(params, { replace: true })
  }, [filters, sortBy, setSearchParams])

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Фильтр по цене
    result = result.filter((product) => {
      const minPrice = getMinPrice(product)
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
    })

    // Фильтр по цвету
    if (filters.colors.length) {
      result = result.filter((product) =>
        product.variants.some((v) => filters.colors.includes(v.color.id))
      )
    }

    // Фильтр по памяти
    if (filters.memory.length) {
      result = result.filter((product) =>
        product.variants.some((v) => filters.memory.includes(v.memory))
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
          const aNew = a.badges?.includes('new') ? 1 : 0
          const bNew = b.badges?.includes('new') ? 1 : 0
          return bNew - aNew
        })
        break
      default:
        break
    }

    return result
  }, [allProducts, filters, sortBy])

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

  // SEO
  useEffect(() => {
    if (categoryData && brandData) {
      document.title = `${brandData.name} ${categoryData.name} — купить в APPGRADE`
    }
  }, [categoryData, brandData])

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
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1
              ? 'товар'
              : filteredProducts.length < 5
              ? 'товара'
              : 'товаров'}
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
