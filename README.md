# AppGrade — Магазин техники Apple

SPA магазин электроники на React 19 + Vite + Tailwind CSS.

## Быстрый старт

```bash
npm install
npm run dev
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (localhost:5173) |
| `npm run build` | Сборка в dist/ |
| `npm run preview` | Превью сборки |

## Технологии

- React 19
- React Router 7
- Vite 7
- Tailwind CSS 3
- Zustand 5
- Swiper 12
- Lucide Icons

## Структура проекта

```
src/
├── assets/              # Статика (изображения, шрифты)
├── components/          # React-компоненты
│   ├── ui/              # UI-компоненты (Button, Modal, Tabs...)
│   ├── catalog/         # Каталог (ProductGrid, ProductListCard)
│   ├── product/         # Страница товара (ColorSelector, Gallery)
│   ├── filters/         # Фильтры (FilterSidebar, CheckboxFilter)
│   ├── search/          # Поиск (SearchInput, SearchDropdown)
│   ├── Header/          # Хедер
│   ├── Footer/          # Подвал
│   ├── Hero/            # Главный баннер
│   ├── Categories/      # Секция категорий
│   ├── Benefits/        # Преимущества
│   ├── News/            # Новости
│   ├── FAQ/             # FAQ
│   ├── cart/            # Корзина
│   └── seo/             # SEO-компоненты
├── data/                # Данные и конфигурация
│   ├── products/        # Товары (iphone.js, mac.js, dyson.js)
│   ├── config.js        # Контакты, компания
│   ├── navigation.js    # Меню навигации
│   ├── categories.js    # Категории
│   └── ...
├── hooks/               # Кастомные хуки
├── layouts/             # Layouts (CatalogLayout, InfoLayout)
├── pages/               # Страницы
│   ├── catalog/         # Каталог, бренды, товары
│   └── info/            # Информационные страницы
├── stores/              # Zustand stores
├── utils/               # Утилиты
├── App.jsx              # Роутинг
├── main.jsx             # Точка входа
└── index.css            # Глобальные стили
```

## Документация

| Файл | Описание |
|------|----------|
| [CLAUDE.md](./CLAUDE.md) | Документация для разработки |
| [docs/COMPONENTS.md](./docs/COMPONENTS.md) | Полное описание компонентов |
| [docs/HOOKS.md](./docs/HOOKS.md) | Документация хуков |

## Основные возможности

- 4-уровневая структура каталога (`/catalog/category/brand/product`)
- Фильтрация по цене, памяти, бренду, наличию
- Корзина с сохранением в localStorage
- Избранное
- Недавно просмотренные товары
- Поиск по каталогу
- Адаптивный дизайн (mobile-first)
- SEO-оптимизация (JSON-LD)

## Лицензия

MIT
