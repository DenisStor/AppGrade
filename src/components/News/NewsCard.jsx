import { Link } from 'react-router-dom'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

export function NewsCard({ id, image, date, title }) {
  return (
    <Link to={`/blog/${id}`} className="block group cursor-pointer">
      <div className="aspect-[2/1] overflow-hidden mb-4">
        <ImageWithSkeleton
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          skeletonClassName="rounded"
        />
      </div>
      <h3 className="font-semibold text-xl md:text-2xl text-gray-dark mb-2">
        {title}
      </h3>
      <span className="text-xs text-gray-medium uppercase tracking-wider">
        {date}
      </span>
    </Link>
  )
}
