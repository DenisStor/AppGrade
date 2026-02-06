import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton'
import {
  getCategoryBySlug,
  getBrandsByCategory,
  getProductsByCategoryAndBrand,
  getMinPrice,
  formatPrice,
} from '../../data/products'

export default function CategoryPage() {
  const { category } = useParams()

  const categoryData = getCategoryBySlug(category)
  const brands = getBrandsByCategory(category)

  // SEO
  useEffect(() => {
    if (categoryData) {
      document.title = categoryData.seoTitle
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              category={category}
              categoryName={categoryData.name}
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

function BrandCard({ brand, category, categoryName }) {
  const products = getProductsByCategoryAndBrand(category, brand.slug)
  const productCount = products.length

  // Минимальная цена среди всех товаров бренда
  const minPrice = products.length
    ? Math.min(...products.map(getMinPrice))
    : 0

  // Получаем первые 3 изображения товаров для превью
  const previewImages = products
    .slice(0, 3)
    .map((p) => p.variants?.[0]?.images?.[0])
    .filter(Boolean)

  return (
    <Link
      to={`/catalog/${category}/${brand.slug}`}
      className="group block bg-white p-6 rounded-card border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Превью товаров */}
      <div className="flex items-center justify-center gap-2 mb-6 h-32">
        {previewImages.length > 0 ? (
          previewImages.map((img, idx) => (
            <div
              key={idx}
              className="w-28 h-28 bg-gray-light rounded-xl flex items-center justify-center"
            >
              <ImageWithSkeleton
                src={img}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          ))
        ) : (
          <div className="w-28 h-28 bg-gray-light rounded-xl flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-black group-hover:text-gray-dark transition-colors">
            {brand.name}
          </h3>
          <p className="text-sm text-gray-medium mt-1">
            {productCount} {productCount === 1 ? 'товар' : productCount < 5 ? 'товара' : 'товаров'}
          </p>
          {minPrice > 0 && (
            <p className="text-sm font-medium text-gray-dark mt-1">
              от {formatPrice(minPrice)}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-medium group-hover:text-gray-dark transition-colors" />
      </div>
    </Link>
  )
}
