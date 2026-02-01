import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Container } from '../ui/Container'
import logo from '../../assets/logo.png'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isScrolled } = useScrollPosition()

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

            <a href="/">
              <img src={logo} alt="APPGRADE" className="h-5" />
            </a>

            <button className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all">
              <Search size={24} />
            </button>
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
