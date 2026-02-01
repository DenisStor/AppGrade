import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className = '',
}) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const sideClasses = {
    left: 'left-0 animate-slide-in-left',
    right: 'right-0 animate-slide-in-right',
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`
          fixed top-0 bottom-0 w-full max-w-sm bg-white shadow-xl
          flex flex-col ${sideClasses[side]} ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {title && (
            <h2 id="drawer-title" className="text-lg font-semibold text-gray-dark">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-2 -mr-2 ml-auto rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-gray-medium" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
