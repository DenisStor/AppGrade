import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, Check } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { Skeleton } from '../../components/ui/Skeleton'
import { Badge, BadgeGroup } from '../../components/ui/Badge'
import { Tabs } from '../../components/ui/Tabs'
import { ProductGallery } from '../../components/product/ProductGallery'
import { ProductConfig } from '../../components/product/ProductConfig'
import { ProductActions } from '../../components/product/ProductActions'
import { ProductBenefits } from '../../components/product/ProductBenefits'
import { QuickBuyModal } from '../../components/product/QuickBuyModal'
import { RelatedProducts } from '../../components/product/RelatedProducts'
import { RecentlyViewed } from '../../components/product/RecentlyViewed'
import { ProductJsonLd, BreadcrumbJsonLd } from '../../components/seo/JsonLd'
import { catalogApi } from '../../services/catalogApi'
import { useCatalogQuery } from '../../hooks/useCatalogQuery'
import { mapProduct } from '../../services/productMapper'
import { formatPrice, formatMemory } from '../../utils/product'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
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

  const { toggleItem, isFavorite } = useFavoritesStore()
  const { addItem } = useRecentlyViewedStore()
  const { addItem: addToCart, isInCart } = useCartStore()

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)

  const {
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
  } = useProductVariant(product)

  useEffect(() => {
    if (product) addItem(product.id)
  }, [product, addItem])

  const pageTitle = useMemo(() => {
    if (!product || !currentVariant) return null
    const memoryPart = currentVariant.memory ? ` ${formatMemory(currentVariant.memory)}` : ''
    return `${product.name}${memoryPart} — купить в APPGRADE`
  }, [product, currentVariant])
  usePageTitle(pageTitle)

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

  const discount = currentVariant?.oldPrice
    ? Math.round((1 - currentVariant.price / currentVariant.oldPrice) * 100)
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
        <ProductGallery images={currentVariant?.images || []} productName={product.name} />

        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <BadgeGroup badges={product.badges} className="mb-2" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
                {product.name}
                {currentVariant && (
                  <span className="block font-normal whitespace-nowrap">
                    ({currentVariant.color.name})
                  </span>
                )}
              </h1>
              <p className="text-gray-medium mt-1">{product.shortDescription}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleItem(product.id)}
                className={`p-3 rounded-full transition-colors ${
                  isFavorite(product.id)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-100 text-gray-dark hover:bg-gray-200'
                }`}
                aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'В избранное'}
              >
                <Heart className="w-5 h-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
              </button>
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
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-dark">
                {currentVariant ? formatPrice(currentVariant.price) : '—'}
              </span>
              {currentVariant?.oldPrice && (
                <>
                  <span className="text-lg text-gray-medium line-through">
                    {formatPrice(currentVariant.oldPrice)}
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
              <p className="text-gray-medium text-sm mt-1">Под заказ</p>
            )}
          </div>

          <ProductConfig
            product={product}
            colors={colors}
            memoryOptions={memoryOptions}
            selectedColor={selectedColor}
            selectedMemory={selectedMemory}
            selectedSim={selectedSim}
            onColorChange={setSelectedColor}
            onMemoryChange={setSelectedMemory}
            onSimChange={setSelectedSim}
            availableMemoryForColor={availableMemoryForColor}
          />

          <ProductActions
            product={product}
            currentVariant={currentVariant}
            selectedSim={selectedSim}
            isInCart={isInCart}
            onAddToCart={addToCart}
            onQuickBuy={() => setIsQuickBuyOpen(true)}
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
    </div>
  )
}
