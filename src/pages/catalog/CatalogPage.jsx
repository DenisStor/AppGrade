import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { categories } from '../../data/products'

const catalogCategories = [
  {
    id: 'smartphones',
    name: 'Смартфоны',
    description: 'iPhone, Samsung Galaxy',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone16pro-202409?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/smartphones',
  },
  {
    id: 'laptops',
    name: 'Ноутбуки',
    description: 'MacBook Pro, MacBook Air, iMac',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-pro-202410?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/laptops',
  },
  {
    id: 'tablets',
    name: 'Планшеты',
    description: 'iPad Pro, iPad Air, iPad',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-ipad-pro-202405?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/tablets',
  },
  {
    id: 'watches',
    name: 'Умные часы',
    description: 'Apple Watch, Samsung Watch',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-watch-s9-702702202309?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/watches',
  },
  {
    id: 'headphones',
    name: 'Наушники',
    description: 'AirPods, Galaxy Buds',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-card-40-airpods-pro-202409?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/headphones',
  },
  {
    id: 'hairdryers',
    name: 'Фены',
    description: 'Dyson Supersonic',
    image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/332966-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
    href: '/catalog/hairdryers',
  },
  {
    id: 'stylers',
    name: 'Стайлеры',
    description: 'Dyson Airwrap, Corrale',
    image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/400714-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
    href: '/catalog/stylers',
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    description: 'Чехлы, зарядки, кабели',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/accessories-card-40-202409?wid=680&hei=528&fmt=png-alpha',
    href: '/catalog/accessories',
  },
  {
    id: 'gaming',
    name: 'Игровые консоли',
    description: 'PlayStation 5, DualSense',
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
    href: '/catalog/gaming',
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
        {catalogCategories.map((category) => (
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
            <div className="hidden lg:block relative bg-gray-light overflow-hidden aspect-[4/3] transition-all duration-300 hover:shadow-liquid">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
