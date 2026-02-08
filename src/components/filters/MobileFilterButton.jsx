import { SlidersHorizontal } from 'lucide-react'

export function MobileFilterButton({ onClick, activeCount }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span className="text-sm font-medium">Фильтры</span>
      {activeCount > 0 && (
        <span className="w-5 h-5 bg-gray-dark text-white text-xs rounded-full flex items-center justify-center">
          {activeCount}
        </span>
      )}
    </button>
  )
}
