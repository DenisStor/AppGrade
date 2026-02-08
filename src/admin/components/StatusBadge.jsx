const styles = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  new: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-gray-100 text-gray-500',
  in_stock: 'bg-green-100 text-green-700',
  on_order: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-600',
}

const labels = {
  active: 'Активен',
  draft: 'Черновик',
  published: 'Опубликован',
  new: 'Новая',
  processing: 'В работе',
  closed: 'Закрыта',
  in_stock: 'В наличии',
  on_order: 'Под заказ',
  out_of_stock: 'Нет в наличии',
}

export default function StatusBadge({ status, label }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
      {label || labels[status] || status}
    </span>
  )
}
