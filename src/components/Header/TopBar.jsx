import { MapPin, Phone } from 'lucide-react'
import { Container } from '../ui/Container'

export function TopBar() {
  return (
    <div className="bg-gray-light py-2 text-sm hidden md:block">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-gray-medium">
          <a href="/delivery" className="hover:text-gray-dark transition-colors">
            Доставка и оплата
          </a>
          <a href="/warranty" className="hover:text-gray-dark transition-colors">
            Гарантия
          </a>
          <a href="/contacts" className="hover:text-gray-dark transition-colors">
            Контакты
          </a>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-1.5 text-gray-medium hover:text-gray-dark transition-colors">
            <MapPin size={14} />
            <span>Москва</span>
          </a>
          <a href="tel:+74951234567" className="flex items-center gap-1.5 font-semibold text-gray-dark hover:text-gray-medium transition-colors">
            <Phone size={14} />
            <span>+7 (495) 123-45-67</span>
          </a>
        </div>
      </Container>
    </div>
  )
}
