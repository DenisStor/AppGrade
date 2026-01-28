import { Button } from '../ui/Button'

export function FooterSubscribe() {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-dark mb-4">Подписка на новости</h3>
      <p className="text-gray-medium mb-4">
        Получайте информацию о скидках и новинках первыми
      </p>
      <form className="flex gap-2">
        <input
          type="email"
          placeholder="Ваш email"
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-full text-gray-dark placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <Button variant="primary" size="md">
          OK
        </Button>
      </form>
    </div>
  )
}
