import { Link } from 'react-router-dom'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import buPhoto from '../../assets/bu-devices.png'
import servicePhoto from '../../assets/service-photo.png'
import { Button } from '../ui/Button'

export function ProductCards() {
  return (
    <section className="pb-14 md:pb-20">
      <div className="mx-6 lg:mx-60 border-t border-gray-300 mt-14 md:mt-20 mb-14 md:mb-20" />
      <div className="px-6 lg:px-60 mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">Не спешите покупать новое</h2>
        <p className="text-gray-medium mt-2">Ремонт за час или проверенное б/у с гарантией</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 px-6 lg:px-60">
        {/* Проверенное б/у */}
        <Link to="/used" className="group aspect-[2/1] relative overflow-hidden rounded-card block">
          <ImageWithSkeleton
            src={buPhoto}
            alt="Проверенное б/у"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute bottom-5 left-5 text-white">
            <h3 className="text-xl lg:text-2xl font-bold">Проверенное б/у</h3>
            <p className="text-base lg:text-lg mt-1">от 15 990 ₽</p>
            <Button variant="outline-white" size="sm" className="mt-3">
              Смотреть каталог
            </Button>
          </div>
        </Link>
        {/* Сервис */}
        <Link to="/service" className="group aspect-[2/1] relative overflow-hidden rounded-card block">
          <ImageWithSkeleton
            src={servicePhoto}
            alt="Сервис"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute bottom-5 left-5 text-white">
            <h3 className="text-xl lg:text-2xl font-bold">Сервис</h3>
            <p className="text-base lg:text-lg mt-1">от 990 ₽</p>
            <Button variant="outline-white" size="sm" className="mt-3">
              Подробнее
            </Button>
          </div>
        </Link>
      </div>
    </section>
  )
}
