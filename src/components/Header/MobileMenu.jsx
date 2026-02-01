import { Link } from 'react-router-dom'
import { X, ChevronRight, Phone, MapPin } from 'lucide-react'
import { CONTACTS } from '../../data/config'
import { NAV_MOBILE } from '../../data/navigation'

export function MobileMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 liquid-glass-dark z-40 transition-opacity duration-liquid lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] liquid-glass z-50 transform transition-transform duration-liquid lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-bold text-gray-dark">Меню</span>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          {NAV_MOBILE.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="flex items-center justify-between py-3.5 min-h-[48px] border-b border-gray-100 text-gray-dark hover:text-gray-medium transition-colors"
            >
              <span className="font-medium">{item.label}</span>
              <ChevronRight size={18} className="text-gray-medium" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/30 backdrop-blur-sm">
          <a
            href={CONTACTS.phoneLink}
            className="flex items-center gap-2 text-gray-dark font-semibold mb-2"
          >
            <Phone size={18} />
            {CONTACTS.phone}
          </a>
          <div className="flex items-center gap-2 text-gray-medium text-sm">
            <MapPin size={16} />
            {CONTACTS.city}
          </div>
        </div>
      </div>
    </>
  )
}
