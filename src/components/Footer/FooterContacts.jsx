import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export function FooterContacts() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-dark mb-4">Контакты</h3>
      <div className="space-y-3">
        <a
          href="tel:+74951234567"
          className="flex items-center gap-3 text-gray-medium hover:text-gray-dark transition-colors"
        >
          <Phone size={18} />
          <span>+7 (495) 123-45-67</span>
        </a>
        <a
          href="mailto:info@electronicsstore.ru"
          className="flex items-center gap-3 text-gray-medium hover:text-gray-dark transition-colors"
        >
          <Mail size={18} />
          <span>info@electronicsstore.ru</span>
        </a>
        <div className="flex items-center gap-3 text-gray-medium">
          <MapPin size={18} />
          <span>Москва, ул. Примерная, д. 1</span>
        </div>
        <div className="flex items-center gap-3 text-gray-medium">
          <Clock size={18} />
          <span>Ежедневно 10:00 — 22:00</span>
        </div>
      </div>
    </div>
  )
}
