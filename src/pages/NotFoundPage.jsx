import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { PageLayout } from '../layouts/PageLayout'

export default function NotFoundPage() {
  usePageTitle('Страница не найдена — APPGRADE')

  return (
    <PageLayout className="flex-1 flex items-center justify-center">
      <div className="text-center section-padding py-20">
        <h1 className="text-6xl lg:text-8xl font-bold text-gray-dark mb-4">404</h1>
        <p className="text-xl text-gray-medium mb-8">Страница не найдена</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gray-dark text-white rounded-lg hover:bg-black transition-colors font-medium"
        >
          На главную
        </Link>
      </div>
    </PageLayout>
  )
}
