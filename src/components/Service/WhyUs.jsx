import { Zap, Shield, Smartphone } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeader } from '../ui/SectionHeader'
import { WHY_US } from '../../data/service'

const iconMap = {
  Zap,
  Shield,
  Smartphone,
}

export function WhyUs() {
  return (
    <section className="py-12 lg:py-20 bg-gray-light">
      <Container>
        <SectionHeader
          title="Почему мы?"
          subtitle="Преимущества нашего сервиса"
          className="mb-10"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {WHY_US.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <article
                key={item.id}
                className="bg-white p-8 text-center rounded-card transition-all hover:shadow-lg"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-dark flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-dark mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-medium">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
