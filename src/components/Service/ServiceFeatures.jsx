import { Container } from '../ui/Container'
import { SERVICE_FEATURES } from '../../data/service'

export function ServiceFeatures() {
  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICE_FEATURES.map((feature) => (
            <article
              key={feature.id}
              className="group bg-white border border-gray-100 shadow-sm overflow-hidden rounded-card transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-medium">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
