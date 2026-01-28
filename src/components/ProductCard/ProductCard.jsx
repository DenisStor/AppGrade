import { Button } from '../ui/Button'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

export function ProductCard({
  title,
  subtitle,
  description,
  price,
  image,
}) {
  return (
    <div
      className="rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col h-full bg-gray-light border border-gray-200/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold mb-1 text-gray-dark">
          {subtitle}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-dark">
          {title}
        </h3>
        <p className="mb-4 text-gray-medium">
          {description}
        </p>
        <p className="text-gray-dark">
          от <span className="font-bold text-xl">{price}</span>
        </p>
      </div>

      <div className="mt-6">
        <div className="overflow-hidden rounded-xl max-w-xs mx-auto mb-6">
          <ImageWithSkeleton
            src={image}
            alt={title}
            className="w-full transition-transform duration-300 hover:scale-105"
            skeletonClassName="rounded-xl"
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Подробнее
          </Button>
          <Button
            variant="outline"
            size="md"
            className="flex-1"
          >
            Купить
          </Button>
        </div>
      </div>
    </div>
  )
}
