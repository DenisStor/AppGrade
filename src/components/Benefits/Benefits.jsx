import { Container } from '../ui/Container'
import { SectionDivider } from '../ui/SectionDivider'
import { StaggeredList } from '../ui/StaggeredList'
import { BenefitCard } from './BenefitCard'
import { benefits } from '../../data/benefits'

export function Benefits() {
  return (
    <section className="py-10 md:py-14">
      <SectionDivider className="mb-8" />
      <Container>
        <StaggeredList
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          delay={100}
        >
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} {...benefit} />
          ))}
        </StaggeredList>
      </Container>
    </section>
  )
}
