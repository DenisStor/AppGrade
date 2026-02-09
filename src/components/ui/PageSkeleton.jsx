import { Skeleton } from './Skeleton'
import { PageLayout } from '../../layouts/PageLayout'

// Обратная совместимость — generic скелет каталога
export function PageSkeleton() {
  return (
    <div className="section-padding py-6 lg:py-10 min-h-screen">
      <Skeleton className="h-4 w-48 mb-6" />
      <Skeleton className="h-8 w-64 mb-8" />
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

export function ServicePageSkeleton() {
  return (
    <PageLayout>
      <div className="section-padding py-6 lg:py-10">
        {/* Hero */}
        <Skeleton className="w-full h-[400px] lg:h-[560px] rounded-card mb-10" />
        {/* Intro — 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-10">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-64 lg:h-80 rounded-card" />
        </div>
        {/* Pricing table */}
        <Skeleton className="h-8 w-56 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export function CartPageSkeleton() {
  return (
    <PageLayout>
      <div className="section-padding py-6 lg:py-10">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Товары */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-card liquid-glass">
                <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
          {/* Sidebar */}
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-card" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function SearchPageSkeleton() {
  return (
    <PageLayout>
      <div className="section-padding py-6 lg:py-10">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export function UsedPageSkeleton() {
  return (
    <PageLayout>
      <div className="section-padding py-6 lg:py-10">
        <Skeleton className="h-4 w-48 mb-6" />
        {/* Hero banner */}
        <Skeleton className="w-full h-40 lg:h-56 rounded-card mb-8" />
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <div className="hidden lg:block w-64 shrink-0 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
          {/* Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function BlogPageSkeleton() {
  return (
    <PageLayout>
      <div className="section-padding py-6 lg:py-10">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/1] rounded-card" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export function AboutPageSkeleton() {
  return (
    <PageLayout>
      <div className="section-padding py-6 lg:py-10">
        <Skeleton className="h-4 w-48 mb-6" />
        {/* 2 колонки: текст + фото */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-16">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-64 lg:h-full rounded-card" />
        </div>
        {/* 4 feature-карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="liquid-glass rounded-card p-5 lg:p-6 space-y-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
