import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, Search, X } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Skeleton } from '../../components/ui/Skeleton'
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton'
import { catalogApi } from '../../services/catalogApi'
import { useCatalogQuery } from '../../hooks/useCatalogQuery'
import { formatPrice } from '../../utils/product'
import { formatProductCount } from '../../utils/pluralize'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function CategoryPage() {
  const { category } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, loading, error } = useCatalogQuery(
    () => catalogApi.getCategoryBrands(category),
    [category]
  )

  const categoryData = data?.category
  const brands = data?.brands || []

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands
    const q = searchQuery.toLowerCase()
    return brands.filter(b => (b.display_name || b.name).toLowerCase().includes(q))
  }, [brands, searchQuery])

  usePageTitle(categoryData ? `${categoryData.name} — купить в APPGRADE` : null)

  if (error) {
    return (
      <div className="catalog-padding py-20 text-center">
        <p className="text-red-500 text-lg mb-2">Ошибка загрузки категории</p>
        <p className="text-gray-medium text-sm mb-4">{error}</p>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  if (!loading && !categoryData) {
    return (
      <div className="catalog-padding py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-dark mb-4">Категория не найдена</h1>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: categoryData?.name || '...' },
  ]

  return (
    <div className="catalog-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
            {categoryData?.name || '...'}
          </h1>
          {categoryData?.description && (
            <p className="text-gray-medium mt-2">{categoryData.description}</p>
          )}
        </div>
        <div className="relative hidden lg:block">
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
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-7">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
          ))}
        </div>
      ) : filteredBrands.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-7">
          {filteredBrands.map((brand, index) => (
            <div key={brand.id} className="animate-card-appear h-full"
                 style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}>
              <BrandCard brand={brand} category={category} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-medium">В этой категории пока нет товаров</p>
        </div>
      )}
    </div>
  )
}

function BrandCard({ brand, category }) {
  const displayName = brand.display_name || brand.name

  return (
    <Link
      to={`/catalog/${category}/${brand.slug}`}
      className="group flex flex-col h-full bg-white rounded-card border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="bg-gray-light aspect-[3/4] flex items-center justify-center p-6">
        {brand.flagshipImage ? (
          <ImageWithSkeleton
            src={brand.flagshipImage}
            alt={displayName}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package className="w-12 h-12 text-gray-300" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-dark tracking-tight">{displayName}</h3>
        <p className="text-sm text-gray-medium mt-1">
          {formatProductCount(brand.productCount)}
        </p>
        {brand.minPrice > 0 && (
          <p className="text-base font-semibold text-gray-dark mt-2">от {formatPrice(brand.minPrice)}</p>
        )}
      </div>
    </Link>
  )
}
