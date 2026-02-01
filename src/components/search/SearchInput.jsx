import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { SearchDropdown } from './SearchDropdown'
import { useSearchStore } from '../../stores/useSearchStore'
import { useDebounce } from '../../hooks/useDebounce'
import { searchProducts } from '../../data/products'

export function SearchInput({ className = '', variant = 'default' }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const { query, setQuery, isOpen, setIsOpen, results, setResults, reset } =
    useSearchStore()

  const debouncedQuery = useDebounce(query, 300)

  // Поиск при изменении запроса
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      const searchResults = searchProducts(debouncedQuery)
      setResults(searchResults)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery, setResults, setIsOpen])

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    reset()
    inputRef.current?.focus()
  }

  const variants = {
    default: {
      container: 'relative',
      form: 'relative',
      input:
        'w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all',
      icon: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium',
    },
    header: {
      container: 'relative hidden lg:block',
      form: 'relative',
      input:
        'w-64 pl-10 pr-10 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:w-80 focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all duration-300',
      icon: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium',
    },
  }

  const v = variants[variant] || variants.default

  return (
    <div ref={containerRef} className={`${v.container} ${className}`}>
      <form onSubmit={handleSubmit} className={v.form}>
        <Search className={v.icon} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Поиск товаров..."
          className={v.input}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Очистить"
          >
            <X className="w-4 h-4 text-gray-medium" />
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <SearchDropdown
          results={results}
          query={query}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
