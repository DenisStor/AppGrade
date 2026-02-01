const variants = {
  new: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    text: 'text-white',
    label: 'Новинка',
  },
  hit: {
    bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
    text: 'text-white',
    label: 'Хит',
  },
  sale: {
    bg: 'bg-gradient-to-r from-red-500 to-red-600',
    text: 'text-white',
    label: 'Скидка',
  },
  discount: {
    bg: 'bg-gradient-to-r from-green-500 to-green-600',
    text: 'text-white',
    label: '',
  },
}

export function Badge({ variant = 'new', label, className = '' }) {
  const config = variants[variant] || variants.new
  const displayLabel = label || config.label

  if (!displayLabel) return null

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm
        ${config.bg} ${config.text} ${className}
      `}
    >
      {displayLabel}
    </span>
  )
}

export function BadgeGroup({ badges = [], className = '' }) {
  if (!badges.length) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge, index) => (
        <Badge
          key={index}
          variant={typeof badge === 'string' ? badge : badge.variant}
          label={typeof badge === 'string' ? undefined : badge.label}
        />
      ))}
    </div>
  )
}
