import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { ToastContainer } from './components/ui/Toast'
import { PageSkeleton } from './components/ui/PageSkeleton'
import { REDIRECTS } from './data/redirects'
import Home from './pages/Home'
// Layouts
import CatalogLayout from './layouts/CatalogLayout'
// Каталог (синхронные — часто посещаемые)
import CatalogPage from './pages/catalog/CatalogPage'
import CategoryPage from './pages/catalog/CategoryPage'
import BrandPage from './pages/catalog/BrandPage'
import ProductPage from './pages/catalog/ProductPage'
// Информационные
import InfoPage from './pages/info/InfoPage'
import BlogPostPage from './pages/blog/BlogPostPage'
// Lazy-loaded страницы
const SearchPage = lazy(() => import('./pages/SearchPage'))
const CartPage = lazy(() => import('./pages/cart/CartPage'))
const ServicePage = lazy(() => import('./pages/service/ServicePage'))
const UsedPage = lazy(() => import('./pages/used/UsedPage'))
const BlogPage = lazy(() => import('./pages/blog/BlogPage'))
const AboutPage = lazy(() => import('./pages/info/AboutPage'))

function App() {
  return (
    <>
    <ScrollToTop />
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Каталог */}
      <Route path="/catalog" element={<CatalogLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path=":category" element={<CategoryPage />} />
        <Route path=":category/:brand" element={<BrandPage />} />
        <Route path=":category/:brand/:slug" element={<ProductPage />} />
      </Route>

      {/* Lazy-loaded страницы */}
      <Route path="/search" element={
        <Suspense fallback={<PageSkeleton />}>
          <SearchPage />
        </Suspense>
      } />
      <Route path="/cart" element={
        <Suspense fallback={<PageSkeleton />}>
          <CartPage />
        </Suspense>
      } />
      <Route path="/service" element={
        <Suspense fallback={<PageSkeleton />}>
          <ServicePage />
        </Suspense>
      } />
      <Route path="/used" element={
        <Suspense fallback={<PageSkeleton />}>
          <UsedPage />
        </Suspense>
      } />

      {/* Редиректы со старых URL */}
      {REDIRECTS.map(({ from, to }) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}

      {/* О компании */}
      <Route path="/about" element={
        <Suspense fallback={<PageSkeleton />}>
          <AboutPage />
        </Suspense>
      } />

      {/* Блог */}
      <Route path="/blog" element={
        <Suspense fallback={<PageSkeleton />}>
          <BlogPage />
        </Suspense>
      } />
      <Route path="/blog/:id" element={<BlogPostPage />} />

      {/* Информационные страницы */}
      <Route path="/:slug" element={<InfoPage />} />
    </Routes>
    </>
  )
}

export default App
