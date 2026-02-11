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

// Фазы: closed → entering → open ↔ swiping → closing → closed
//                                  ↔ snapping (возврат)

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  maxWidth = 'max-w-sm',
  className = '',
}) {
  const [phase, setPhase] = useState('closed') // closed | entering | open | swiping | snapping | closing
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartRef = useRef(null)
  const panelRef = useRef(null)
  const isDraggingRef = useRef(false)

  // isOpen: true → entering, false → closing (если был открыт)
  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('entering')
    } else if (!isOpen && phase !== 'closed') {
      setPhase('closed')
      setSwipeOffset(0)
    }
  }, [isOpen, phase])

  const handleClose = useCallback(() => {
    setPhase('closing')
  }, [])

  // entering → open (по окончании CSS keyframe)
  const handleAnimationEnd = useCallback(
    (e) => {
      if (phase === 'entering' && e.target === panelRef.current) {
        setPhase('open')
      }
    },
    [phase]
  )

  // closing/snapping → завершение transition
  const handleTransitionEnd = useCallback(
    (e) => {
      if (e.target !== panelRef.current || e.propertyName !== 'transform') return

      if (phase === 'closing') {
        setPhase('closed')
        setSwipeOffset(0)
        onClose()
      } else if (phase === 'snapping') {
        setPhase('open')
        setSwipeOffset(0)
      }
    },
    [phase, onClose]
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

      if (!isDraggingRef.current) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
        isDraggingRef.current = Math.abs(dx) > Math.abs(dy)
        if (!isDraggingRef.current) {
          touchStartRef.current = null
          return
        }
        setPhase('swiping')
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
      // Закрываем: transition от текущей позиции свайпа до -100%/100%
      setPhase('closing')
    } else {
      // Возвращаем: transition от текущей позиции до 0
      setPhase('snapping')
    }
    touchStartRef.current = null
    isDraggingRef.current = false
  }, [swipeOffset])

  if (phase === 'closed') return null

  // --- Стили панели ---
  const panelStyle = {}

  if (phase === 'swiping') {
    panelStyle.transform = `translateX(${swipeOffset}px)`
    panelStyle.transition = 'none'
  } else if (phase === 'closing') {
    const target = side === 'left' ? '-100%' : '100%'
    panelStyle.transform = `translateX(${target})`
    panelStyle.transition = 'transform 0.25s ease-in'
  } else if (phase === 'snapping') {
    panelStyle.transform = 'translateX(0)'
    panelStyle.transition = 'transform 0.2s ease-out'
  }

  const animClass = phase === 'entering' ? ENTER_ANIMATION[side] : ''

  // --- Overlay opacity ---
  let overlayOpacity = 1
  if (phase === 'swiping' || phase === 'closing') {
    const panelWidth = panelRef.current?.offsetWidth || 384
    const progress = Math.min(Math.abs(swipeOffset) / panelWidth, 1)
    overlayOpacity = 1 - progress
  }

  const overlayStyle = phase === 'swiping'
    ? { opacity: overlayOpacity, transition: 'none' }
    : phase === 'closing'
      ? { opacity: 0, transition: 'opacity 0.25s ease-in' }
      : undefined

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${phase === 'entering' ? 'animate-fade-in' : ''}`}
        style={overlayStyle}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`
          fixed top-0 bottom-0 w-full ${maxWidth} bg-white shadow-xl
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
        onTransitionEnd={handleTransitionEnd}
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
