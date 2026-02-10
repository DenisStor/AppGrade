import { SlidersHorizontal } from 'lucide-react'

export function MobileFilterButton({ onClick, activeCount, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 h-11 px-4
        bg-white border border-gray-200 rounded-[10px]
        hover:border-gray-300 transition-colors
        text-sm font-medium ${className}`}
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span>Фильтры</span>
      {activeCount > 0 && (
        <span className="w-5 h-5 bg-gray-dark text-white text-xs rounded-full flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </button>
  )
}
