import { Drawer } from '../ui/Drawer'
import { formatProductCount } from '../../utils/pluralize'

export function FilterDrawer({ isOpen, onClose, filteredCount, children }) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Фильтры"
      side="left"
    >
      {children}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-dark text-white rounded-lg font-medium hover:bg-gray-dark/90 transition-colors"
        >
          Показать {formatProductCount(filteredCount)}
        </button>
      </div>
    </Drawer>
  )
}
