import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { categoryService } from '../services/categoryService'
import SortableList from '../components/SortableList'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const { data: categories, loading, refetch } = useQuery('/categories')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleReorder = async (newItems) => {
    try {
      await categoryService.reorder(newItems.map(i => i.id))
      refetch()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const toggleActive = async (cat) => {
    try {
      await categoryService.update(cat.id, { active: cat.active ? 0 : 1 })
      refetch()
      toast.success(cat.active ? 'Категория скрыта' : 'Категория активирована')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await categoryService.remove(deleteId)
      toast.success('Категория удалена')
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
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <Link to="/admin/categories/new" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Добавить
        </Link>
      </div>

      {categories?.length ? (
        <SortableList
          items={categories}
          onReorder={handleReorder}
          renderItem={(cat) => (
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400">/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(cat)} className="p-1.5 hover:bg-gray-100 rounded">
                  {cat.active ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}
                </button>
                <Link to={`/admin/categories/${cat.id}`} className="p-1.5 hover:bg-gray-100 rounded">
                  <Pencil size={16} className="text-gray-500" />
                </Link>
                <button onClick={() => setDeleteId(cat.id)} className="p-1.5 hover:bg-gray-100 rounded">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          )}
        />
      ) : (
        <div className="text-center py-12 text-gray-400">Нет категорий</div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить категорию?"
        message="Нельзя удалить категорию, если в ней есть товары."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
