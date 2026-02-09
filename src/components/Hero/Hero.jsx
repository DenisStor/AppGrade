import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { CAROUSEL } from '../../data/constants'
import 'swiper/css'
import 'swiper/css/pagination'

import heroDesktop from '../../assets/banners/hero-desktop.png'
import heroMobile from '../../assets/banners/hero-mobile.png'
import banner2Desktop from '../../assets/banners/banner-2-desktop.png'
import banner2Mobile from '../../assets/banners/banner-2-mobile.png'

// WebP версии (генерируются npm run optimize-assets)
// import.meta.glob eager: true возвращает {} если файлов нет — безопасно
const webpModules = import.meta.glob('../../assets/banners/*.webp', { eager: true, import: 'default' })
const webp = (name) => webpModules[`../../assets/banners/${name}.webp`] || null

const BANNERS = [
  {
    id: 1,
    imageDesktop: heroDesktop,
    imageMobile: heroMobile,
    imageDesktopWebp: webp('hero-desktop'),
    imageMobileWebp: webp('hero-mobile'),
    alt: 'iPhone 17 PRO MAX',
  },
  {
    id: 2,
    imageDesktop: banner2Desktop,
    imageMobile: banner2Mobile,
    imageDesktopWebp: webp('banner-2-desktop'),
    imageMobileWebp: webp('banner-2-mobile'),
    alt: 'Sony PlayStation 5',
  },
]

function HeroSkeleton() {
  return (
    <div className="w-full">
      <div className="hidden lg:block w-full aspect-[1920/600] animate-shimmer bg-gray-200 rounded-lg" />
      <div className="lg:hidden w-full aspect-[390/500] animate-shimmer bg-gray-200 rounded-lg" />
    </div>
  )
}

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section className="w-full">
      {!isLoaded && <HeroSkeleton />}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: CAROUSEL.AUTOPLAY_DELAY }}
        loop={BANNERS.length > 1}
        grabCursor={true}
        className={`w-full hero-swiper ${!isLoaded ? 'hidden' : ''}`}
        onInit={() => setIsLoaded(true)}
      >
        {BANNERS.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            {/* Desktop */}
            <picture>
              {banner.imageDesktopWebp && (
                <source srcSet={banner.imageDesktopWebp} type="image/webp" media="(min-width: 1024px)" />
              )}
              <img
                src={banner.imageDesktop}
                alt={banner.alt}
                className="hidden lg:block w-full h-auto"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </picture>
            {/* Mobile */}
            <picture>
              {banner.imageMobileWebp && (
                <source srcSet={banner.imageMobileWebp} type="image/webp" media="(max-width: 1023px)" />
              )}
              <img
                src={banner.imageMobile}
                alt={banner.alt}
                className="lg:hidden w-full h-auto"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
