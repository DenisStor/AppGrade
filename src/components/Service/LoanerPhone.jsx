import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import loanerPhoneImg from '../../assets/loaner-phone.png'

export function LoanerPhone() {
  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gray-dark text-white text-sm font-medium mb-6">
              На связи
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-dark mb-6">
              Подменный iPhone
            </h2>
            <p className="text-lg text-gray-medium mb-4">
              Понимаем, как сложно остаться без телефона даже на несколько часов.
              Поэтому предоставляем подменный iPhone на время сложного ремонта — абсолютно бесплатно.
            </p>
            <p className="text-lg text-gray-medium mb-8">
              Вы сможете перенести SIM-карту, войти в свои аккаунты и продолжить
              работать как обычно. Верните подменный телефон, когда заберёте свой.
            </p>
            <Button className="gap-2">
              Подробнее
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-light overflow-hidden">
              <img
                src={loanerPhoneImg}
                alt="Подменный iPhone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
