import { Link } from 'react-router-dom'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { Navigation } from './Navigation'
import { Container } from '../ui/Container'
import logo from '../../assets/logo.png'

export function Header() {
  const { isScrolled } = useScrollPosition()

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-liquid ${
        isScrolled ? 'liquid-glass-scrolled' : 'liquid-glass'
      }`}
    >

      {/* Mobile Header */}
      <div className="lg:hidden">
        <Container className="flex items-center justify-center py-3">
          <Link to="/">
            <img src={logo} alt="APPGRADE" className="h-5" />
          </Link>
        </Container>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-100">
        <Navigation />
      </div>
    </header>
  )
}
