import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { BottomNav } from '../components/BottomNav'

export function PageLayout({ children, className = "flex-1" }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className={`pb-20 lg:pb-0 ${className}`}>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  )
}
