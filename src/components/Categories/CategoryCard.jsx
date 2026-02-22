import { Link } from 'react-router-dom'

export function CategoryCard({ name, subtitle, image, link, imageClassName = '', imageContainerClassName = '' }) {
  return (
    <Link
      to={link}
      className="group block w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]"
    >
      <div className="relative aspect-[0.7] overflow-hidden bg-gray-light rounded-3xl flex flex-col">
        <div className="p-5 pb-0 relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-gray-dark leading-tight">
            {name}
          </h3>
          <p className="text-sm md:text-base text-gray-medium mt-1">
            {subtitle}
          </p>
        </div>
        <div className={`flex-1 flex justify-center overflow-hidden ${imageContainerClassName || 'items-center'}`}>
          <img
            src={image}
            alt={name}
            loading="eager"
            className={`block group-hover:scale-105 transition-transform duration-500 ${imageClassName}`}
          />
        </div>
      </div>
    </Link>
  )
}
