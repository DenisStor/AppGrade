import { Link } from 'react-router-dom'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

export function CategoryCard({ name, image, link }) {
  return (
    <Link to={link} className="group block w-[160px] xs:w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px]">
      <div className="aspect-[0.78125] overflow-hidden liquid-glass rounded-card group-hover:shadow-liquid-hover group-hover:scale-[1.02] transition-all duration-liquid p-3 flex items-center justify-center">
        <div className="w-4/5 h-4/5">
          <ImageWithSkeleton
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            skeletonClassName="rounded"
          />
        </div>
      </div>
      <p className="text-fluid-lg font-semibold text-gray-dark text-center mt-5 tracking-tight">
        {name}
      </p>
    </Link>
  )
}
