import { useState } from 'react'
import { Check } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Container } from '../ui/Container'
import { SectionHeader } from '../ui/SectionHeader'
import { SERVICE_PRICING, IPHONE_MODELS } from '../../data/service'

export function ServicePricing() {
  const [selectedModel, setSelectedModel] = useState('all')

  const getPrice = (service) => {
    if (service.prices[selectedModel]) {
      return service.prices[selectedModel]
    }
    return service.prices['all']
  }

  return (
    <section id="service-pricing" className="py-12 lg:py-20 bg-gray-light">
      <Container>
        <SectionHeader
          title="Прайс-лист"
          subtitle="Популярные услуги ремонта iPhone"
          className="mb-8"
        />
      </Container>

      {/* Карусель моделей — во всю ширину с левым отступом Container */}
      <div className="mb-6 overflow-x-clip" style={{ paddingLeft: 'max(1rem, calc((100% - 1200px) / 2 + 2rem))' }}>
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={10}
          grabCursor={true}
          className="!overflow-visible"
        >
          {IPHONE_MODELS.map((model) => (
            <SwiperSlide key={model.id} className="!w-[110px] !h-auto">
              <button
                onClick={() => setSelectedModel(model.id)}
                className={`flex flex-col items-center gap-1.5 p-3 transition-all w-full h-full ${
                  selectedModel === model.id
                    ? 'bg-white shadow-sm border border-gray-200'
                    : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                }`}
              >
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-xs font-medium text-gray-dark text-center leading-tight line-clamp-2">
                  {model.name}
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Container>
        {/* Таблица цен */}
        <div className="bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {SERVICE_PRICING.map((service) => {
              const price = getPrice(service)
              const isUnavailable = price === '—'

              return (
                <div
                  key={service.id}
                  className={`flex items-center justify-between p-5 transition-colors ${
                    isUnavailable ? 'opacity-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-dark">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <span className="text-gray-medium text-sm hidden sm:block">
                      {service.time}
                    </span>
                    <span
                      className={`font-bold min-w-[100px] ${
                        isUnavailable ? 'text-gray-400' : 'text-gray-dark'
                      }`}
                    >
                      {price}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-center text-gray-medium mt-6 text-sm">
          * Диагностика бесплатная и ни к чему не обязывает. Точную стоимость
          озвучим после осмотра устройства.
        </p>
      </Container>
    </section>
  )
}
