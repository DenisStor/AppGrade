import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs({ items = [], className = '' }) {
  if (!items.length) return null

  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className="flex items-center gap-1 text-sm text-gray-medium flex-wrap">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-gray-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Главная</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href || item.label} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-gray-300" />
              {isLast ? (
                <span className="text-gray-dark font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-gray-dark transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
