import { Skeleton } from './Skeleton'

export function CardSkeleton() {
  return (
    <div className="rounded-liquid-lg p-8 bg-gray-100">
      <Skeleton variant="text" className="mb-2 w-1/4" />
      <Skeleton variant="title" className="mb-4" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton className="aspect-square rounded-xl mb-6" />
      <div className="flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
    </div>
  )
}
