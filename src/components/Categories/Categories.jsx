import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { SectionHeader } from '../ui/SectionHeader'
import { CategoryCard } from './CategoryCard'
import { categories } from '../../data/categories'

function CtaCard() {
  return (
    <Link
      to="/catalog"
      className="group block w-[220px] xs:w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]"
    >
      <div className="aspect-[0.7] overflow-hidden bg-gray-light rounded-3xl flex flex-col items-center justify-center p-6">
        <span className="text-2xl md:text-3xl font-bold text-gray-dark leading-tight text-center">
          Смотреть весь каталог{' '}
          <span className="inline-flex align-middle w-8 h-8 rounded-full bg-gray-dark text-white items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
        </span>
      </div>
    </Link>
  )
}

export function Categories() {
  return (
    <section className="pt-14 md:pt-20">
      <div className="section-padding mb-10">
        <SectionHeader
          title="Лучшие устройства в одном магазине"
          subtitle="Выберите нужную категорию"
          subtitleClassName="hidden sm:block"
          linkText="Смотреть все категории"
          linkHref="/catalog"
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
          <SwiperSlide style={{ width: 'auto' }}>
            <CtaCard />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  )
}
