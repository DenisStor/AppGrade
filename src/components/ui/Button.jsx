import { useState } from 'react'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const variants = {
    primary: 'bg-gray-dark text-white hover:bg-black',
    secondary: 'bg-gray-dark text-white hover:bg-black',
    outline: 'border border-gray-dark text-gray-dark hover:bg-gray-dark hover:text-white',
    'outline-white': 'border border-white text-white hover:bg-white hover:text-gray-dark',
    white: 'bg-white text-gray-dark hover:bg-gray-100',
    ghost: 'text-gray-dark hover:bg-gray-100',
    glass: 'bg-gray-light border border-gray-200/50 text-gray-dark hover:bg-gray-200 shadow-glass hover:shadow-glass-hover',
    liquid: 'liquid-glass hover:shadow-liquid-hover text-gray-dark',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]',
  }

  const rippleColor = ['primary', 'secondary', 'outline-white'].includes(variant)
    ? 'bg-white/30'
    : 'bg-gray-dark/20'

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)

    onClick?.(e)
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className={`absolute ${rippleColor} rounded-full animate-ripple pointer-events-none`}
          style={{
            left: x,
            top: y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      {children}
    </button>
  )
}
