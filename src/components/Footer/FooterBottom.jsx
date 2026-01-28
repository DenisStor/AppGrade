export function FooterBottom() {
  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-medium text-sm">
          © 2024 APPGRADE. Все права защищены.
        </p>
        <div className="flex items-center gap-6 text-sm">
          <a href="/privacy" className="text-gray-medium hover:text-gray-dark transition-colors">
            Политика конфиденциальности
          </a>
          <a href="/terms" className="text-gray-medium hover:text-gray-dark transition-colors">
            Пользовательское соглашение
          </a>
        </div>
      </div>
    </div>
  )
}
