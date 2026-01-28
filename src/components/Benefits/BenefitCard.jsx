import { Headphones, Truck, Shield, Gift } from 'lucide-react'

const ICONS = {
  Headphones,
  Truck,
  Shield,
  Gift,
}

export function BenefitCard({ icon, title, description }) {
  const Icon = ICONS[icon]

  return (
    <div className="text-center p-6 bg-gray-light border border-gray-200/50 rounded-2xl shadow-glass hover:shadow-glass-hover hover:scale-[1.02] transition-all duration-300">
      <div className="w-14 h-14 mx-auto mb-4 bg-white border border-gray-200/50 rounded-2xl flex items-center justify-center shadow-sm">
        <Icon size={28} className="text-gray-dark" />
      </div>
      <h3 className="font-semibold text-gray-dark mb-2">{title}</h3>
      <p className="text-sm text-gray-medium">{description}</p>
    </div>
  )
}
