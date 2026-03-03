import { Clock, ChevronRight } from 'lucide-react'

export function LocationCard({ location }) {
  return (
    <div className="w-[200px] sm:w-[220px] lg:w-[370px] bg-white rounded-xl shadow-xl overflow-hidden animate-scale-in">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 lg:p-3.5">
        <h3 className="font-heading font-bold text-gray-dark text-xs lg:text-sm mb-0.5">
          {location.name}
        </h3>
        <p className="text-gray-medium text-[11px] lg:text-xs mb-0.5">
          {location.address}
        </p>
        <p className="text-gray-medium text-[11px] mb-2">
          {location.description}
        </p>

        <a
          href={location.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-orange-500 text-[11px] lg:text-xs font-medium hover:text-orange-600 transition-colors mb-2"
        >
          Показать на карте
          <ChevronRight className="w-3 h-3" />
        </a>

        <div className="border-t border-gray-100 pt-2 flex items-center gap-1.5 text-gray-medium">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="text-[11px]">{location.workHours}</span>
        </div>
      </div>
    </div>
  )
}
