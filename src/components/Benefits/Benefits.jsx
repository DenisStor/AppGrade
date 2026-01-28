import { Container } from '../ui/Container'
import { BenefitCard } from './BenefitCard'
import { benefits } from '../../data/benefits'

export function Benefits() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-4 lg:mx-8 border-t border-gray-300 mb-8" />
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} {...benefit} />
          ))}
        </div>
      </Container>
    </section>
  )
}
