import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { serviceService } from '../services/serviceService'
import SortableList from '../components/SortableList'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function ServicesPage() {
  const { data: services, loading, refetch } = useQuery('/services')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleReorder = async (newItems) => {
    try {
      await serviceService.reorder(newItems.map(i => i.id))
      refetch()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const toggleActive = async (service) => {
    try {
      await serviceService.update(service.id, { active: service.active ? 0 : 1 })
      refetch()
      toast.success(service.active ? 'Услуга скрыта' : 'Услуга активирована')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await serviceService.remove(deleteId)
      toast.success('Услуга удалена')
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
        <h1 className="text-2xl font-bold text-gray-900">Услуги ремонта</h1>
        <Link to="/admin/services/new" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Добавить
        </Link>
      </div>

      {services?.length ? (
        <SortableList
          items={services}
          onReorder={handleReorder}
          renderItem={(service) => (
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                <p className="text-xs text-gray-400">{service.time} · {service.prices?.length || 0} цен</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(service)} className="p-1.5 hover:bg-gray-100 rounded" title={service.active ? 'Скрыть' : 'Показать'}>
                  {service.active ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}
                </button>
                <Link to={`/admin/services/${service.id}`} className="p-1.5 hover:bg-gray-100 rounded">
                  <Pencil size={16} className="text-gray-500" />
                </Link>
                <button onClick={() => setDeleteId(service.id)} className="p-1.5 hover:bg-gray-100 rounded">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="text-center py-12 text-gray-400">Нет услуг</div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить услугу?"
        message="Услуга и все её цены будут удалены безвозвратно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
