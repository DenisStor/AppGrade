import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function AnimatedSection({ children, className = '', delay = 0, lazyMount = false }) {
  const [ref, isVisible, animate] = useInView()
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const shouldMount = !lazyMount || isVisible

  return (
    <div
      ref={ref}
      className={`${
        animate ? 'transition-all duration-700 ease-out' : ''
      } ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={animate && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {shouldMount ? children : null}
    </div>
  )
}
