import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Container } from '../ui/Container'
import logo from '../../assets/logo.png'

export function Header() {
  const { isScrolled } = useScrollPosition()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
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
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Открыть меню"
          >
            <Menu className="w-5 h-5 text-gray-dark" />
          </button>
          <Link to="/">
            <img src={logo} alt="APPGRADE" className="h-5" />
          </Link>
          <div className="w-9" aria-hidden="true" />
        </Container>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-100">
        <Navigation />
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  )
}
