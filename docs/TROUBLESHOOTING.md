# Решение проблем

## Товар не отображается в каталоге

1. Проверить `category` и `brand` в объекте товара
2. Убедиться, что товар экспортирован в `src/data/products/index.js`
3. Проверить, что хотя бы один вариант имеет `inStock: true`
4. В БД: `active = 1`, правильные `category_id` и `brand_id`

## Фильтры не работают

1. `useProductStore` импортирован из `../stores`
2. `resetFilters()` вызывается при смене категории/бренда
3. Структура `filters` соответствует ожидаемой в компоненте
4. `useProductFiltering` получает корректный массив товаров

## Изображения не загружаются

1. Локальные: `import img from '../assets/...'` (Vite обработает)
2. URL: проверить CORS и доступность ресурса
3. `images` в варианте — массив строк
4. Загруженные: проверить `server/uploads/` и что сервер запущен

## Корзина не сохраняется

1. Проверить localStorage в DevTools (`cart` key)
2. `persist` настроен в `useCartStore` (name: 'cart', version: 2)
3. Попробовать очистить localStorage и перезагрузить

## Роутинг 404 на продакшене

1. Настроить SPA-редиректы на сервере (все маршруты → index.html)
2. Для nginx: `try_files $uri /index.html`
3. Проверить базовый путь в `vite.config.js`

## БД не создаётся / seed падает

1. Убедиться, что `server/data/` существует (создаётся автоматически)
2. Проверить, что `better-sqlite3` установлен: `npm install`
3. Удалить `server/data/store.db` и запустить `npm run seed` заново
4. Проверить, что файлы товаров в `src/data/products/` корректны

## CORS ошибки в dev

1. Vite proxy настроен: `/api` и `/uploads` → `http://localhost:3001`
2. Express CORS: `http://localhost:5173` в `CORS_ORIGINS`
3. Оба сервера запущены: `npm run dev:all`

## JWT истёк / auto-signout

1. Токен живёт 4 часа, затем 401 → автоматический logout
2. `apiClient.js` перехватывает 401 и вызывает signOut
3. Перелогиниться через `/admin/login`

## Хуки вызываются после return

React правило: хуки нельзя вызывать условно или после раннего return. Все хуки — в начале компонента.

## JSX в файлах .js

Файлы с JSX должны иметь расширение `.jsx`. Если в хуке есть JSX (например `useAuth`), файл должен быть `.jsx`.
