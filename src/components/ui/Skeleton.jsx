const SKELETON_VARIANTS = {
  default: 'animate-shimmer',
  text: 'animate-shimmer h-4 rounded',
  title: 'animate-shimmer h-6 rounded w-3/4',
  card: 'animate-shimmer rounded-liquid-lg',
  circle: 'animate-shimmer rounded-full',
}

export function Skeleton({ className = '', variant = 'default' }) {
  return (
    <div
      className={`bg-gray-200 ${SKELETON_VARIANTS[variant]} ${className}`}
    />
  )
}
