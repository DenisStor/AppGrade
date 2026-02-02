import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

export default function InfoLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-dark mb-4">{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
