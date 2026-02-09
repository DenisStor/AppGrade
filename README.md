# AppGrade — Магазин техники Apple

SPA магазин электроники с админ-панелью и серверным API.

**Витрина:** React 19 + Vite 7 + Tailwind CSS 3 + React Router 7 + Zustand 5
**Бэкенд:** Express 5 + SQLite (better-sqlite3) + JWT
**Админка:** React + react-hot-toast + @dnd-kit + @tiptap/react

## Быстрый старт

### Требования
- Node.js 18+
- npm 9+

### Установка и запуск

```bash
git clone <repo-url>
cd ElectronicsStore
npm install
npm run seed         # Заполнить БД тестовыми данными
npm run dev:all      # Витрина (5173) + API (3001)
```

### Доступ
- Витрина: http://localhost:5173
- API: http://localhost:3001
- Админка: http://localhost:5173/admin
  - Логин: `admin@appgrade.ru` / `admin123`

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Vite dev-сервер (localhost:5173) |
| `npm run dev:server` | Express API (localhost:3001) |
| `npm run dev:all` | Оба сервера через concurrently |
| `npm run build` | Сборка в dist/ |
| `npm run preview` | Превью сборки |
| `npm run seed` | Заполнить БД из src/data/ |

## Основные возможности

- 4-уровневая структура каталога (`/catalog/category/brand/product`)
- Фильтрация по цене, памяти, бренду, наличию
- Корзина с сохранением в localStorage
- Избранное и недавно просмотренные товары
- Поиск по каталогу
- Админ-панель (товары, баннеры, категории, блог, заявки)
- Серверный API с SQLite
- Адаптивный дизайн (mobile-first)
- SEO-оптимизация (JSON-LD)

## Структура проекта

```
src/
├── components/          # React-компоненты (ui, catalog, product, filters, search...)
├── data/                # Статические данные и конфигурация
├── hooks/               # Кастомные хуки
├── services/            # API-сервисы витрины
├── utils/               # Утилиты
├── stores/              # Zustand stores
├── layouts/             # CatalogLayout, PageLayout
├── pages/               # Страницы
└── admin/               # Админ-панель (lazy-loaded)

server/
├── routes/              # API-роуты
├── db.js                # SQLite + миграции
├── auth.js              # JWT middleware
└── seed.js              # Заполнение БД
```

## Документация

| Файл | Описание |
|------|----------|
| [CLAUDE.md](./CLAUDE.md) | Entry-point для AI-ассистентов |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Архитектура, файловая структура, дизайн-система |
| [docs/API.md](./docs/API.md) | API эндпоинты с примерами запросов/ответов |
| [docs/DATABASE.md](./docs/DATABASE.md) | Схема БД (14 таблиц), связи, индексы |
| [docs/STORES.md](./docs/STORES.md) | Zustand stores с типами и примерами |
| [docs/COMPONENTS.md](./docs/COMPONENTS.md) | Полное описание компонентов с props |
| [docs/HOOKS.md](./docs/HOOKS.md) | Документация хуков |
| [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) | Код-стайл, именование, паттерны |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Решение частых проблем |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Env-переменные, сборка, деплой |

## Лицензия

MIT
