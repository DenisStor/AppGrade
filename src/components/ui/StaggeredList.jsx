import React from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function StaggeredList({ children, className = '', delay = 100 }) {
  const [ref, isVisible, animate] = useInView({ threshold: 0.1 })
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        <div
          className={`${
            animate ? 'transition-all duration-500 ease-out' : ''
          } ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={
            animate && isVisible ? { transitionDelay: `${i * delay}ms` } : undefined
          }
        >
          {child}
        </div>
      ))}
    </div>
  )
}
