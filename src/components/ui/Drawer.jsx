import { useEffect, useCallback, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const SWIPE_THRESHOLD = 80

const SIDE_CLASSES = {
  left: 'left-0 rounded-r-2xl',
  right: 'right-0 rounded-l-2xl',
}

const ENTER_ANIMATION = {
  left: 'animate-slide-in-left',
  right: 'animate-slide-in-right',
}

const EXIT_ANIMATION = {
  left: 'animate-slide-out-left',
  right: 'animate-slide-out-right',
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className = '',
}) {
  const [isClosing, setIsClosing] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartRef = useRef(null)
  const panelRef = useRef(null)
  const isDraggingRef = useRef(false)

  const handleClose = useCallback(() => {
    setIsClosing(true)
  }, [])

  const handleAnimationEnd = useCallback(
    (e) => {
      if (isClosing && e.target === panelRef.current) {
        setIsClosing(false)
        setSwipeOffset(0)
        onClose()
      }
    },
    [isClosing, onClose]
  )

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') handleClose()
    },
    [handleClose]
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

  // Сбрасываем isClosing когда drawer закрыт снаружи
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false)
      setSwipeOffset(0)
    }
  }, [isOpen])

  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    isDraggingRef.current = false
  }, [])

  const handleTouchMove = useCallback(
    (e) => {
      if (!touchStartRef.current) return

      const dx = e.touches[0].clientX - touchStartRef.current.x
      const dy = e.touches[0].clientY - touchStartRef.current.y

      // Определяем горизонтальный свайп (угол < 30°)
      if (!isDraggingRef.current) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
        isDraggingRef.current = Math.abs(dx) > Math.abs(dy)
        if (!isDraggingRef.current) {
          touchStartRef.current = null
          return
        }
      }

      // left drawer: свайп влево (dx < 0), right drawer: свайп вправо (dx > 0)
      const validSwipe = side === 'left' ? dx < 0 : dx > 0
      if (validSwipe) {
        e.preventDefault()
        setSwipeOffset(dx)
      }
    },
    [side]
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) {
      touchStartRef.current = null
      return
    }

    const absOffset = Math.abs(swipeOffset)
    const panelWidth = panelRef.current?.offsetWidth || 384

    if (absOffset > SWIPE_THRESHOLD || absOffset > panelWidth * 0.3) {
      handleClose()
    }
    setSwipeOffset(0)
    touchStartRef.current = null
    isDraggingRef.current = false
  }, [swipeOffset, handleClose])

  if (!isOpen && !isClosing) return null

  const animClass = isClosing
    ? EXIT_ANIMATION[side]
    : swipeOffset === 0
      ? ENTER_ANIMATION[side]
      : ''

  const panelStyle =
    swipeOffset !== 0 ? { transform: `translateX(${swipeOffset}px)` } : undefined

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`
          fixed top-0 bottom-0 w-full max-w-sm bg-white shadow-xl
          flex flex-col ${SIDE_CLASSES[side]} ${animClass} ${className}
        `}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {title && (
            <h2 id="drawer-title" className="text-lg font-semibold text-gray-dark">
              {title}
            </h2>
          )}
          <button
            onClick={handleClose}
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
