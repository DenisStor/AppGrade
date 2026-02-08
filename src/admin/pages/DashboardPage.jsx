import { Package, FolderTree, MessageSquare, FileText, Image, Bell } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import StatusBadge from '../components/StatusBadge'

const TYPE_LABELS = { order: 'Заказ', quick_buy: 'Быстрый заказ', repair: 'Ремонт', contact: 'Обратная связь' }

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data, loading } = useQuery('/dashboard/stats')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Товаров" value={data?.products || 0} color="bg-blue-500" />
        <StatCard icon={FolderTree} label="Категорий" value={data?.categories || 0} color="bg-green-500" />
        <StatCard icon={MessageSquare} label="Заявок" value={data?.requests || 0} color="bg-purple-500" />
        <StatCard icon={Bell} label="Новых заявок" value={data?.newRequests || 0} color="bg-red-500" />
        <StatCard icon={FileText} label="Статей" value={data?.blogPosts || 0} color="bg-orange-500" />
        <StatCard icon={Image} label="Баннеров" value={data?.banners || 0} color="bg-cyan-500" />
      </div>

      {data?.recentRequests?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Последние заявки</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recentRequests.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{r.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{r.phone}</span>
                  {r.product_name && (
                    <span className="text-sm text-gray-400 ml-2">{r.product_name}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{TYPE_LABELS[r.type] || r.type}</span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
