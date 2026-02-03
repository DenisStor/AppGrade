import { useState, useEffect, useRef, useMemo } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [phase, setPhase] = useState('pending') // 'pending' | 'out' | 'in'
  const wasOutRef = useRef(false)

  const stableOptions = useMemo(() => ({
    threshold: 0.1,
    root: options.root ?? null,
    rootMargin: options.rootMargin ?? '0px',
    ...options,
  }), [options.threshold, options.root, options.rootMargin])

  // Классификация ПОСЛЕ paint (гарантирует что ScrollToTop уже отработал)
  useEffect(() => {
    if (!ref.current || phase !== 'pending') return
    const rect = ref.current.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setPhase('in')
    } else {
      wasOutRef.current = true
      setPhase('out')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Observer для элементов вне viewport
  useEffect(() => {
    if (phase !== 'out') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPhase('in')
        observer.disconnect()
      }
    }, stableOptions)
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [phase, stableOptions])

  const isVisible = phase !== 'out'
  const animate = wasOutRef.current && phase === 'in'

  return [ref, isVisible, animate]
}
