import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AdminHeader({ onMenuToggle }) {
  const { user, signOut } = useAuth()

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={20} />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    </header>
  )
}
