import { AnimatedSection } from '../../components/ui/AnimatedSection'
import { SectionDivider } from '../../components/ui/SectionDivider'
import { ServiceHero } from '../../components/Service/ServiceHero'
import { ServiceFeatures } from '../../components/Service/ServiceFeatures'
import { ServicePricing } from '../../components/Service/ServicePricing'
import { ServiceIntro } from '../../components/Service/ServiceIntro'
import { MobileService } from '../../components/Service/MobileService'
import { HowWeWork } from '../../components/Service/HowWeWork'
import { RepairForm } from '../../components/Service/RepairForm'
import { PageLayout } from '../../layouts/PageLayout'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ServicePage() {
  usePageTitle('Сервис и ремонт — APPGRADE')

  return (
    <PageLayout>
      <ServiceHero />
      <AnimatedSection>
        <ServiceIntro />
      </AnimatedSection>
      <SectionDivider />
      <AnimatedSection delay={100}>
        <ServiceFeatures />
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
    </PageLayout>
  )
}
