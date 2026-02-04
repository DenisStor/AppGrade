import { useState, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Zoom } from 'swiper/modules'
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'swiper/css/zoom'

const PLACEHOLDER_LABELS = ['Вид сбоку', 'Вид сзади', 'Экран'];
const MIN_IMAGES = 4;

export function ProductGallery({ images = [], productName = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const allImages = useMemo(() => {
    const result = [...images];
    let i = 0;
    while (result.length < MIN_IMAGES) {
      const label = PLACEHOLDER_LABELS[i++] || `Фото ${result.length + 1}`;
      result.push(`https://placehold.co/800x800/f5f5f7/86868b?text=${encodeURIComponent(label)}`);
    }
    return result;
  }, [images]);

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
      <Swiper
        modules={[Thumbs, Zoom]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        zoom={true}
        className="aspect-square bg-gray-light overflow-hidden"
      >
        {allImages.map((src, index) => (
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

      {/* Миниатюры снизу — минималистичный стиль */}
      <Swiper
        modules={[Thumbs, FreeMode]}
        onSwiper={setThumbsSwiper}
        direction="horizontal"
        spaceBetween={8}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
      >
        {allImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-square bg-gray-light overflow-hidden cursor-pointer border-2 border-transparent [.swiper-slide-thumb-active_&]:border-gray-300">
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
