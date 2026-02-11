import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Skeleton } from '../../components/ui/Skeleton'
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton'
import { catalogApi } from '../../services/catalogApi'
import { useCatalogQuery } from '../../hooks/useCatalogQuery'
import { mapCategory } from '../../services/productMapper'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function CatalogPage() {
  usePageTitle('Каталог — APPGRADE')

  const { data: rawCategories, loading, error } = useCatalogQuery(() => catalogApi.getCategories())

  const categories = (rawCategories || []).map(mapCategory)

  const breadcrumbs = [{ label: 'Каталог' }]

  return (
    <div className="section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-8">
        Каталог
      </h1>

      {error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">Ошибка загрузки каталога</p>
          <p className="text-gray-medium text-sm">{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} to={category.href} className="group animate-card-appear"
                  style={{ animationDelay: `${Math.min(index * 80, 600)}ms` }}>
              <div className="h-full overflow-hidden rounded-2xl lg:rounded-3xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="bg-[#f5f5f7] aspect-[4/3] flex items-center justify-center">
                  {category.image && (
                    <ImageWithSkeleton
                      src={category.image}
                      alt={category.name}
                      className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${category.slug === 'watches' ? 'scale-110 group-hover:scale-[1.15]' : ''}`}
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      widths={[400, 800]}
                    />
                  )}
                </div>
                <div className="p-3 lg:p-4 border-t border-gray-100">
                  <h2 className="text-sm lg:text-lg font-bold text-gray-dark mb-0.5">
                    {category.name}
                  </h2>
                  <p className="text-gray-medium text-xs lg:text-sm flex items-center justify-between">
                    <span>{category.description}</span>
                    <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
