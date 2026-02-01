import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { SectionHeader } from '../ui/SectionHeader'
import { CategoryCard } from './CategoryCard'
import { categories } from '../../data/categories'

export function Categories() {
  return (
    <section className="pt-14 md:pt-20">
      <div className="section-padding mb-10">
        <SectionHeader
          title="Лучшие устройства в одном магазине"
          subtitle="Выберите нужную категорию"
          linkText="Смотреть все категории"
          linkHref="/iphone"
        />
      </div>
      <div className="overflow-hidden">
        <Swiper
          spaceBetween={12}
          slidesPerView="auto"
          breakpoints={{
            375: { spaceBetween: 16 },
            768: { spaceBetween: 20 },
            1024: { spaceBetween: 24 },
          }}
          className="!pl-6 lg:!pl-60 !pr-6 lg:!pr-60"
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
