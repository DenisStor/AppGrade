import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Zoom } from 'swiper/modules'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'swiper/css/zoom'

export function ProductGallery({ images = [], productName = '', category = '' }) {
  const isHeadphones = category === 'headphones'
  const isTablet = category === 'tablets'
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-light rounded-2xl flex items-center justify-center">
        <span className="text-gray-medium">Нет изображения</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Основное изображение сверху */}
      <div className="relative aspect-square bg-gray-light overflow-hidden rounded-2xl">
        <Swiper
          modules={[Thumbs, Zoom]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          zoom={true}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} style={{ height: '100%', overflow: 'hidden' }}>
              <div
                className="swiper-zoom-container"
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
              >
                <img
                  src={src}
                  alt={`${productName} — фото ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transform: isHeadphones ? 'scale(1.3)' : isTablet ? 'scale(1.7)' : 'scale(2.1)' }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  {...(index === 0 ? { fetchPriority: 'high' } : {})}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Миниатюры снизу — минималистичный стиль */}
      {images.length > 1 && (
        <Swiper
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          direction="horizontal"
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-square bg-gray-light overflow-hidden rounded-lg cursor-pointer border-2 border-transparent [.swiper-slide-thumb-active_&]:border-gray-300">
                <ImageWithSkeleton
                  src={src}
                  alt={`Миниатюра ${index + 1}`}
                  className={`w-full h-full object-contain ${isHeadphones ? 'scale-110' : isTablet ? 'scale-[1.35]' : 'scale-150'}`}
                  sizes="100px"
                  widths={[200, 400]}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}
