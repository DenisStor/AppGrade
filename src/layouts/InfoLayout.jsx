import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { BottomNav } from '../components/BottomNav'

export default function InfoLayout({ title, children, hasContent }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      {hasContent ? (
        <main className="flex-1 py-12 lg:py-20 px-6 pb-20 lg:pb-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-dark mb-8 break-words">{title}</h1>
            {children}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center py-20 pb-24 lg:pb-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-dark mb-4">{title}</h1>
            {children}
          </div>
        </main>
      )}
      <Footer />
      <BottomNav />
    </div>
  )
}
