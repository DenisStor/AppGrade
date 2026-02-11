import { Link, useLocation } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Drawer } from '../ui/Drawer'
import { MOBILE_MENU_SECTIONS } from '../../data/navigation'
import { CONTACTS } from '../../data/config'

export function MobileMenu({ isOpen, onClose }) {
  const { pathname } = useLocation()

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Меню" side="left" maxWidth="max-w-[280px]">
      <nav className="-mx-4 -mt-4">
        {MOBILE_MENU_SECTIONS.map((section, idx) => (
          <div key={section.title}>
            {idx > 0 && <div className="border-t border-gray-100 mx-3" />}
            <ul className="py-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      pathname === link.href
                        ? 'bg-gray-100 text-gray-dark font-medium'
                        : 'text-gray-dark/80 active:bg-gray-50'
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

      <div className="border-t border-gray-100 mt-3 pt-3">
        <a
          href={CONTACTS.phoneLink}
          className="flex items-center gap-2.5 py-2 text-sm text-gray-dark"
        >
          <Phone size={15} className="text-gray-medium" />
          {CONTACTS.phone}
        </a>
      </div>
    </Drawer>
  )
}
