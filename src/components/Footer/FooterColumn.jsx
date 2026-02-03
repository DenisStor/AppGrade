import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useMatchMedia } from '../../hooks/useMatchMedia'

export function FooterColumn({ title, links }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMatchMedia('(max-width: 767px)')

  const content = (
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            to={link.href}
            className="relative text-gray-400 hover:text-white transition-colors inline-block group"
          >
            <span className="relative">
              {link.label}
              <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )

  if (isMobile) {
    return (
      <div className="border-b border-white/5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full py-4 text-white font-semibold"
        >
          <span className="flex items-center gap-2">
            <span className="w-6 h-px bg-gradient-to-r from-blue-500 to-transparent" />
            {title}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
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
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-gradient-to-r from-blue-500 to-transparent" />
        {title}
      </h3>
      {content}
    </div>
  )
}
