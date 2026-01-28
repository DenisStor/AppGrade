export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-gray-dark text-white hover:bg-black',
    secondary: 'bg-gray-dark text-white hover:bg-black',
    outline: 'border border-gray-dark text-gray-dark hover:bg-gray-dark hover:text-white',
    'outline-white': 'border border-white text-white hover:bg-white hover:text-gray-dark',
    white: 'bg-white text-gray-dark hover:bg-gray-100',
    ghost: 'text-gray-dark hover:bg-gray-100',
    glass: 'bg-gray-light border border-gray-200/50 text-gray-dark hover:bg-gray-200 shadow-glass hover:shadow-glass-hover',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-full
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
