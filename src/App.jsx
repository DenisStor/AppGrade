import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
// Каталог
import IPhonePage from './pages/catalog/IPhonePage'
import MacPage from './pages/catalog/MacPage'
import IPadPage from './pages/catalog/IPadPage'
import WatchPage from './pages/catalog/WatchPage'
import AirPodsPage from './pages/catalog/AirPodsPage'
import AccessoriesPage from './pages/catalog/AccessoriesPage'
import VisionPage from './pages/catalog/VisionPage'
import UsedPage from './pages/catalog/UsedPage'
import CatalogPage from './pages/catalog/CatalogPage'
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Каталог */}
      <Route path="/iphone" element={<IPhonePage />} />
      <Route path="/mac" element={<MacPage />} />
      <Route path="/ipad" element={<IPadPage />} />
      <Route path="/watch" element={<WatchPage />} />
      <Route path="/airpods" element={<AirPodsPage />} />
      <Route path="/accessories" element={<AccessoriesPage />} />
      <Route path="/vision" element={<VisionPage />} />
      <Route path="/used" element={<UsedPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
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
  )
}

export default App
