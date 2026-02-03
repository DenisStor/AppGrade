import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShoppingBag } from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Container } from '../ui/Container'
import { useCartStore } from '../../stores/useCartStore'
import logo from '../../assets/logo.png'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isScrolled } = useScrollPosition()
  const cartCount = useCartStore((state) => state.getCount())

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-liquid ${
          isScrolled ? 'liquid-glass-scrolled' : 'liquid-glass'
        }`}
      >

        {/* Mobile Header */}
        <div className="lg:hidden">
          <Container className="flex items-center justify-between py-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all"
            >
              <Menu size={24} />
            </button>

            <Link to="/">
              <img src={logo} alt="APPGRADE" className="h-5" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-blue-500 text-white text-[10px] font-semibold rounded-full px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </Container>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-100">
          <Navigation />
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
