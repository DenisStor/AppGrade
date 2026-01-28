import { Header } from '../components/Header/Header'
import { Hero } from '../components/Hero/Hero'
import { ProductCards } from '../components/ProductCard/ProductCards'
import { Categories } from '../components/Categories/Categories'
import { News } from '../components/News/News'
import { InfoBlocks } from '../components/InfoBlocks/InfoBlock'
import { ContactSection } from '../components/ContactSection/ContactSection'
import { Footer } from '../components/Footer/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <ProductCards />
        <News />
        <InfoBlocks />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
