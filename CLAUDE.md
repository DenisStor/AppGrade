# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды

```bash
npm run dev          # Vite dev http://localhost:5173
npm run dev:server   # Express API http://localhost:3001
npm run dev:all      # Оба сервера через concurrently
npm run build        # Сборка в dist/
npm run preview      # Превью сборки
npm run seed         # Заполнить БД из src/data/
npm run optimize-assets  # Оптимизация изображений (scripts/optimize-assets.mjs)
```

Dev-прокси: `/api` и `/uploads` проксируются на `http://localhost:3001` через Vite.

## Стек

**Витрина:** React 19 + Vite 7 + Tailwind CSS 3 + React Router 7 + Zustand 5
**Бэкенд:** Express 5 + better-sqlite3 + JWT (bcryptjs + jsonwebtoken)
**Админка:** React + react-hot-toast + @dnd-kit + @tiptap/react

## Структура проекта

```
src/
├── components/     # UI, Header, Footer, catalog, product, filters, search, cart, seo, Service
├── data/           # Конфиг, навигация, категории, товары (products/)
├── hooks/          # 11 хуков (useProductVariant, useDebounce, useCatalogQuery...)
├── services/       # catalogApi.js, productMapper.js
├── utils/          # product.js, color.js, pluralize.js
├── stores/         # Zustand: cart, products, search, toast, recentlyViewed
├── layouts/        # CatalogLayout, PageLayout
├── pages/          # catalog/, info/, blog/, cart/, service/, used/
└── admin/          # Lazy-loaded: hooks, services, components, pages
server/
├── routes/         # auth, public, products, categories, banners, blog, requests, brands, services, upload, dashboard
├── db.js           # SQLite + миграции (14 таблиц)
├── auth.js         # JWT middleware
└── seed.js         # Заполнение БД
```

Подробнее: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Структура каталога (4-уровневая)

```
/catalog                           → CatalogPage (все категории)
/catalog/:category                 → CategoryPage (бренды категории)
/catalog/:category/:brand          → BrandPage (товары бренда)
/catalog/:category/:brand/:slug    → ProductPage (карточка товара)
```

**Категории:** `smartphones`, `laptops`, `tablets`, `watches`, `headphones`, `hairdryers`, `stylers`, `accessories`, `gaming`

**Бренды:** `apple`, `samsung`, `dyson`

## Маршруты

| Маршрут | Страница | Lazy |
|---------|----------|------|
| `/` | Home | Нет |
| `/catalog/*` | CatalogLayout + вложенные | Нет |
| `/search` | SearchPage | Да |
| `/cart` | CartPage | Да |
| `/service` | ServicePage | Да |
| `/used` | UsedPage | Да |
| `/about` | AboutPage | Да |
| `/blog`, `/blog/:id` | BlogPage, BlogPostPage | Да / Нет |
| `/admin/*` | AdminApp | Да |
| `/:slug` | InfoPage (delivery, warranty, faq...) | Нет |

## Система товаров

### Структура продукта

```js
{
  id: 'iphone-17-pro-max',
  slug: 'iphone-17-pro-max',
  category: 'smartphones',
  brand: 'Apple',
  name: 'iPhone 17 Pro Max',
  shortDescription: '...',
  badges: ['new', 'hit', 'sale'],
  simOptions: [{ id: 'dual', name: 'nanoSIM + eSIM' }],
  variants: [{
    id: 'iphone-17-pro-max-black-256',
    color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
    memory: 256,
    price: 169990,
    oldPrice: null,
    inStock: true,
    images: ['url или import'],
  }],
  specs: { display: '...', chip: '...', camera: '...' },
  relatedIds: ['product-id-1', 'product-id-2'],
}
```

### Хелперы (`src/data/products/index.js`)

```js
import {
  getProductsByCategory,           // (categorySlug) → products[]
  getProductsByCategoryAndBrand,   // (categorySlug, brandSlug) → products[]
  getProductBySlug,                // (slug) → product
  brands,                          // { apple, samsung, dyson }
  getBrandsByCategory,             // (categorySlug) → brand[]
  getBrandBySlug,                  // (slug) → brand | null
  getAvailableColors,              // (product) → colors[]
  getAvailableMemory,              // (product) → [128, 256, 512]
  getMinPrice,                     // (product) → number
  hasDiscount,                     // (product) → boolean
  formatPrice,                     // (price) → '169 990 ₽'
  formatMemory,                    // (1024) → '1 ТБ'
  searchProducts,                  // (query) → products[]
  CATALOG_CATEGORIES,              // массив категорий
  usedProducts, CONDITIONS,        // б/у товары
} from '../data/products'
```

## Data-файлы (`src/data/`)

| Файл | Экспорты |
|------|----------|
| config.js | `CONTACTS`, `COMPANY` |
| navigation.js | `NAV_MAIN`, `NAV_MOBILE`, `FOOTER_SECTIONS` |
| categories.js | `CATEGORIES` |
| constants.js | `PRICE`, `SORT_OPTIONS` |
| benefits.js | Преимущества |
| faq.js | FAQ-данные |
| infoPages.js | Информационные страницы |
| news.js | Новости |
| redirects.js | Редиректы со старых URL |
| service.js | Данные сервиса |
| products/ | iphone.js, mac.js, samsung.js, dyson.js, used.js, index.js |

## Stores (Zustand)

| Store | Persist | Ключевые методы |
|-------|---------|----------------|
| useCartStore | `cart` (v2) | addItem(product, variant), removeItem, getTotal, getCount |
| useProductStore | — | setFilter, toggleArrayFilter, resetFilters, setSortBy |
| useRecentlyViewedStore | `recently-viewed` | addItem(productId), макс. 10 |
| useSearchStore | — | setQuery, setResults, setIsOpen |
| useToastStore | — | addToast(message, type), автоудаление 3с |

Подробнее: [docs/STORES.md](./docs/STORES.md)

## Хуки

| Хук | Сигнатура |
|-----|-----------|
| useProductVariant | `(product)` → selections, setSelection, dimensions, currentVariant |
| useDebounce | `(value, delay=300)` → debouncedValue |
| useCatalogQuery | `(fetcher, deps)` → { data, loading, error, refetch } |
| useProductFiltering | `(products, filters, sortBy, options)` → filteredProducts |
| usePageTitle | `(title)` → устанавливает document.title |
| useFilterSync | `(initialFilters, parseUrl, buildUrl)` → синхронизация с URL |
| useToast | `()` → { toast } |

Полный список: [docs/HOOKS.md](./docs/HOOKS.md)

## Компоненты

Полная документация: [docs/COMPONENTS.md](./docs/COMPONENTS.md)

**Витрина:** Button, Modal, Drawer, Tabs, Badge, Breadcrumbs, Toast, RangeSlider, Skeleton, CardSkeleton, PageSkeleton, ColorSwatch, ImageWithSkeleton, AnimatedSection, Container, FloatingCallButton, SectionDivider, SectionHeader, StaggeredList
**Каталог:** ProductGrid, ProductListCard, SortDropdown
**Товар:** ColorSelector, MemorySelector, SimSelector, DimensionSelector, ProductGallery, ProductConfig, ProductActions, ProductBenefits, QuickBuyModal, RecentlyViewed, RelatedProducts
**Фильтры:** FilterSidebar, CheckboxFilter, ColorFilter, ActiveFilters, EmptyFilterResults, FilterDrawer, MobileFilterButton, UsedFilterSidebar
**Админка:** DataTable, ImageUploader, VariantMatrix, RichTextEditor, SortableList, StatusBadge, ConfirmDialog, AdminHeader, AdminModal, AdminSidebar, SortableImages

## Сервисы

### Витрина (`src/services/`)

```js
import { catalogApi } from '../services/catalogApi'       // /api/public/*
import { mapProducts, mapProduct } from '../services/productMapper'  // snake→camel
import { submitForm } from '../services/api'              // Отправка форм
```

### Админка (`src/admin/services/`)

apiClient.js (JWT + auto-signout), bannerService, categoryService, productService, requestService, blogService, serviceService, dashboardService

### Хуки админки

useAuth (JWT, AuthProvider), useQuery (GET + кэш), useMutation (POST/PUT/DELETE + toast), useImageUpload

## Утилиты

| Файл | Экспорты |
|------|----------|
| `src/utils/product.js` | formatPrice, formatMemory, getMinPrice, hasDiscount, getAvailableColors, getAvailableMemory, getBrandSlug |
| `src/utils/color.js` | isLightColor(hex) |
| `src/utils/pluralize.js` | pluralize(count, forms), formatProductCount |
| `src/admin/utils/generateSlug.js` | generateSlug(name) — транслитерация → slug |

## Стилизация

Цвета: `gray-light` (#f5f5f7), `gray-medium` (#86868b), `gray-dark` (#1d1d1f)
Классы: `.liquid-glass`, `.card-hover`, `.section-padding` (px-6 lg:px-60)
Mobile-first, основной брейкпоинт `lg:` (1024px). Шрифты: Inter + Unbounded.

Подробнее: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md#дизайн-система)

## API

Публичные: `/api/public/*` (categories, products, search) — без авторизации
Защищённые: `/api/banners`, `/api/products`, `/api/blog`, `/api/requests`, `/api/brands`, `/api/services` — JWT
Логин: `admin@appgrade.ru` / `admin123`, JWT 4 часа

Подробнее: [docs/API.md](./docs/API.md) | БД: [docs/DATABASE.md](./docs/DATABASE.md)

### Обработка изображений

`server/routes/image.js` — Sharp-пайплайн с кэшированием в `server/uploads/.cache/`:
- Допустимые ширины: 200, 400, 800, 1200, 1920px (snap к ближайшей)
- Форматы: WebP, AVIF, JPEG, PNG
- Запрос: `/uploads/image.jpg?w=800&format=webp`
- Vite-плагин `ViteImageOptimizer` сжимает при сборке (WebP/JPEG 80%, PNG уровень 9)

### Env-переменные (`.env.example`)

```
JWT_SECRET=your-secret-key-change-me
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
```

## Добавление нового товара

**Через админку:** `/admin/products/new` → заполнить форму → VariantMatrix → изображения → сохранить

**Через данные:** `src/data/products/{brand}.js` → экспорт в `index.js` → изображения из assets/ или URL

## Добавление новой страницы

1. Создать в `src/pages/`
2. Добавить Route в `App.jsx`
3. Обновить `src/data/navigation.js` если нужно в меню

## Документация

| Файл | Описание |
|------|----------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Архитектура, файловая структура, дизайн-система |
| [docs/API.md](./docs/API.md) | API эндпоинты с примерами запросов/ответов |
| [docs/DATABASE.md](./docs/DATABASE.md) | Схема БД (14 таблиц), связи, индексы |
| [docs/STORES.md](./docs/STORES.md) | Zustand stores с типами и примерами |
| [docs/COMPONENTS.md](./docs/COMPONENTS.md) | Полное описание компонентов с props |
| [docs/HOOKS.md](./docs/HOOKS.md) | Документация хуков |
| [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) | Код-стайл, именование, паттерны |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Решение частых проблем |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Env-переменные, сборка, деплой |
