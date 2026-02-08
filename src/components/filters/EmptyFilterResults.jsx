export function EmptyFilterResults({ onReset }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-medium mb-4">Товары не найдены</p>
      <button onClick={onReset} className="text-blue-500 hover:underline">
        Сбросить фильтры
      </button>
    </div>
  )
}
