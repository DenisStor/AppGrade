import { X, ChevronRight, Phone, MapPin } from 'lucide-react'

const MENU_ITEMS = [
  { label: 'iPhone', href: '/iphone' },
  { label: 'Mac', href: '/mac' },
  { label: 'iPad', href: '/ipad' },
  { label: 'Watch', href: '/watch' },
  { label: 'AirPods', href: '/airpods' },
  { label: 'Аксессуары', href: '/accessories' },
  { label: 'Доставка и оплата', href: '/delivery' },
  { label: 'Гарантия', href: '/warranty' },
  { label: 'Контакты', href: '/contacts' },
]

export function MobileMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-light z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-bold text-gray-dark">Меню</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          {MENU_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between py-3 border-b border-gray-100 text-gray-dark hover:text-gray-medium transition-colors"
            >
              <span className="font-medium">{item.label}</span>
              <ChevronRight size={18} className="text-gray-medium" />
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-light">
          <a
            href="tel:+74951234567"
            className="flex items-center gap-2 text-gray-dark font-semibold mb-2"
          >
            <Phone size={18} />
            +7 (495) 123-45-67
          </a>
          <div className="flex items-center gap-2 text-gray-medium text-sm">
            <MapPin size={16} />
            Москва
          </div>
        </div>
      </div>
    </>
  )
}
