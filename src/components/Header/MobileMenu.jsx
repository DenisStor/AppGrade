import { Link, useLocation } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { Drawer } from '../ui/Drawer'
import { MOBILE_MENU_SECTIONS } from '../../data/navigation'
import { CONTACTS } from '../../data/config'
import { SOCIAL_LINKS } from '../../data/social'

export function MobileMenu({ isOpen, onClose }) {
  const { pathname } = useLocation()

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Меню" side="left">
      <nav className="space-y-6">
        {MOBILE_MENU_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      pathname === link.href
                        ? 'bg-gray-100 text-gray-dark font-medium'
                        : 'text-gray-dark/80 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
        <a
          href={CONTACTS.phoneLink}
          className="flex items-center gap-3 text-sm text-gray-dark"
        >
          <Phone size={16} className="text-gray-medium" />
          {CONTACTS.phone}
        </a>
        <div className="flex items-center gap-3 text-sm text-gray-dark/70">
          <MapPin size={16} className="text-gray-medium" />
          {CONTACTS.fullAddress}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-dark/70">
          <Clock size={16} className="text-gray-medium" />
          {CONTACTS.workHours}
        </div>
      </div>

      <div className="border-t border-gray-100 mt-6 pt-6">
        <div className="flex gap-3">
          {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-medium hover:bg-gray-200 transition-colors"
              aria-label={name}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </Drawer>
  )
}
