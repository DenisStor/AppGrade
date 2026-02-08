import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Image, FolderTree, Package, MessageSquare, FileText, X } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { to: '/admin/banners', icon: Image, label: 'Баннеры' },
  { to: '/admin/categories', icon: FolderTree, label: 'Категории' },
  { to: '/admin/products', icon: Package, label: 'Товары' },
  { to: '/admin/requests', icon: MessageSquare, label: 'Заявки', badge: true },
  { to: '/admin/blog', icon: FileText, label: 'Блог' },
]

export default function AdminSidebar({ open, onClose }) {
  const { data: stats, refetch } = useQuery('/dashboard/stats')
  const newRequests = stats?.newRequests || 0

  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener('stats-updated', handler)
    return () => window.removeEventListener('stats-updated', handler)
  }, [refetch])

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">APPGRADE</span>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge && newRequests > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1.5">
                  {newRequests}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
