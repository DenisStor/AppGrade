import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { blogService } from '../services/blogService'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function BlogListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { data, loading, refetch } = useQuery(`/blog?page=${page}&limit=30`, [page])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await blogService.remove(deleteId)
      toast.success('Статья удалена')
      setDeleteId(null)
      refetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'title', label: 'Заголовок', sortable: true, render: (v, row) => (
      <div>
        <p className="font-medium text-gray-900">{v}</p>
        <p className="text-xs text-gray-400">/{row.slug}</p>
      </div>
    )},
    { key: 'status', label: 'Статус', width: '120px', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Создана', width: '110px', sortable: true, render: (v) =>
      v ? new Date(v).toLocaleDateString('ru') : '—'
    },
    { key: 'actions', label: '', width: '50px', render: (_, row) => (
      <button onClick={(e) => { e.stopPropagation(); setDeleteId(row.id) }} className="p-1 hover:bg-gray-100 rounded">
        <Trash2 size={14} className="text-red-500" />
      </button>
    )},
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Блог</h1>
        <Link to="/admin/blog/new" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Новая статья
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          total={data?.total}
          page={page}
          limit={30}
          onPageChange={setPage}
          onRowClick={(row) => navigate(`/admin/blog/${row.id}`)}
          emptyMessage="Нет статей"
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить статью?"
        message="Статья будет удалена безвозвратно."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
