import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import { Container } from '../ui/Container'
import logo from '../../assets/logo.png'

const NAV_ITEMS = [
  { label: 'iPhone', href: '/iphone' },
  { label: 'Mac', href: '/mac' },
  { label: 'iPad', href: '/ipad' },
  { label: 'Watch', href: '/watch' },
  { label: 'AirPods', href: '/airpods' },
  { label: 'Аксессуары', href: '/accessories' },
]

export function Navigation() {
  return (
    <Container className="flex items-center justify-between py-4">
      {/* Logo */}
      <a href="/">
        <img src={logo} alt="APPGRADE" className="h-6" />
      </a>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-base font-medium text-gray-dark hover:text-gray-medium transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:flex">
          <Search size={20} className="text-gray-dark" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:flex">
          <Heart size={20} className="text-gray-dark" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:flex">
          <User size={20} className="text-gray-dark" />
        </button>
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ShoppingBag size={20} className="text-gray-dark" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gray-dark text-white text-xs font-bold rounded-full flex items-center justify-center">
            2
          </span>
        </button>
      </div>
    </Container>
  )
}
