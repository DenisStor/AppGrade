import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast'
import { REDIRECTS } from './data/redirects'
import Home from './pages/Home'
// Layouts
import CatalogLayout from './layouts/CatalogLayout'
// Каталог
import CatalogPage from './pages/catalog/CatalogPage'
import CategoryPage from './pages/catalog/CategoryPage'
import BrandPage from './pages/catalog/BrandPage'
import ProductPage from './pages/catalog/ProductPage'
// Поиск
import SearchPage from './pages/SearchPage'
// Информационные
import InfoPage from './pages/info/InfoPage'
import BlogPostPage from './pages/info/BlogPostPage'
// Корзина
import CartPage from './pages/cart/CartPage'

function App() {
  return (
    <>
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

      {/* Поиск */}
      <Route path="/search" element={<SearchPage />} />

      {/* Корзина */}
      <Route path="/cart" element={<CartPage />} />

      {/* Редиректы со старых URL */}
      {REDIRECTS.map(({ from, to }) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}

      {/* Информационные страницы */}
      <Route path="/:slug" element={<InfoPage />} />
      <Route path="/blog/:id" element={<BlogPostPage />} />
    </Routes>
    </>
  )
}

export default App
