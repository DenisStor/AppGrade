import { useState } from 'react'
import { Skeleton } from './Skeleton'

export function ImageWithSkeleton({ src, alt, className = '', skeletonClassName = '' }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <Skeleton className={`absolute inset-0 ${skeletonClassName}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
