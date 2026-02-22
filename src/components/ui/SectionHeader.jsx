import { Link } from 'react-router-dom'

export function SectionHeader({
  title,
  subtitle,
  subtitleClassName = '',
  linkText,
  linkHref,
  className = ''
}) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">
          {title}
        </h2>
        {linkHref && (
          <Link
            to={linkHref}
            className="text-gray-medium sm:text-gray-dark hover:text-gray-dark sm:hover:text-gray-medium font-medium transition-colors whitespace-nowrap flex-shrink-0 sm:mt-3"
          >
            {linkText || 'Смотреть все'} →
          </Link>
        )}
      </div>
      {subtitle && (
        <p className={`text-gray-medium mt-1 sm:mt-2 ${subtitleClassName}`}>{subtitle}</p>
      )}
    </div>
  )
}
