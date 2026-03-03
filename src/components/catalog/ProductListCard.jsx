import { useState, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import { ColorSwatch } from '../ui/ColorSwatch'
import { getMinPrice, formatPrice, getAvailableColors } from '../../utils/product'

export const ProductListCard = memo(function ProductListCard({ product, category, brand }) {
  const [selectedColorId, setSelectedColorId] = useState(null)

  const colors = getAvailableColors(product)

  const selectedVariant = useMemo(() => {
    if (selectedColorId) {
      return product.variants?.find(v => v.color.id === selectedColorId) || product.variants?.[0]
    }
    return product.variants?.[0]
  }, [product.variants, selectedColorId])

  const minPrice = getMinPrice(product)

  const handleColorClick = (e, colorId) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedColorId(colorId)
  }

  const productUrl = `/catalog/${category}/${brand}/${product.slug}`

  return (
    <Link to={productUrl} className="group flex flex-col h-full">
      <div className="bg-[#F5F5F7] rounded-2xl overflow-hidden">
        <div className="aspect-square flex items-center justify-center lg:overflow-hidden">
          <div className="w-[78%] h-[78%]">
            <ImageWithSkeleton
              src={selectedVariant?.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain lg:transition-transform lg:duration-300 lg:group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              widths={[400, 800, 1200]}
            />
          </div>
        </div>

        {colors.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-3">
            {colors.slice(0, 5).map((color) => (
              <ColorSwatch
                key={color.id}
                color={color}
                selected={selectedColorId === color.id}
                size="sm"
                showCheck={false}
                onClick={(e) => handleColorClick(e, color.id)}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-xs text-gray-medium self-center">+{colors.length - 5}</span>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 lg:pt-3 px-1 flex flex-col flex-1">
        <h3 className="text-sm lg:text-base font-semibold text-gray-dark line-clamp-2 mb-1 lg:group-hover:text-gray-medium lg:transition-colors">
          {product.name}
        </h3>

        <span className="text-sm lg:text-base text-gray-medium">
          От {formatPrice(minPrice)}
        </span>
      </div>
    </Link>
  )
})
