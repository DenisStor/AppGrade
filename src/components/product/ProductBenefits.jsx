import { Truck, Shield, CreditCard } from 'lucide-react'

const BENEFITS = [
  { icon: Truck, label: 'Бесплатная доставка' },
  { icon: Shield, label: 'Гарантия 1 год' },
  { icon: CreditCard, label: 'Рассрочка 0%' },
]

export function ProductBenefits() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-light">
      {BENEFITS.map(({ icon: Icon, label }) => (
        <div key={label} className="text-center">
          <Icon className="w-6 h-6 mx-auto mb-2 text-gray-dark" />
          <p className="text-xs text-gray-medium">{label}</p>
        </div>
      ))}
    </div>
  )
}
