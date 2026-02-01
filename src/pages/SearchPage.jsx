import { useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { searchProducts } from '../data/products'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    return searchProducts(query)
  }, [query])

  useEffect(() => {
    document.title = query
      ? `Поиск: ${query} — APPGRADE`
      : 'Поиск товаров — APPGRADE'
  }, [query])

  const breadcrumbs = [{ label: 'Поиск' }]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 section-padding py-6 lg:py-10">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
            {query ? `Результаты поиска: «${query}»` : 'Поиск товаров'}
          </h1>
          {query && (
            <p className="text-gray-medium mt-2">
              Найдено {results.length}{' '}
              {results.length === 1
                ? 'товар'
                : results.length < 5
                ? 'товара'
                : 'товаров'}
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-gray-medium">
              Введите запрос в строке поиска
            </p>
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
      </main>
      <Footer />
    </div>
  )
}
