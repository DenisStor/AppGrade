import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Wrench, MessageCircle } from 'lucide-react'

export function InfoBlocks() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-4 lg:mx-8 border-t border-gray-300 mb-8" />
      <Container>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Block */}
          <div className="bg-gray-light border border-gray-200/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.01] transition-all duration-300 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
                  Сервисный центр
                </h3>
                <p className="text-gray-medium mb-4">
                  Профессиональный ремонт техники Apple с гарантией качества.
                  Оригинальные запчасти и опытные мастера.
                </p>
                <Button variant="secondary" size="sm">
                  Записаться
                </Button>
              </div>
            </div>
          </div>

          {/* Telegram Block */}
          <div className="bg-gray-light border border-gray-200/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.01] transition-all duration-300 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle size={24} className="text-gray-dark" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
                  Telegram-канал
                </h3>
                <p className="text-gray-medium mb-4">
                  Подпишитесь на наш канал и первыми узнавайте о скидках,
                  новинках и эксклюзивных предложениях.
                </p>
                <Button variant="primary" size="sm">
                  Подписаться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
