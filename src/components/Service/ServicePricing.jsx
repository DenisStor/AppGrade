import { Check } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeader } from '../ui/SectionHeader'
import { SERVICE_PRICING } from '../../data/service'

export function ServicePricing() {
  return (
    <section className="py-12 lg:py-20 bg-gray-light">
      <Container>
        <SectionHeader
          title="Прайс-лист"
          subtitle="Популярные услуги ремонта iPhone"
          className="mb-10"
        />
        <div className="bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {SERVICE_PRICING.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-dark">
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <span className="text-gray-medium text-sm hidden sm:block">
                    {service.time}
                  </span>
                  <span className="font-bold text-gray-dark min-w-[100px]">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-gray-medium mt-6 text-sm">
          * Диагностика бесплатная и ни к чему не обязывает. Точную стоимость озвучим после осмотра устройства.
        </p>
      </Container>
    </section>
  )
}
