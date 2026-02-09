import { useState } from 'react'
import { Skeleton } from './Skeleton'

export function ImageWithSkeleton({
  src,
  alt,
  className = '',
  skeletonClassName = '',
  loading = 'lazy',
  fetchPriority,
  sizes,
  widths,
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  const isUpload = typeof src === 'string' && src.startsWith('/uploads/')

  const srcSet = isUpload && widths?.length
    ? widths.map(w => `${src}?w=${w}&format=webp ${w}w`).join(', ')
    : undefined

  const webpSrc = isUpload && !src.endsWith('.webp')
    ? src.replace(/\.(png|jpe?g)$/i, '.webp')
    : undefined

  const imgProps = {
    alt,
    loading,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    onLoad: () => setIsLoaded(true),
    ...(fetchPriority && { fetchPriority }),
    ...(sizes && { sizes }),
  }

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <Skeleton className={`absolute inset-0 ${skeletonClassName}`} />
      )}
      {webpSrc || srcSet ? (
        <picture>
          {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
          {webpSrc && !srcSet && <source type="image/webp" srcSet={webpSrc} />}
          <img src={src} {...imgProps} />
        </picture>
      ) : (
        <img src={src} {...imgProps} />
      )}
    </div>
  )
}
