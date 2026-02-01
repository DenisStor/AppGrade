import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'

export default function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 px-6 lg:px-60 py-14 md:py-20">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-4">
          Каталог
        </h1>
        <p className="text-gray-medium">
          Страница в разработке
        </p>
      </main>
      <Footer />
    </div>
  )
}
