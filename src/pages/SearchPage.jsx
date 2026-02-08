import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Skeleton } from '../components/ui/Skeleton'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { catalogApi } from '../services/catalogApi'
import { useCatalogQuery } from '../hooks/useCatalogQuery'
import { mapProducts } from '../services/productMapper'
import { formatProductCount } from '../utils/pluralize'
import { usePageTitle } from '../hooks/usePageTitle'
import { PageLayout } from '../layouts/PageLayout'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: rawResults, loading, error } = useCatalogQuery(
    query ? () => catalogApi.search(query) : null,
    [query]
  )

  const results = useMemo(() => mapProducts(rawResults), [rawResults])

  usePageTitle(query ? `Поиск: ${query} — APPGRADE` : 'Поиск товаров — APPGRADE')

  const breadcrumbs = [{ label: 'Поиск' }]

  return (
    <PageLayout className="flex-1 section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
          {query ? `Результаты поиска: «${query}»` : 'Поиск товаров'}
        </h1>
        {query && !loading && (
          <p className="text-gray-medium mt-2">
            Найдено {formatProductCount(results.length)}
          </p>
        )}
      </div>

      {error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-2">Ошибка загрузки результатов</p>
          <p className="text-gray-medium text-sm">{error}</p>
        </div>
      ) : !query ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-gray-medium">Введите запрос в строке поиска</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-gray-dark text-lg mb-2">Ничего не найдено</p>
          <p className="text-gray-medium mb-6">
            Попробуйте изменить запрос или посмотрите наш каталог
          </p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-3 bg-gray-dark text-white rounded-lg hover:bg-gray-dark/90 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      )}
    </PageLayout>
  )
}
