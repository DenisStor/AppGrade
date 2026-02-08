import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { bannerService } from '../services/bannerService'
import SortableList from '../components/SortableList'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function BannersPage() {
  const { data: banners, loading, refetch } = useQuery('/banners')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleReorder = async (newItems) => {
    try {
      await bannerService.reorder(newItems.map(i => i.id))
      refetch()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const toggleActive = async (banner) => {
    try {
      await bannerService.update(banner.id, { active: banner.active ? 0 : 1 })
      refetch()
      toast.success(banner.active ? 'Баннер скрыт' : 'Баннер активирован')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await bannerService.remove(deleteId)
      toast.success('Баннер удалён')
      setDeleteId(null)
      refetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Баннеры</h1>
        <Link to="/admin/banners/new" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Добавить
        </Link>
      </div>

      {banners?.length ? (
        <SortableList
          items={banners}
          onReorder={handleReorder}
          renderItem={(banner) => (
            <div className="flex items-center gap-4">
              <img src={banner.image_desktop} alt={banner.alt || ''} className="w-32 h-16 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{banner.title || 'Без названия'}</p>
                {banner.link && <p className="text-xs text-gray-400 truncate">{banner.link}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(banner)} className="p-1.5 hover:bg-gray-100 rounded" title={banner.active ? 'Скрыть' : 'Показать'}>
                  {banner.active ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}
                </button>
                <Link to={`/admin/banners/${banner.id}`} className="p-1.5 hover:bg-gray-100 rounded">
                  <Pencil size={16} className="text-gray-500" />
                </Link>
                <button onClick={() => setDeleteId(banner.id)} className="p-1.5 hover:bg-gray-100 rounded">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="text-center py-12 text-gray-400">Нет баннеров</div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить баннер?"
        message="Баннер будет удалён безвозвратно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
