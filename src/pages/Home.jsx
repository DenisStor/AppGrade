import { Header } from '../components/Header/Header'
import { Hero } from '../components/Hero/Hero'
import { ProductCards } from '../components/ProductCard/ProductCards'
import { Categories } from '../components/Categories/Categories'
import { News } from '../components/News/News'
import { InfoBlocks } from '../components/InfoBlocks/InfoBlock'
import { ContactSection } from '../components/ContactSection/ContactSection'
import { Footer } from '../components/Footer/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimatedSection>
          <Categories />
        </AnimatedSection>
        <AnimatedSection delay={100}>
          <ProductCards />
        </AnimatedSection>
        <AnimatedSection delay={150}>
          <News />
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <InfoBlocks />
        </AnimatedSection>
        <AnimatedSection delay={250}>
          <ContactSection />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}
