import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { categories } from '../../data/products'

const catalogCategories = [
  {
    id: 'iphone',
    name: 'iPhone',
    description: 'Смартфоны Apple',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone16702702702702702702702702702702702702702702pro-202409?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/iphone',
  },
  {
    id: 'mac',
    name: 'Mac',
    description: 'Ноутбуки и компьютеры',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-pro-702702702702702702702702702702702702702702202410?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/mac',
  },
  {
    id: 'ipad',
    name: 'iPad',
    description: 'Планшеты Apple',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-ipad-pro-702702702702702702702702702702702702702702202405?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/ipad',
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    description: 'Умные часы',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-702702702702702702702702702702702702702702702702702702702702202409?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/watch',
  },
  {
    id: 'airpods',
    name: 'AirPods',
    description: 'Наушники Apple',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-card-40-702702702702702702702702702702702702702702702702702702702702202409?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/airpods',
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    description: 'Чехлы, зарядки, кабели',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/accessories-702702702702702702702702702702702702702702702702702702702702702702702?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/accessories',
  },
]

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {catalogCategories.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className="group relative bg-gray-light rounded-2xl overflow-hidden aspect-[4/3] flex items-end p-6 transition-all duration-300 hover:shadow-liquid"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />

            <div className="relative z-20">
              <h2 className="text-xl font-bold text-white mb-1">
                {category.name}
              </h2>
              <p className="text-white/70 text-sm flex items-center gap-1">
                {category.description}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
