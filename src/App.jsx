import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast'
import Home from './pages/Home'
// Layouts
import CatalogLayout from './layouts/CatalogLayout'
// Каталог (новый)
import CategoryPage from './pages/catalog/CategoryPage'
import ProductPage from './pages/catalog/ProductPage'
// Каталог (старые страницы для совместимости)
import IPhonePage from './pages/catalog/IPhonePage'
import MacPage from './pages/catalog/MacPage'
import IPadPage from './pages/catalog/IPadPage'
import WatchPage from './pages/catalog/WatchPage'
import AirPodsPage from './pages/catalog/AirPodsPage'
import AccessoriesPage from './pages/catalog/AccessoriesPage'
import VisionPage from './pages/catalog/VisionPage'
import UsedPage from './pages/catalog/UsedPage'
import CatalogPage from './pages/catalog/CatalogPage'
// Поиск
import SearchPage from './pages/SearchPage'
// Информационные
import DeliveryPage from './pages/info/DeliveryPage'
import WarrantyPage from './pages/info/WarrantyPage'
import ContactsPage from './pages/info/ContactsPage'
import AboutPage from './pages/info/AboutPage'
import ReturnsPage from './pages/info/ReturnsPage'
import ServicePage from './pages/info/ServicePage'
import FaqPage from './pages/info/FaqPage'
import TradeInPage from './pages/info/TradeInPage'
import CreditPage from './pages/info/CreditPage'
import PrivacyPage from './pages/info/PrivacyPage'
import TermsPage from './pages/info/TermsPage'
import BlogPage from './pages/info/BlogPage'
import BlogPostPage from './pages/info/BlogPostPage'
// Корзина
import CartPage from './pages/cart/CartPage'

function App() {
  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Новый каталог */}
      <Route path="/catalog" element={<CatalogLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path=":category" element={<CategoryPage />} />
        <Route path=":category/:slug" element={<ProductPage />} />
      </Route>

      {/* Поиск */}
      <Route path="/search" element={<SearchPage />} />

      {/* Корзина */}
      <Route path="/cart" element={<CartPage />} />

      {/* Редиректы со старых URL на новые категории */}
      <Route path="/iphone" element={<Navigate to="/catalog/smartphones" replace />} />
      <Route path="/mac" element={<Navigate to="/catalog/laptops" replace />} />
      <Route path="/ipad" element={<Navigate to="/catalog/tablets" replace />} />
      <Route path="/watch" element={<Navigate to="/catalog/watches" replace />} />
      <Route path="/airpods" element={<Navigate to="/catalog/headphones" replace />} />
      <Route path="/accessories" element={<Navigate to="/catalog/accessories" replace />} />
      <Route path="/vision" element={<Navigate to="/catalog/accessories" replace />} />
      <Route path="/used" element={<Navigate to="/catalog/smartphones" replace />} />
      <Route path="/samsung" element={<Navigate to="/catalog/smartphones" replace />} />
      <Route path="/dyson" element={<Navigate to="/catalog/hairdryers" replace />} />
      {/* Редиректы со старых URL каталога */}
      <Route path="/catalog/iphone" element={<Navigate to="/catalog/smartphones" replace />} />
      <Route path="/catalog/mac" element={<Navigate to="/catalog/laptops" replace />} />
      <Route path="/catalog/ipad" element={<Navigate to="/catalog/tablets" replace />} />
      <Route path="/catalog/watch" element={<Navigate to="/catalog/watches" replace />} />
      <Route path="/catalog/airpods" element={<Navigate to="/catalog/headphones" replace />} />
      <Route path="/catalog/samsung" element={<Navigate to="/catalog/smartphones" replace />} />
      <Route path="/catalog/dyson" element={<Navigate to="/catalog/hairdryers" replace />} />
      <Route path="/catalog/vision" element={<Navigate to="/catalog/accessories" replace />} />

      {/* Информационные */}
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/warranty" element={<WarrantyPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/returns" element={<ReturnsPage />} />
      <Route path="/service" element={<ServicePage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/trade-in" element={<TradeInPage />} />
      <Route path="/credit" element={<CreditPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogPostPage />} />
    </Routes>
    </>
  )
}

export default App
