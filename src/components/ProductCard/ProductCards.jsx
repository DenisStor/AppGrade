import buPhoto from '../../assets/bu-photo.png'
import servicePhoto from '../../assets/service-photo.png'
import { Button } from '../ui/Button'

export function ProductCards() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-4 lg:mx-8 border-t border-gray-300 mb-8" />
      <div className="px-4 md:px-6 mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">Не спешите покупать новое</h2>
        <p className="text-gray-medium mt-2">Ремонт за час или проверенное б/у с гарантией</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 px-4 md:px-6">
        {/* Проверенное б/у */}
        <div className="group aspect-[2/1] relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <img
            src={buPhoto}
            alt="Проверенное б/у"
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold">Проверенное б/у</h3>
            <p className="text-xl lg:text-2xl mt-2">от 15 990 ₽</p>
            <Button variant="outline-white" className="mt-4">
              Смотреть каталог
            </Button>
          </div>
        </div>
        {/* Сервис */}
        <div className="group aspect-[2/1] relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
          <img
            src={servicePhoto}
            alt="Сервис"
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold">Сервис</h3>
            <p className="text-xl lg:text-2xl mt-2">от 990 ₽</p>
            <Button variant="outline-white" className="mt-4">
              Подробнее
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
