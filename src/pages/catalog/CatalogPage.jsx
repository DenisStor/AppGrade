import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { CATALOG_CATEGORIES } from '../../data/products'

export default function CatalogPage() {
  useEffect(() => {
    document.title = 'Каталог — APPGRADE'
  }, [])

  const breadcrumbs = [{ label: 'Каталог' }]

  return (
    <div className="section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-8">
        Каталог
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
        {CATALOG_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className="group"
          >
            {/* Мобильная версия — Apple Store стиль */}
            <div className="lg:hidden">
              <div className="bg-gray-light aspect-square flex items-center justify-center p-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <h2 className="text-sm font-semibold text-gray-dark mt-2 text-center">
                {category.name}
              </h2>
            </div>

            {/* Десктопная версия — текущий стиль с градиентом */}
            <div className={`hidden lg:block relative overflow-hidden aspect-[4/3] transition-all duration-300 hover:shadow-liquid ${category.imageContain ? 'bg-white' : 'bg-gray-light'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

              <img
                src={category.image}
                alt={category.name}
                className={`absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 ${category.imageContain ? 'object-contain p-4' : 'object-cover'}`}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h2 className="text-xl font-bold text-white mb-1">
                  {category.name}
                </h2>
                <p className="text-white/70 text-sm flex items-center gap-1">
                  {category.description}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
