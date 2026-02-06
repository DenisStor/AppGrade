import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton'
import {
  getCategoryBySlug,
  getBrandsByCategory,
  getProductsByCategoryAndBrand,
  getMinPrice,
  formatPrice,
  BRAND_DISPLAY_NAMES,
} from '../../data/products'
import { formatProductCount } from '../../utils/pluralize'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function CategoryPage() {
  const { category } = useParams()

  const categoryData = getCategoryBySlug(category)
  const brands = getBrandsByCategory(category)

  usePageTitle(categoryData?.seoTitle)

  useEffect(() => {
    if (categoryData) {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', categoryData.seoDescription)
      }
    }
  }, [categoryData])

  if (!categoryData) {
    return (
      <div className="section-padding py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-dark mb-4">Категория не найдена</h1>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Каталог', href: '/catalog' },
    { label: categoryData.name },
  ]

  return (
    <div className="section-padding py-6 lg:py-10">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-dark">
          {categoryData.name}
        </h1>
        <p className="text-gray-medium mt-2">{categoryData.description}</p>
      </div>

      {brands.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              category={category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-medium">В этой категории пока нет товаров</p>
        </div>
      )}
    </div>
  )
}

function BrandCard({ brand, category }) {
  const products = getProductsByCategoryAndBrand(category, brand.slug)
  const productCount = products.length
  const minPrice = products.length ? Math.min(...products.map(getMinPrice)) : 0

  const displayName = BRAND_DISPLAY_NAMES[`${brand.slug}-${category}`] || brand.name

  const flagship = products[0]
  const flagshipImage = flagship?.variants?.[0]?.images?.[0]
  return (
    <Link
      to={`/catalog/${category}/${brand.slug}`}
      className="group flex flex-col bg-white rounded-card border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="bg-gray-light aspect-[3/4] flex items-center justify-center p-6">
        {flagshipImage ? (
          <ImageWithSkeleton
            src={flagshipImage}
            alt={flagship.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package className="w-12 h-12 text-gray-300" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-dark tracking-tight">{displayName}</h3>
        <p className="text-sm text-gray-medium mt-1">
          {formatProductCount(productCount)}
        </p>
        {minPrice > 0 && (
          <p className="text-base font-semibold text-gray-dark mt-2">от {formatPrice(minPrice)}</p>
        )}
      </div>
    </Link>
  )
}
