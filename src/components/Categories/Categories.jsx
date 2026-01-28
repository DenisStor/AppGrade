import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

import { CategoryCard } from './CategoryCard'
import { categories } from '../../data/categories'

export function Categories() {
  return (
    <section className="py-10 md:py-14">
      <div className="pl-4 lg:pl-8 mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">
          Лучшие устройства в одном магазине
        </h2>
        <p className="text-gray-medium mt-2">
          Выберите нужную категорию
        </p>
      </div>
      <div>
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          spaceBetween={12}
          slidesPerView="auto"
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          breakpoints={{
            1024: {
              slidesOffsetBefore: 32,
              slidesOffsetAfter: 32,
            },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} style={{ width: 'auto' }}>
              <CategoryCard {...category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
