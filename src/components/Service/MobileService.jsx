import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import serviceImg from '../../assets/mobile-service.jpg'

export function MobileService() {
  return (
    <section className="py-12 lg:py-20 bg-gray-light">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gray-dark text-white text-sm font-medium mb-6">
              Выездной сервис
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-6">
              Сервис на выезд
            </h2>
            <p className="text-lg text-gray-medium mb-4">
              Поход в сервис отнимает немало времени. Не отвлекайтесь от важных дел.
            </p>
            <p className="text-lg text-gray-medium mb-8">
              Наш мастер приедет к вам домой или в офис в удобное время.
              Диагностика и большинство ремонтов выполняются на месте —
              вам не придётся никуда ехать и ждать в очереди.
            </p>
            <Button className="gap-2">
              Заказать выезд
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={serviceImg}
                alt="Выездной ремонт"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
