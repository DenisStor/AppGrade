import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

export default function InfoLayout({ title, children, hasContent }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      {hasContent ? (
        <main className="flex-1 py-12 lg:py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-8">{title}</h1>
            {children}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-dark mb-4">{title}</h1>
            {children}
          </div>
        </main>
      )}
      <Footer />
    </div>
  )
}
