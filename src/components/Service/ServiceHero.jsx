import { ImageWithSkeleton } from '../ui/ImageWithSkeleton'
import servicePhoto from '../../assets/service-hero.jpg'

export function ServiceHero() {
  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithSkeleton
          src={servicePhoto}
          alt="APPGRADE Service"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  )
}
