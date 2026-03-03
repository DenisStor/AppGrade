# CLAUDE.md

Интернет-магазин электроники **APPGRADE** (Калининград). Витрина + админка + бэкенд в одном репозитории.

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Vite dev http://localhost:5173 |
| `npm run dev:server` | Express API http://localhost:3001 |
| `npm run dev:all` | Оба сервера через concurrently |
| `npm run build` | Сборка в dist/ |
| `npm run preview` | Превью сборки на :4173 |
| `npm run seed` | Заполнить БД из src/data/ (пересоздаёт данные) |
| `npm run optimize-assets` | Оптимизация изображений (scripts/optimize-assets.mjs) |

Тестов и линтера нет. Dev-прокси: `/api` и `/uploads` → `http://localhost:3001` через Vite.

## Стек

**Витрина:** React 19 + Vite 7 + Tailwind CSS 3 + React Router 7 + Zustand 5 + Lucide React + Swiper
**Бэкенд:** Express 5 + better-sqlite3 (`server/data/store.db`, WAL) + JWT (bcryptjs + jsonwebtoken) + Sharp
**Админка:** React + react-hot-toast + @dnd-kit + @tiptap/react

## Структура проекта

```
src/
├── App.jsx                 # Роутинг
├── main.jsx                # BrowserRouter, точка входа
├── index.css               # Tailwind + кастомные классы
├── assets/                 # Изображения, шрифты
├── components/             # UI, Header, Footer, Hero, Categories, catalog, product, filters, search, cart, seo, Service, BottomNav
├── data/                   # config, navigation, categories, constants, faq, infoPages, news, redirects, service, social, products/
├── hooks/                  # useProductVariant, useDebounce, useFilterSync, useCatalogQuery...
├── services/               # catalogApi, productMapper, api (формы)
├── utils/                  # product, color, pluralize, phone
├── stores/                 # Zustand: cart, products, search, toast, recentlyViewed
├── layouts/                # CatalogLayout, PageLayout, InfoLayout
├── pages/                  # Home, catalog/, info/, blog/, cart/, service/, used/, SearchPage, NotFoundPage
└── admin/                  # AdminApp, AdminLayout, hooks/, services/, components/, pages/

server/
├── index.js                # Express, CORS, middleware
├── db.js                   # SQLite + миграции (14 таблиц)
├── auth.js                 # JWT middleware
├── seed.js                 # Заполнение БД из src/data/
├── routes/                 # auth, public, products, categories, banners, blog, requests, brands, services, upload, dashboard, image
├── uploads/                # products/, banners/, blog/, categories/
└── data/store.db           # SQLite (автосоздание, .gitignore)

scripts/
├── optimize-assets.mjs     # Оптимизация изображений
└── optimize-iphone-photos.mjs  # Оптимизация iPhone фото (Sharp resize + JPEG)
```

## Архитектура

### Два источника данных

1. **Статические** (`src/data/products/`) — товары, категории, навигация захардкожены в JS.
2. **API + SQLite** (`server/`) — REST API. `npm run seed` заполняет БД из статических данных. Админка — только через API.

API → **snake_case**, фронт → **camelCase**. Маппинг: `src/services/productMapper.js` (`mapProduct`, `mapProducts`).

### Витрина vs Админка

| | Витрина (`src/`) | Админка (`src/admin/`) |
|---|---|---|
| Данные | Статика или `catalogApi` | `apiClient.js` + `*Service.js` |
| Состояние | Zustand stores | `useQuery` / `useMutation` |
| Авторизация | Нет | JWT (`useAuth`, `AuthProvider`) |
| Тосты | `useToastStore` + `useToast()` | `react-hot-toast` |

### Система вариантов: Dimensions vs Legacy

**Modern (dimensions):** `product.dimensions[]` → `variant.attributes: { color: {id, name, hex}, memory: {id, name} }`. Универсальный подход.
**Legacy:** плоские поля `color`, `memory`, `sim` в вариантах. `productMapper.js` строит `attributes` из legacy-полей автоматически. `useProductVariant` поддерживает оба режима.

## Маршрутизация

Роуты в `src/App.jsx`:

| Роут | Компонент | Lazy | Скелет |
|------|-----------|------|--------|
| `/` | Home | Нет | — |
| `/catalog` | CatalogLayout → CatalogPage | Нет | — |
| `/catalog/:category` | CategoryPage | Нет | — |
| `/catalog/:category/:brand` | BrandPage | Нет | — |
| `/catalog/:category/:brand/:slug` | ProductPage | Нет | — |
| `/search` | SearchPage | Да | SearchPageSkeleton |
| `/cart` | CartPage | Да | CartPageSkeleton |
| `/service` | ServicePage | Да | ServicePageSkeleton |
| `/used` | UsedPage | Да | UsedPageSkeleton |
| `/about` | AboutPage | Да | AboutPageSkeleton |
| `/blog` | BlogPage | Да | BlogPageSkeleton |
| `/blog/:id` | BlogPostPage | Нет | — |
| `/admin/*` | AdminApp | Да | null (свой Loader) |
| `/:slug` | InfoPage | Нет | — (catch-all: delivery, warranty, faq, trade-in, credit, returns, privacy, terms, contacts) |
| `*` | NotFoundPage | Да | null |

**Лейауты:** `CatalogLayout` (каталог), `PageLayout` (остальные страницы), `InfoLayout` (инфо-страницы: delivery, warranty и т.д.)
**Редиректы:** `src/data/redirects.js` (`/iphone` → `/catalog/smartphones`, `/mac` → `/catalog/laptops`)

### Категории и бренды

**Категории (8):** smartphones, laptops, tablets, watches, headphones, dyson, accessories, gaming
**Бренды (3):** apple, samsung, dyson
**Display names:** `BRAND_DISPLAY_NAMES` в `src/data/products/index.js` — `'apple-smartphones'` → `'iPhone'`

## Ключевые импорты

### Хелперы товаров (`src/data/products/index.js`)

`allProducts`, `usedProducts`, `categories`, `brands`, `CATALOG_CATEGORIES`, `BRAND_DISPLAY_NAMES`, `getProductBySlug`, `getProductById`, `getProductsByCategory`, `getProductsByCategoryAndBrand`, `getCategoryBySlug`, `getBrandBySlug`, `getBrandsByCategory`, `getBrandSlug`, `searchProducts`, `getRelatedProducts`, `getMinPrice`, `hasDiscount`, `getAvailableColors`, `getAvailableMemory`, `formatPrice`, `formatMemory`, `getUsedProducts`

### Утилиты (`src/utils/`)

| Файл | Ключевые экспорты |
|------|-------------------|
| `product.js` | `formatPrice`, `formatMemory`, `getMinPrice`, `hasDiscount`, `getAvailableDimensionValues`, `getAvailableColors`, `getAvailableMemory`, `getAvailableColorsFromProducts`, `getAvailableMemoryFromProducts`, `getAvailableSims`, `getBrandSlug`, `extractSeries`, `getAvailableSeriesFromProducts` |
| `color.js` | `isLightColor(hex)` |
| `pluralize.js` | `pluralize(count, forms)`, `formatProductCount(count)` |
| `phone.js` | `formatPhoneInput(value, prevValue)` — маска `+7 (999) 123-45-67` |

### Stores (5) — `src/stores/`

Импорт: `import { useCartStore } from '../stores'`. Подробнее → [STORES.md](./docs/STORES.md)

| Store | Persist | Назначение |
|-------|---------|-----------|
| `useCartStore` | `cart` v2 | Корзина. ID: `${productId}-${variantId}` |
| `useProductStore` | Нет | Фильтры каталога, сортировка, viewMode |
| `useRecentlyViewedStore` | `recently-viewed` | Просмотренные товары (макс 10) |
| `useSearchStore` | Нет | Поиск: query, results, isOpen |
| `useToastStore` | Нет | Уведомления (авто-удаление 3с) |

### Хуки (11) — `src/hooks/`

Подробнее → [HOOKS.md](./docs/HOOKS.md)

| Хук | Назначение |
|-----|-----------|
| `useProductVariant(product)` | Dimensions + legacy compat, auto-fallback |
| `useDebounce(value, delay=300)` | Дебаунс |
| `useFilterSync(init, parse, build)` | Фильтры ↔ URL. Экспорты: `parseBrandPageUrl`, `buildBrandPageUrl`, `parseUsedPageUrl`, `buildUsedPageUrl`, `BRAND_PAGE_INITIAL_FILTERS`, `USED_PAGE_INITIAL_FILTERS` |
| `useProductFiltering(products, filters, sortBy, options?)` | Фильтрация + сортировка. `options.extraFilters`, `options.sortNew` |
| `useCatalogQuery(fetcher, deps)` | GET-запрос с loading/error/refetch |
| `useMatchMedia(query)` | CSS media query |
| `useScrollPosition(threshold=10)` | `{ isScrolled }` |
| `useInView(options?)` | Intersection Observer (однократный) |
| `useToast()` | `{ toast(msg, type) }` |
| `useReducedMotion()` | prefers-reduced-motion |
| `usePageTitle(title)` | document.title |

### Сервисы

**Витрина:** `catalogApi.js` (GET `/api/public/*`), `productMapper.js` (snake→camelCase), `api.js` (POST `/api/requests`: submitOrder, submitQuickBuy, submitContactForm, submitRepairRequest)
**Админка:** `apiClient.js` (JWT + auto-signout) + `*Service.js` (CRUD: banner, blog, category, dashboard, product, request, service)

### Компоненты

Подробнее → [COMPONENTS.md](./docs/COMPONENTS.md)

| Группа | Компоненты |
|--------|-----------|
| **UI (20)** | Button, Modal, Drawer, Tabs, Badge/BadgeGroup, Breadcrumbs, Toast, RangeSlider, Container, SectionHeader, SectionDivider, Skeleton, CardSkeleton, ImageWithSkeleton, AnimatedSection, StaggeredList, PageSkeleton, ColorSwatch, FloatingCallButton |
| **Header (4)** | Header, TopBar, Navigation, MobileMenu |
| **Footer (5)** | Footer, FooterColumn, FooterContacts, FooterSubscribe, FooterBottom |
| **Catalog (3)** | ProductGrid, ProductListCard, SortDropdown |
| **Product (11)** | ColorSelector, MemorySelector, SimSelector, DimensionSelector, ProductGallery, ProductConfig, ProductActions, ProductBenefits, RelatedProducts, RecentlyViewed, QuickBuyModal |
| **Filters (7)** | FilterSidebar, CheckboxFilter, ColorFilter, ActiveFilters, UsedFilterSidebar, EmptyFilterResults, FilterDrawer, MobileFilterButton |
| **Search (2)** | SearchInput, SearchDropdown |
| **Cart (2)** | CartItem, CartRecommendations |
| **Service (9)** | ServiceHero, ServiceIntro, ServiceFeatures, WhyUs, ServicePricing, HowWeWork, RepairForm, LoanerPhone, MobileService |
| **SEO (4)** | ProductJsonLd, BreadcrumbJsonLd, OrganizationJsonLd, LocalBusinessJsonLd |
| **Homepage** | Hero, Categories, CategoryCard, ProductCards, Benefits, BenefitCard, InfoBlock, News, NewsCard, FAQ, AboutUs, ContactSection, LocationCard |
| **Навигация** | BottomNav (мобильная нижняя), ScrollToTop, ErrorBoundary |

## Data-файлы

| Файл | Ключевые экспорты |
|------|-------------------|
| `data/config.js` | `SITE_URL`, `LOCATIONS[]`, `CONTACTS` (phone, phoneLink, email, address, whatsapp, telegram, vk), `COMPANY` (name, legalName, inn, ogrnip) |
| `data/navigation.js` | `NAV_MAIN`, `NAV_MOBILE`, `FOOTER_SECTIONS` |
| `data/categories.js` | `CATEGORIES` |
| `data/constants.js` | `CAROUSEL.AUTOPLAY_DELAY` (20000), `PRICE.MAX` (500000), `DEBOUNCE.DEFAULT` (100) |
| `data/social.jsx` | `SOCIAL_LINKS` — массив `{ name, href, icon }` (Telegram, VK, WhatsApp) |
| `data/benefits.js` | Массив преимуществ |
| `data/faq.js` | FAQ-данные для аккордеона |
| `data/infoPages.js` | `INFO_PAGES` — контент: delivery, warranty, contacts, returns, faq, trade-in, credit, privacy, terms |
| `data/news.js` | Новости |
| `data/redirects.js` | `REDIRECTS[]` — `{ from, to }` для старых URL |
| `data/service.js` | Данные сервисного центра |
| `data/products/` | `iphone.js`, `mac.js`, `samsung.js`, `dyson.js`, `used.js` |

## Стилизация

**Шрифты:** Inter (текст), Unbounded (заголовки h1-h6)
**Цвета:** `gray-light` (#f5f5f7), `gray-medium` (#86868b), `gray-dark` (#1d1d1f)
**Border Radius:** `liquid` (20px), `liquid-lg` (28px), `card` (16px), `btn`/`input` (12px)
**Тени:** `glass`, `glass-hover`, `liquid`, `liquid-hover`
**Анимации:** `fade-in-up`, `shimmer`, `scale-in`, `ripple`, `pulse-soft`, `card-appear`
**Брейкпоинты:** `xs` (375), `sm` (640), `md` (768), **`lg` (1024 — основной)**, `xl` (1280). Mobile-first.

Кастомные CSS-классы и дизайн-система → [ARCHITECTURE.md](./docs/ARCHITECTURE.md#дизайн-система)

## API

### Публичные (без авторизации)

| Метод | Эндпоинт | Cache | Описание |
|-------|----------|-------|----------|
| GET | `/api/public/categories` | 5 мин | Категории с брендами |
| GET | `/api/public/categories/:slug/brands` | 5 мин | Бренды категории |
| GET | `/api/public/products` | no-cache | Список с фильтрами |
| GET | `/api/public/products/:slug` | — | Детальная + related |
| GET | `/api/public/products/by-slugs?slugs=...` | — | По slug-ам |
| GET | `/api/public/search?q=...` | — | Поиск (макс 50) |
| GET | `/api/public/services` | 5 мин | Услуги с ценами |
| POST | `/api/requests` | — | Заявка (rate limit: 5/мин) |

### Защищённые (JWT Bearer)

Auth, Banners, Categories, Products, Brands, Services, Blog, Requests, Upload, Dashboard — CRUD. Подробнее → [API.md](./docs/API.md)

**Логин:** `admin@appgrade.ru` / `admin123`, JWT 4 часа. При 401 → авто-logout.

### Image pipeline

`server/routes/image.js` — Sharp обработка с кэшем (`server/uploads/.cache/`). Подробнее → [API.md](./docs/API.md#image-pipeline)

### Env-переменные

| Переменная | Default | Описание |
|-----------|---------|----------|
| `JWT_SECRET` | — | Секрет JWT (обязателен на проде) |
| `PORT` | 3001 | Порт Express |
| `NODE_ENV` | development | Окружение |
| `CORS_ORIGINS` | localhost:5173,5174 | Разрешённые домены |

## База данных

SQLite (better-sqlite3), WAL, foreign keys ON. 14 таблиц, 17 индексов. Подробнее → [DATABASE.md](./docs/DATABASE.md)

## Админка

Роуты: login, dashboard, banners, categories, products, requests, services, blog (CRUD). Компоненты: DataTable, VariantMatrix, RichTextEditor (TipTap), SortableList, SortableImages, ImageUploader, AdminSidebar, AdminHeader, StatusBadge, ConfirmDialog, AdminModal.

## Рецепты

### Добавить товар (статика)

1. Описать в `src/data/products/<brand>.js` по структуре product
2. Экспортировать в `src/data/products/index.js`
3. `npm run seed` для синхронизации с БД

### Добавить информационную страницу

1. Добавить ключ в `src/data/infoPages.js` (slug → `{ title, content: { intro, sections[] } }`)
2. Страница автоматически доступна по `/:slug`

### Добавить роут

1. Создать компонент в `src/pages/`
2. Добавить Route в `src/App.jsx` (lazy + Suspense + скелет для тяжёлых страниц)

### Отправить заявку (API)

```js
import { api } from '../services/api'
await api.submitQuickBuy({ name, phone, productName, variantInfo, productId })
```

## Решение проблем

Типичные проблемы и решения → [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

## Конвенции

Код-стайл, именование, паттерны → [CONVENTIONS.md](./docs/CONVENTIONS.md)

## Углублённая документация

| Файл | Описание |
|------|----------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Архитектура, файловая структура, дизайн-система, поток данных |
| [docs/API.md](./docs/API.md) | API эндпоинты с примерами запросов/ответов |
| [docs/DATABASE.md](./docs/DATABASE.md) | Схема БД (14 таблиц), связи, индексы, каскады |
| [docs/STORES.md](./docs/STORES.md) | Zustand stores с полными типами и примерами |
| [docs/COMPONENTS.md](./docs/COMPONENTS.md) | Компоненты с props и примерами использования |
| [docs/HOOKS.md](./docs/HOOKS.md) | Хуки с полными сигнатурами и особенностями |
| [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) | Код-стайл, именование, паттерны |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Решение частых проблем |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Env-переменные, сборка, деплой, nginx |
