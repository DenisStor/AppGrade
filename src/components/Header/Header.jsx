import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag } from 'lucide-react'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { Container } from '../ui/Container'
import { SearchInput } from '../search/SearchInput'
import { useSearchStore } from '../../stores/useSearchStore'
import { useCartStore } from '../../stores/useCartStore'
import logo from '../../assets/logo.png'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const { isScrolled } = useScrollPosition()
  const { query, setQuery, reset } = useSearchStore()
  const cartCount = useCartStore((state) => state.getCount())
  const navigate = useNavigate()

  const handleMobileSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsMobileSearchOpen(false)
      reset()
    }
  }

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

            <div className="flex items-center">
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
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/50 hover:backdrop-blur-sm rounded-full transition-all"
              >
                <Search size={24} />
              </button>
            </div>
          </Container>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="px-4 pb-3 animate-fade-in">
              <form onSubmit={handleMobileSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200"
                />
              </form>
            </div>
          )}
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
