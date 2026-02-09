import { useState, useRef, useEffect, useCallback } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeader } from '../ui/SectionHeader'
import { SERVICE_PRICING, IPHONE_MODELS } from '../../data/service'

export function ServicePricing() {
  const [selectedModel, setSelectedModel] = useState('all')
  const [servicePricing, setServicePricing] = useState(SERVICE_PRICING)
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    fetch('/api/public/services')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const mapped = data.map(s => ({
          id: s.id,
          name: s.name,
          time: s.time,
          prices: (s.prices || []).reduce((acc, p) => {
            acc[p.model_id] = p.price
            return acc
          }, {}),
        }))
        if (mapped.length) setServicePricing(mapped)
      })
      .catch(() => {})
  }, [])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * 250, behavior: 'smooth' })
  }

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

        <div className="relative mb-8">
          {canScrollLeft && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-light to-transparent z-10 pointer-events-none" />
              <button
                onClick={() => scroll(-1)}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-dark" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide"
          >
            <div className="inline-flex bg-gray-200/70 rounded-full p-1 gap-1">
              {IPHONE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${selectedModel === model.id ? 'bg-gray-dark text-white shadow-sm' : 'text-gray-medium hover:text-gray-dark'}`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>
          {canScrollRight && (
            <>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-light to-transparent z-10 pointer-events-none" />
              <button
                onClick={() => scroll(1)}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-dark" />
              </button>
            </>
          )}
        </div>

        {/* Таблица цен */}
        <div className="bg-white overflow-hidden rounded-3xl">
          <div className="divide-y divide-gray-100">
            {servicePricing.map((service) => {
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
