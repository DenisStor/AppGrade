import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import serviceImg from '../../assets/service-intro.jpg'

export function ServiceIntro() {
  const scrollToPricing = () => {
    document.getElementById('service-pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-12 lg:py-20 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="lg:self-stretch lg:flex lg:flex-col">
            <span className="inline-block px-4 py-1.5 bg-gray-dark text-white text-sm font-medium rounded-full mb-6 lg:self-start">
              Ремонт iPhone
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-6">
              Сервис от 990 ₽
            </h2>
            <p className="text-lg text-gray-medium mb-4">
              Бесплатная диагностика за 30 минут — вы узнаете точную причину
              поломки и стоимость ремонта без каких-либо обязательств.
            </p>
            <p className="text-lg text-gray-medium lg:mb-8">
              Используем только оригинальные запчасти и даём гарантию на все
              выполненные работы. Большинство ремонтов выполняется в день обращения.
            </p>
            <Button onClick={scrollToPricing} className="hidden lg:inline-flex gap-2 group transition-transform duration-300 hover:scale-105 lg:mt-auto lg:self-start">
              Посмотреть цены
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl">
              <img
                src={serviceImg}
                alt="Сервис APPGRADE"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <Button onClick={scrollToPricing} className="lg:hidden gap-2 w-full justify-center group transition-transform duration-300 hover:scale-105">
            Подробнее
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </Container>
    </section>
  )
}
