import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { BottomNav } from '../components/BottomNav'

export default function CatalogLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
