import { Skeleton } from './Skeleton'

export function PageSkeleton() {
  return (
    <div className="section-padding py-6 lg:py-10 min-h-screen">
      {/* Breadcrumbs */}
      <Skeleton className="h-4 w-48 mb-6" />

      {/* Title */}
      <Skeleton className="h-8 w-64 mb-8" />

      {/* Content grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
