import { Link } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import { Container } from '../ui/Container'
import { NAV_MAIN } from '../../data/navigation'
import logo from '../../assets/logo.png'

export function Navigation() {
  return (
    <Container className="flex items-center justify-between py-4 gap-12">
      {/* Logo */}
      <Link to="/" className="shrink-0">
        <img src={logo} alt="APPGRADE" className="h-6" />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-4">
        {NAV_MAIN.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="text-sm font-medium text-gray-dark hover:text-gray-medium px-3 py-2.5 min-h-[44px] flex items-center rounded-full hover:bg-white/50 hover:backdrop-blur-sm transition-all whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all hidden md:flex">
          <Search size={20} className="text-gray-dark" />
        </button>
        <button className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all">
          <ShoppingBag size={20} className="text-gray-dark" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gray-dark text-white text-xs font-bold rounded-full flex items-center justify-center">
            2
          </span>
        </button>
      </div>
    </Container>
  )
}
