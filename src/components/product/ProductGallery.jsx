import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Zoom } from 'swiper/modules'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'swiper/css/zoom'

export function ProductGallery({ images = [], productName = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-light rounded-2xl flex items-center justify-center">
        <span className="text-gray-medium">Нет изображения</span>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="aspect-square bg-gray-light rounded-2xl overflow-hidden">
        <ImageWithSkeleton
          src={images[0]}
          alt={productName}
          className="w-full h-full object-contain p-8"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Основной слайдер */}
      <Swiper
        modules={[Thumbs, Zoom]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        zoom={true}
        className="aspect-square bg-gray-light rounded-2xl overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-zoom-container w-full h-full flex items-center justify-center p-8">
              <ImageWithSkeleton
                src={src}
                alt={`${productName} — фото ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Миниатюры */}
      <Swiper
        modules={[Thumbs, FreeMode]}
        onSwiper={setThumbsSwiper}
        spaceBetween={12}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        className="product-thumbs"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-square bg-gray-light rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-gray-300 [.swiper-slide-thumb-active_&]:ring-2 [.swiper-slide-thumb-active_&]:ring-gray-dark">
              <ImageWithSkeleton
                src={src}
                alt={`Миниатюра ${index + 1}`}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
