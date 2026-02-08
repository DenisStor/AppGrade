import { useParams, Link } from 'react-router-dom'
import { Package } from 'lucide-react'
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

  const { data, loading, error } = useCatalogQuery(
    () => catalogApi.getCategoryBrands(category),
    [category]
  )

  const categoryData = data?.category
  const brands = data?.brands || []

  usePageTitle(categoryData ? `${categoryData.name} — купить в APPGRADE` : null)

  if (error) {
    return (
      <div className="section-padding py-20 text-center">
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
      <div className="section-padding py-20 text-center">
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
    <div className="section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
          {categoryData?.name || '...'}
        </h1>
        {categoryData?.description && (
          <p className="text-gray-medium mt-2">{categoryData.description}</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
          ))}
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} category={category} />
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
      className="group flex flex-col bg-white rounded-card border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
