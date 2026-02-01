import { SectionDivider } from '../ui/SectionDivider'

export function AboutUs() {
  return (
    <section className="pb-14 md:pb-20">
      <SectionDivider className="mb-14 md:mb-20" />
      <div className="section-padding">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-6">
          О нас
        </h2>
        <p className="text-gray-medium text-lg">
          Раздел в разработке
        </p>
      </div>
    </section>
  )
}
