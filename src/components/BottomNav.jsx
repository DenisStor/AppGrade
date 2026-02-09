import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Wrench, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'

const tabs = [
  { path: '/', label: 'Главная', icon: Home, exact: true },
  { path: '/catalog', label: 'Каталог', icon: LayoutGrid },
  { path: '/service', label: 'Сервис', icon: Wrench, exact: true },
  { path: '/cart', label: 'Корзина', icon: ShoppingBag, exact: true },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const cartCount = useCartStore((s) => s.getCount())

  const isActive = (tab) =>
    tab.exact ? pathname === tab.path : pathname.startsWith(tab.path)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden pb-safe">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const active = isActive(tab)
          const Icon = tab.icon
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? 'text-gray-dark' : 'text-gray-medium'
              }`}
            >
              <span className="relative">
                <Icon size={22} />
                {tab.path === '/cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center bg-blue-500 text-white text-[10px] font-semibold rounded-full px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
