import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Share2, Check, Clock } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Skeleton } from '../../components/ui/Skeleton'
import { Badge, BadgeGroup } from '../../components/ui/Badge'
import { Tabs } from '../../components/ui/Tabs'
import { ProductGallery } from '../../components/product/ProductGallery'
import { ProductConfig } from '../../components/product/ProductConfig'
import { ProductActions } from '../../components/product/ProductActions'
import { ProductBenefits } from '../../components/product/ProductBenefits'
import { QuickBuyModal } from '../../components/product/QuickBuyModal'
import { NotifyModal } from '../../components/product/NotifyModal'
import { RelatedProducts } from '../../components/product/RelatedProducts'
import { RecentlyViewed } from '../../components/product/RecentlyViewed'
import { ProductJsonLd, BreadcrumbJsonLd } from '../../components/seo/JsonLd'
import { catalogApi } from '../../services/catalogApi'
import { useCatalogQuery } from '../../hooks/useCatalogQuery'
import { mapProduct } from '../../services/productMapper'
import { formatPrice } from '../../utils/product'

import { useRecentlyViewedStore } from '../../stores/useRecentlyViewedStore'
import { useCartStore } from '../../stores/useCartStore'
import { useProductVariant } from '../../hooks/useProductVariant'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ProductPage() {
  const { category, brand, slug } = useParams()

  const { data: rawProduct, loading } = useCatalogQuery(
    () => catalogApi.getProduct(slug),
    [slug]
  )

  const product = useMemo(() => mapProduct(rawProduct), [rawProduct])

  const { addItem } = useRecentlyViewedStore()
  const { addItem: addToCart, isInCart } = useCartStore()

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)

  const {
    selections,
    setSelection,
    dimensions,
    getOptionsForDimension,
    selectedColor,
    selectedMemory,
    selectedSim,
    setSelectedColor,
    setSelectedMemory,
    setSelectedSim,
    currentVariant,
    colors,
    memoryOptions,
    availableMemoryForColor,
    availableSimsForSelection,
    getOptionAvailability,
  } = useProductVariant(product)

  useEffect(() => {
    if (product) addItem(product.id)
  }, [product, addItem])

  const pageTitle = useMemo(() => {
    if (!product || !currentVariant) return null
    const attrs = currentVariant.attributes || {}
    const nonColorParts = Object.entries(attrs)
      .filter(([key]) => key !== 'color')
      .map(([, val]) => val.name)
      .filter(Boolean)
    const suffix = nonColorParts.length ? ` ${nonColorParts.join(' ')}` : ''
    return `${product.name}${suffix} — купить в APPGRADE`
  }, [product, currentVariant])
  usePageTitle(pageTitle)

  const galleryImages = useMemo(() => {
    if (!currentVariant || !product) return []
    if (currentVariant.images?.length) return currentVariant.images
    const colorId = currentVariant.color?.id || currentVariant.attributes?.color?.id
    if (!colorId) return []
    const sameColorVariant = product.variants.find(v =>
      (v.color?.id === colorId || v.attributes?.color?.id === colorId) && v.images?.length
    )
    return sameColorVariant?.images || []
  }, [product, currentVariant])

  if (loading) {
    return (
      <div className="section-padding py-6 lg:py-10">
        <Skeleton className="h-6 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-dark mb-4">Товар не найден</h1>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: product.categoryName || category, href: `/catalog/${category}` },
    { label: product.brand || brand, href: `/catalog/${category}/${brand}` },
    { label: product.name },
  ]

  const displayPrice = currentVariant ? currentVariant.price : null
  const displayOldPrice = currentVariant?.oldPrice || null

  const discount = displayOldPrice
    ? Math.round((1 - displayPrice / displayOldPrice) * 100)
    : 0

  const tabs = [
    {
      id: 'description',
      label: 'Описание',
      content: <p className="text-gray-dark leading-relaxed">{product.description}</p>,
    },
    {
      id: 'specs',
      label: 'Характеристики',
      content: (
        <div className="space-y-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-medium capitalize">{key}</span>
              <span className="text-gray-dark font-medium">{value}</span>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="section-padding py-6 lg:py-10">
      <ProductJsonLd product={product} variant={currentVariant} category={category} brand={brand} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={galleryImages} productName={product.name} category={category} />

        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <BadgeGroup badges={product.badges} className="mb-2" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
                {product.name}
                {currentVariant?.attributes?.color?.name && (
                  <span className="block font-normal whitespace-nowrap">
                    ({currentVariant.attributes.color.name})
                  </span>
                )}
              </h1>
              <p className="text-gray-medium mt-1">{product.shortDescription}</p>
            </div>
            {navigator.share && (
              <button
                onClick={() => navigator.share({ url: window.location.href, title: product.name })}
                className="p-3 rounded-full bg-gray-100 text-gray-dark hover:bg-gray-200 transition-colors"
                aria-label="Поделиться"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mb-6" key={currentVariant?.id}>
            <div className="flex items-baseline gap-3 animate-fade-in">
              <span className="text-3xl font-bold text-gray-dark">
                {displayPrice ? formatPrice(displayPrice) : '—'}
              </span>
              {displayOldPrice && (
                <>
                  <span className="text-lg text-gray-medium line-through">
                    {formatPrice(displayOldPrice)}
                  </span>
                  <Badge variant="discount" label={`-${discount}%`} />
                </>
              )}
            </div>
            {currentVariant?.inStock ? (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                В наличии
              </p>
            ) : (
              <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Под заказ
              </p>
            )}
          </div>

          <ProductConfig
            product={product}
            dimensions={dimensions}
            selections={selections}
            onSelectionChange={setSelection}
            getOptionsForDimension={getOptionsForDimension}
            getOptionAvailability={getOptionAvailability}
            colors={colors}
            memoryOptions={memoryOptions}
            selectedColor={selectedColor}
            selectedMemory={selectedMemory}
            selectedSim={selectedSim}
            onColorChange={setSelectedColor}
            onMemoryChange={setSelectedMemory}
            onSimChange={setSelectedSim}
            availableMemoryForColor={availableMemoryForColor}
            availableSimsForSelection={availableSimsForSelection}
          />

          <ProductActions
            product={product}
            currentVariant={currentVariant}
            isInCart={isInCart}
            onAddToCart={addToCart}
            onQuickBuy={() => setIsQuickBuyOpen(true)}
            onNotify={() => setIsNotifyOpen(true)}
          />

          <ProductBenefits />
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        <Tabs tabs={tabs} defaultTab="description" />
      </div>

      <RelatedProducts
        relatedProducts={product._relatedProducts}
        className="mt-12 lg:mt-16"
      />
      <RecentlyViewed currentProductId={product.id} className="mt-12 lg:mt-16" />

      <QuickBuyModal isOpen={isQuickBuyOpen} onClose={() => setIsQuickBuyOpen(false)} product={product} variant={currentVariant} />
      <NotifyModal isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} product={product} variant={currentVariant} />
    </div>
  )
}
