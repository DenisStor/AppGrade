import { Button } from '../ui/Button'

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
        <img
          src={image}
          alt={title}
          className="w-full max-w-xs mx-auto mb-6"
        />
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
