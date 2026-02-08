import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { AboutUs } from '../../components/AboutUs/AboutUs'
import { PageLayout } from '../../layouts/PageLayout'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function AboutPage() {
  usePageTitle('О компании — APPGRADE')

  return (
    <PageLayout>
      <section className="section-padding pt-10 lg:pt-16">
        <Breadcrumbs
          items={[{ label: 'О компании' }]}
          className="mb-8"
        />
      </section>
      <AboutUs showDivider={false} />
    </PageLayout>
  )
}
