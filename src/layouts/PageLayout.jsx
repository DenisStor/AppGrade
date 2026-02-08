import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

export function PageLayout({ children, className = "flex-1" }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className={className}>{children}</main>
      <Footer />
    </div>
  )
}
