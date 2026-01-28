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
        className={`sticky top-0 z-50 transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${
          isScrolled
            ? 'bg-gray-light backdrop-blur-[10px] border-b border-gray-200/50 shadow-glass'
            : 'bg-gray-light/80 backdrop-blur-sm'
        }`}
      >

        {/* Mobile Header */}
        <div className="lg:hidden">
          <Container className="flex items-center justify-between py-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>

            <a href="/">
              <img src={logo} alt="APPGRADE" className="h-5" />
            </a>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
