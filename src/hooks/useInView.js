import { useState, useEffect, useRef, useMemo } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  const stableOptions = useMemo(() => ({
    threshold: 0.1,
    root: options.root ?? null,
    rootMargin: options.rootMargin ?? '0px',
    ...options,
  }), [options.threshold, options.root, options.rootMargin])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, stableOptions)

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [stableOptions])

  return [ref, isInView]
}
