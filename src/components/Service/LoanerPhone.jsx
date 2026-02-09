import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import loanerPhoneImg from '../../assets/loaner-phone.png'

export function LoanerPhone() {
  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="lg:self-stretch lg:flex lg:flex-col">
            <span className="inline-block px-4 py-1.5 bg-gray-dark text-white text-sm font-medium rounded-full mb-6 lg:self-start">
              На связи
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-6">
              Подменный iPhone
            </h2>
            <p className="text-lg text-gray-medium mb-4">
              Понимаем, как сложно остаться без телефона даже на несколько часов.
              Поэтому предоставляем подменный iPhone на время сложного ремонта — абсолютно бесплатно.
            </p>
            <p className="text-lg text-gray-medium lg:mb-8">
              Вы сможете перенести SIM-карту, войти в свои аккаунты и продолжить
              работать как обычно. Верните подменный телефон, когда заберёте свой.
            </p>
            <Button className="hidden lg:inline-flex gap-2 group transition-transform duration-300 hover:scale-105 lg:mt-auto lg:self-start">
              Подробнее
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-light overflow-hidden rounded-3xl">
              <ImageWithSkeleton
                src={loanerPhoneImg}
                alt="Подменный iPhone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Кнопка под фото на мобилках */}
          <Button className="lg:hidden gap-2 w-full justify-center group transition-transform duration-300 hover:scale-105">
            Подробнее
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </Container>
    </section>
  )
}
