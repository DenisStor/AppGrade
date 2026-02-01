import { Link } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import { Container } from '../ui/Container'
import { CONTACTS } from '../../data/config'
import { NAV_TOP } from '../../data/navigation'

export function TopBar() {
  return (
    <div className="bg-gray-light py-2 text-sm hidden md:block">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-gray-medium">
          {NAV_TOP.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="hover:text-gray-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-gray-medium">
            <MapPin size={14} />
            <span>{CONTACTS.city}</span>
          </span>
          <a href={CONTACTS.phoneLink} className="flex items-center gap-1.5 font-semibold text-gray-dark hover:text-gray-medium transition-colors">
            <Phone size={14} />
            <span>{CONTACTS.phone}</span>
          </a>
        </div>
      </Container>
    </div>
  )
}
