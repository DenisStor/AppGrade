import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function FooterColumn({ title, links }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const content = (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="text-gray-medium hover:text-gray-dark transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )

  if (isMobile) {
    return (
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full py-4 text-gray-dark font-semibold"
        >
          {title}
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-dark mb-4">{title}</h3>
      {content}
    </div>
  )
}
