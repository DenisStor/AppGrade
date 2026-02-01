# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды

```bash
npm run dev      # Dev-сервер http://localhost:5173
npm run build    # Сборка в dist/
npm run preview  # Превью сборки
```

## Архитектура

### Стек

React 19 + Vite + Tailwind CSS + React Router 7 + Zustand

### Поток данных

```
main.jsx (BrowserRouter)
    → App.jsx (Routes)
        → CatalogLayout (Outlet для каталога)
            → CategoryPage / ProductPage
        → Информационные страницы
    → Zustand stores (корзина, избранное, фильтры)
```

### Структура каталога

```
/catalog                    → CatalogPage (все категории)
/catalog/:category          → CategoryPage (товары категории)
/catalog/:category/:slug    → ProductPage (карточка товара)
```

Категории: `smartphones`, `laptops`, `tablets`, `watches`, `headphones`, `accessories`

## Система товаров

### Структура продукта

```js
// src/data/products/iphone.js
{
  id: 'iphone-17-pro-max',
  slug: 'iphone-17-pro-max',
  category: 'smartphones',
  name: 'iPhone 17 Pro Max',
  shortDescription: 'Краткое описание',
  badges: ['new', 'hit', 'sale'],
  simOptions: [{ id: 'dual', name: 'nanoSIM + eSIM' }],
  variants: [
    {
      id: 'iphone-17-pro-max-black-256',
      color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
      memory: 256,
      price: 169990,
      oldPrice: null,  // для скидки
      inStock: true,
      images: ['url или import'],
    }
  ],
  specs: { display: '...', chip: '...', camera: '...' },
  relatedIds: ['product-id-1', 'product-id-2'],
}
```

### Хелперы (src/data/products/index.js)

```js
import {
  getProductsByCategory,  // (categorySlug) → products[]
  getProductBySlug,       // (slug) → product
  getAvailableColors,     // (product) → colors[]
  getAvailableMemory,     // (product) → [128, 256, 512]
  getMinPrice,            // (product) → number
  formatPrice,            // (price) → '169 990 ₽'
  formatMemory,           // (1024) → '1 ТБ'
  searchProducts,         // (query) → products[]
} from '../data/products'
```

## Zustand Stores

```js
// Корзина (persist в localStorage)
import { useCartStore } from '../stores'
const { items, addItem, removeItem, getTotal, getCount } = useCartStore()
addItem(product, variant, sim?)

// Фильтры каталога
import { useProductStore } from '../stores'
const { filters, setFilter, toggleArrayFilter, resetFilters, sortBy, setSortBy } = useProductStore()

// Избранное (persist)
import { useFavoritesStore } from '../stores'
const { items, toggleItem, isFavorite } = useFavoritesStore()

// Поиск
import { useSearchStore } from '../stores'
const { query, setQuery, results } = useSearchStore()

// Недавно просмотренные (persist)
import { useRecentlyViewedStore } from '../stores'
const { items, addItem } = useRecentlyViewedStore()
```

## Компоненты каталога

```
src/components/catalog/
├── ProductGrid.jsx       # Сетка карточек (3 колонки на desktop)
├── ProductListCard.jsx   # Карточка товара в каталоге
├── FilterSidebar.jsx     # Боковая панель фильтров
└── ActiveFilters.jsx     # Активные фильтры (чипы)

src/components/product/
├── ColorSelector.jsx     # Выбор цвета
├── MemorySelector.jsx    # Выбор памяти
└── SimSelector.jsx       # Выбор SIM
```

## Конфигурация

```js
// src/data/config.js — контакты магазина
import { CONTACTS, COMPANY } from '../data/config'

// src/data/navigation.js — меню
import { NAV_MAIN, NAV_MOBILE, FOOTER_SECTIONS } from '../data/navigation'
```

## Стилизация

### Кастомные цвета Tailwind

- `bg-gray-light` (#f5f5f7) — фон карточек
- `text-gray-medium` (#86868b) — вторичный текст
- `text-gray-dark` (#1d1d1f) — основной текст

### Утилитарные классы (index.css)

- `.liquid-glass` — glassmorphism эффект
- `.card-hover` — hover для карточек (тень + scale)
- `.section-padding` — `px-6 lg:px-60`

### Паттерн карточки товара

```jsx
<article className="group rounded-3xl p-5 border border-gray-100 shadow-sm
  transition-all hover:shadow-xl hover:-translate-y-1">
```

## Добавление нового товара

1. Добавить данные в `src/data/products/{brand}.js`
2. Экспортировать в `src/data/products/index.js`
3. Изображения: импорт из `src/assets/products/` или URL

## Добавление новой страницы

1. Создать в `src/pages/catalog/` или `src/pages/info/`
2. Добавить Route в `App.jsx`
3. Обновить `src/data/navigation.js` если нужно в меню

## Особенности

- Mobile-first (брейкпоинт `lg:` = 1024px)
- Шрифт SF Pro Display (CDN)
- Иконки: Lucide React
- Карусели: Swiper
- Навигация: `<Link to="...">` вместо `<a href>`
