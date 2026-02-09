import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import serviceImg from '../../assets/mobile-service.jpg'

export function MobileService() {
  const scrollToForm = () => {
    document.getElementById('repair-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-12 lg:py-20 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="lg:self-stretch lg:flex lg:flex-col">
            <span className="inline-block px-4 py-1.5 bg-gray-dark text-white text-sm font-medium rounded-full mb-6 lg:self-start">
              Выездной сервис
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-6">
              Сервис на выезд
            </h2>
            <p className="text-lg text-gray-medium mb-4">
              Поход в сервис отнимает немало времени. Не отвлекайтесь от важных дел.
            </p>
            <p className="text-lg text-gray-medium lg:mb-8">
              Наш мастер приедет к вам домой или в офис в удобное время.
              Диагностика и большинство ремонтов выполняются на месте —
              вам не придётся никуда ехать и ждать в очереди.
            </p>
            <Button onClick={scrollToForm} className="hidden lg:inline-flex gap-2 group transition-transform duration-300 hover:scale-105 lg:mt-auto lg:self-start">
              Заказать выезд
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl">
              <ImageWithSkeleton
                src={serviceImg}
                alt="Выездной ремонт"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Кнопка под фото на мобилках */}
          <Button onClick={scrollToForm} className="lg:hidden gap-2 w-full justify-center group transition-transform duration-300 hover:scale-105">
            Заказать выезд
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </Container>
    </section>
  )
}
