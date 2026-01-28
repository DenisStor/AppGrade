import { Headphones, Truck, Shield } from 'lucide-react'

export function InfoBlocks() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-4 lg:mx-8 border-t border-gray-300 mb-8" />
      <div className="px-4 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-dark">
          Почему мы
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Клиентский сервис */}
          <div className="bg-gray-light border border-gray-200/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.01] transition-all duration-300 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Headphones size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
                  Клиентский сервис
                </h3>
                <p className="text-gray-medium">
                  Поддержка 24/7 для всех клиентов
                </p>
              </div>
            </div>
          </div>

          {/* Быстрая доставка */}
          <div className="bg-gray-light border border-gray-200/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.01] transition-all duration-300 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
                  Быстрая доставка
                </h3>
                <p className="text-gray-medium">
                  Доставим в день заказа по Москве
                </p>
              </div>
            </div>
          </div>

          {/* Оригинальная техника */}
          <div className="bg-gray-light border border-gray-200/50 shadow-glass hover:shadow-glass-hover hover:scale-[1.01] transition-all duration-300 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-dark mb-2">
                  Оригинальная техника
                </h3>
                <p className="text-gray-medium">
                  Только сертифицированные товары
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
