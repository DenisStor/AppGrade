import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

export function CategoryCard({ name, image, link }) {
  return (
    <a href={link} className="group block w-[200px] md:w-[240px] lg:w-[300px]">
      <div className="aspect-[0.78125] overflow-hidden bg-[#FAFAFA] border border-gray-200/50 shadow-glass group-hover:shadow-glass-hover group-hover:scale-[1.02] transition-all duration-300 p-3 flex items-center justify-center">
        <div className="w-4/5 h-4/5">
          <ImageWithSkeleton
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            skeletonClassName="rounded"
          />
        </div>
      </div>
      <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-dark text-center mt-5 tracking-tight">
        {name}
      </p>
    </a>
  )
}
