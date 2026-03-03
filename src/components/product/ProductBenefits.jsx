import { memo } from 'react'
import { Truck, Shield, CreditCard } from 'lucide-react'
import { PRODUCT_BENEFITS } from '../../data/benefits'

const ICON_MAP = { Truck, Shield, CreditCard }

export const ProductBenefits = memo(function ProductBenefits() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-light rounded-card">
      {PRODUCT_BENEFITS.map(({ icon, label }) => {
        const Icon = ICON_MAP[icon]
        return (
          <div key={label} className="text-center">
            <Icon className="w-6 h-6 mx-auto mb-2 text-gray-dark" />
            <p className="text-xs text-gray-medium">{label}</p>
          </div>
        )
      })}
    </div>
  )
})
