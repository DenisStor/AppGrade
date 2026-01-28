import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import heroDesktop from '../../assets/banners/hero-desktop.png'
import heroMobile from '../../assets/banners/hero-mobile.png'
import banner2Desktop from '../../assets/banners/banner-2-desktop.png'
import banner2Mobile from '../../assets/banners/banner-2-mobile.png'

const BANNERS = [
  {
    id: 1,
    imageDesktop: heroDesktop,
    imageMobile: heroMobile,
    alt: 'iPhone 17 PRO MAX'
  },
  {
    id: 2,
    imageDesktop: banner2Desktop,
    imageMobile: banner2Mobile,
    alt: 'Sony PlayStation 5'
  },
]

export function Hero() {
  return (
    <section className="w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 20000 }}
        loop={BANNERS.length > 1}
        grabCursor={true}
        className="w-full hero-swiper"
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            {/* Desktop */}
            <img
              src={banner.imageDesktop}
              alt={banner.alt}
              className="hidden lg:block w-full h-auto"
            />
            {/* Mobile */}
            <img
              src={banner.imageMobile}
              alt={banner.alt}
              className="lg:hidden w-full h-auto"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
