import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { AboutUs } from '../../components/AboutUs/AboutUs'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="section-padding pt-10 lg:pt-16">
          <Breadcrumbs
            items={[{ label: 'О компании' }]}
            className="mb-8"
          />
        </section>
        <AboutUs showDivider={false} />
      </main>
      <Footer />
    </div>
  )
}
