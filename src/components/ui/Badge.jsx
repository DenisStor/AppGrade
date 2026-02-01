const variants = {
  new: {
    bg: 'bg-blue-500',
    text: 'text-white',
    label: 'Новинка',
  },
  hit: {
    bg: 'bg-orange-500',
    text: 'text-white',
    label: 'Хит',
  },
  sale: {
    bg: 'bg-red-500',
    text: 'text-white',
    label: 'Скидка',
  },
  discount: {
    bg: 'bg-green-500',
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
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
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
