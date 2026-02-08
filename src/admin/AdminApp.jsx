import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import AdminLayout from './AdminLayout'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const BannersPage = lazy(() => import('./pages/BannersPage'))
const BannerEditPage = lazy(() => import('./pages/BannerEditPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const CategoryEditPage = lazy(() => import('./pages/CategoryEditPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductEditPage = lazy(() => import('./pages/ProductEditPage'))
const RequestsPage = lazy(() => import('./pages/RequestsPage'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogEditPage = lazy(() => import('./pages/BlogEditPage'))

function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  )
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="banners" element={<BannersPage />} />
            <Route path="banners/new" element={<BannerEditPage />} />
            <Route path="banners/:id" element={<BannerEditPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/new" element={<CategoryEditPage />} />
            <Route path="categories/:id" element={<CategoryEditPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductEditPage />} />
            <Route path="products/:id" element={<ProductEditPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/new" element={<BlogEditPage />} />
            <Route path="blog/:id" element={<BlogEditPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
