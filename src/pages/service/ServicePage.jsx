import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { AnimatedSection } from '../../components/ui/AnimatedSection'
import { SectionDivider } from '../../components/ui/SectionDivider'
import { ServiceHero } from '../../components/Service/ServiceHero'
import { ServiceFeatures } from '../../components/Service/ServiceFeatures'
import { LoanerPhone } from '../../components/Service/LoanerPhone'
import { ServicePricing } from '../../components/Service/ServicePricing'
import { ServiceIntro } from '../../components/Service/ServiceIntro'
import { MobileService } from '../../components/Service/MobileService'
import { HowWeWork } from '../../components/Service/HowWeWork'
import { RepairForm } from '../../components/Service/RepairForm'

export default function ServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ServiceHero />
        <AnimatedSection>
          <ServiceIntro />
        </AnimatedSection>
        <SectionDivider />
        <AnimatedSection delay={100}>
          <ServiceFeatures />
        </AnimatedSection>
        <SectionDivider />
        <AnimatedSection delay={150}>
          <LoanerPhone />
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <ServicePricing />
        </AnimatedSection>
        <AnimatedSection>
          <MobileService />
        </AnimatedSection>
        <SectionDivider />
        <AnimatedSection delay={250}>
          <HowWeWork />
        </AnimatedSection>
        <AnimatedSection delay={300}>
          <RepairForm />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}
