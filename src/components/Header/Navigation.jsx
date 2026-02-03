import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { Container } from '../ui/Container'
import { NAV_MAIN } from '../../data/navigation'
import { useCartStore } from '../../stores/useCartStore'
import logo from '../../assets/logo.png'

export function Navigation() {
  const cartCount = useCartStore((state) => state.getCount())

  return (
    <Container className="flex items-center justify-between py-4 gap-8">
      {/* Logo */}
      <Link to="/" className="shrink-0">
        <img src={logo} alt="APPGRADE" className="h-6" />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-3">
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
      <div className="flex items-center gap-4">
        <Link
          to="/cart"
          className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all"
        >
          <ShoppingBag size={20} className="text-gray-dark" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gray-dark text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>
      </div>
    </Container>
  )
}
