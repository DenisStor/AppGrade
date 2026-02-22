# CLAUDE.md

Интернет-магазин электроники **APPGRADE** (Калининград). Витрина + админка + бэкенд в одном репозитории.

## Команды

```bash
npm run dev          # Vite dev http://localhost:5173
npm run dev:server   # Express API http://localhost:3001
npm run dev:all      # Оба сервера через concurrently
npm run build        # Сборка в dist/
npm run preview      # Превью сборки на :4173
npm run seed         # Заполнить БД из src/data/ (пересоздаёт данные)
npm run optimize-assets  # Оптимизация изображений (scripts/optimize-assets.mjs)
```

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
├── components/             # UI, Header, Footer, Hero, Categories, catalog, product, filters, search, cart, seo, Service
├── data/                   # Статика: config, navigation, categories, constants, faq, infoPages, news, redirects, service, products/
├── hooks/                  # useProductVariant, useDebounce, useFilterSync, useCatalogQuery...
├── services/               # catalogApi, productMapper, api (формы)
├── utils/                  # product, color, pluralize, phone
├── stores/                 # Zustand: cart, products, search, toast, recentlyViewed
├── layouts/                # CatalogLayout, PageLayout
├── pages/                  # Home, catalog/, info/, blog/, cart/, service/, used/, SearchPage, NotFoundPage
└── admin/                  # AdminApp, AdminLayout, hooks/, services/, components/, pages/

server/
├── index.js                # Express, CORS, middleware
├── db.js                   # SQLite + миграции (14 таблиц)
├── auth.js                 # JWT middleware
├── seed.js                 # Заполнение БД из src/data/
├── routes/                 # auth, public, products, categories, banners, blog, requests, brands, services, upload, dashboard
├── uploads/                # products/, banners/, blog/, categories/
└── data/store.db           # SQLite (автосоздание, .gitignore)
```

## Архитектура

### Два источника данных

1. **Статические** (`src/data/products/`) — товары, категории, навигация захардкожены в JS. Импорт → рендер.
2. **API + SQLite** (`server/`) — REST API. `npm run seed` заполняет БД из статических данных. Админка работает только через API.

API возвращает **snake_case**, фронт — **camelCase**. Маппинг: `src/services/productMapper.js` (`mapProduct`, `mapProducts`).

### Витрина vs Админка

| | Витрина (`src/`) | Админка (`src/admin/`) |
|---|---|---|
| Данные | Статические файлы или `catalogApi` | `apiClient.js` + `*Service.js` |
| Состояние | Zustand stores | `useQuery` / `useMutation` хуки |
| Авторизация | Нет | JWT (`useAuth`, `AuthProvider`) |
| Тосты | `useToastStore` + `useToast()` | `react-hot-toast` |

### Система вариантов: Dimensions vs Legacy

**Modern (dimensions):** товар имеет `dimensions[]` — массив измерений (color, memory, sim и др.). Варианты содержат `attributes: { color: {id, name, hex}, memory: {id, name}, ... }`. Универсальный подход для любых комбинаций.

**Legacy:** варианты содержат плоские поля `color: {id, name, hex}`, `memory: number`, `sim: null`. Без массива `dimensions`. Работает через backward-compat в `useProductVariant` и `productMapper`.

`productMapper.js` автоматически строит `attributes` из legacy-полей (`color_name`, `color_hex`, `memory`, `sim_id`) если `attributes` пуст.

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

Каталог обёрнут в `CatalogLayout` (Header → ErrorBoundary → Outlet → Footer). Остальные страницы — `PageLayout` (Header → children → Footer).

Редиректы со старых URL: `src/data/redirects.js` (`/iphone` → `/catalog/smartphones`, `/mac` → `/catalog/laptops` и т.д.)

## Система товаров

### Структура product (статика)

```js
{
  id: 'iphone-17-pro-max',
  slug: 'iphone-17-pro-max',
  category: 'smartphones',       // slug категории
  brand: 'Apple',                // имя бренда
  name: 'iPhone 17 Pro Max',
  shortDescription: '...',
  badges: ['new', 'hit', 'sale'],
  dimensions: [                  // Modern: массив измерений (может быть пуст для legacy)
    { key: 'color', label: 'Цвет', type: 'color' },
    { key: 'memory', label: 'Память', type: 'option' },
  ],
  simOptions: [{ id: 'dual', name: 'nanoSIM + eSIM' }],
  variants: [{
    id: 'iphone-17-pro-max-black-256',
    attributes: {                // Modern: произвольные атрибуты
      color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },
      memory: { id: '256', name: '256 ГБ' },
    },
    color: { id: 'black', name: 'Чёрный', hex: '#1d1d1f' },  // Legacy compat
    memory: 256,                 // Legacy compat
    price: 169990,
    oldPrice: null,
    inStock: true,
    images: ['url или import'],
  }],
  specs: { display: '6.9"', chip: 'A19 Pro', camera: '48 МП' },
  relatedIds: ['iphone-17-pro'],
}
```

### Категории и бренды

**Категории (9):** smartphones, laptops, tablets, watches, headphones, hairdryers, stylers, accessories, gaming
**Бренды (3):** apple, samsung, dyson
**Display names:** `BRAND_DISPLAY_NAMES` в `src/data/products/index.js` — маппинг `'apple-smartphones'` → `'iPhone'`

## Хелперы и утилиты

### src/data/products/index.js

```js
allProducts                           // Все товары (массив)
usedProducts                          // Б/У товары
categories                            // Объект категорий { smartphones: {...}, ... }
brands                                // Объект брендов { apple: {...}, ... }
CATALOG_CATEGORIES                    // Object.values(categories)
BRAND_DISPLAY_NAMES                   // {'apple-smartphones': 'iPhone', ...}
getProductBySlug(slug)                // → product | undefined
getProductById(id)                    // → product | undefined
getProductsByCategory(categorySlug)   // → product[]
getProductsByCategoryAndBrand(cat, brand)  // → product[]
getCategoryBySlug(slug)               // → category | null
getBrandBySlug(slug)                  // → brand | null
getBrandsByCategory(categorySlug)     // → brand[]
getBrandSlug(brandName)               // 'Apple' → 'apple'
searchProducts(query)                 // → product[] (поиск по name, shortDescription, category)
getRelatedProducts(productId, limit=4) // → product[]
getMinPrice(product)                  // → number
hasDiscount(product)                  // → boolean
getAvailableColors(product)           // → color[]
getAvailableMemory(product)           // → number[] (sorted)
formatPrice(price)                    // 169990 → '169 990 ₽'
formatMemory(memory)                  // 256 → '256 ГБ', 1024 → '1 ТБ'
getUsedProducts()                     // → usedProducts
```

### src/utils/product.js

```js
formatPrice(price)                    // Дубликат из products/index
formatMemory(memory)                  // Дубликат из products/index
getMinPrice(product)                  // → number
hasDiscount(product)                  // → boolean
getAvailableDimensionValues(product, dimKey)  // → [{id, name, ...}] из attributes
getAvailableColors(product)           // Из attributes.color или v.color
getAvailableMemory(product)           // Из attributes.memory или v.memory
getAvailableColorsFromProducts(products)     // Цвета из массива товаров
getAvailableMemoryFromProducts(products)     // Память из массива товаров
getAvailableSims(product)             // SIM-опции из attributes.sim или v.sim
getBrandSlug(brandName)               // 'Apple' → 'apple'
extractSeries(productName)            // 'iPhone 17 Pro Max' → 'iPhone 17'
getAvailableSeriesFromProducts(products)     // → string[]
```

### Другие утилиты

| Файл | Экспорт | Описание |
|------|---------|----------|
| `src/utils/color.js` | `isLightColor(hex)` | Проверка светлого цвета для контраста |
| `src/utils/pluralize.js` | `pluralize(count, forms)` | Склонение: `pluralize(5, ['товар','товара','товаров'])` → `'товаров'` |
| | `formatProductCount(count)` | `'5 товаров'` |
| `src/utils/phone.js` | `formatPhoneInput(value, prevValue)` | Маска `+7 (999) 123-45-67` |

## Stores (Zustand)

5 stores в `src/stores/`. Импорт: `import { useCartStore } from '../stores'`

### useCartStore (persist: 'cart', v2)

**State:** `items: CartItem[]` — `{ id, productId, variantId, quantity, attributes, color, memory, price, name, image }`
**Actions:** `addItem(product, variant)`, `removeItem(itemId)`, `updateQuantity(itemId, qty)`, `clearCart()`, `isInCart(productId, variantId)`, `getTotal()`, `getCount()`
**ID формула:** `${productId}-${variantId}`

### useProductStore (no persist)

**State:** `filters: { priceRange, colors[], memory[], brands[], inStock }`, `sortBy: 'popular'`, `viewMode: 'grid'`
**Actions:** `setFilter(key, value)`, `toggleArrayFilter(key, value)`, `resetFilters()`, `setSortBy(sortBy)`, `setViewMode(mode)`

### useRecentlyViewedStore (persist: 'recently-viewed', v1)

**State:** `items: string[]` — productId, новые в начале, макс 10
**Actions:** `addItem(productId)`, `clearItems()`

### useSearchStore (no persist)

**State:** `query`, `isOpen`, `results`, `isLoading`
**Actions:** `setQuery`, `setResults`, `setIsOpen`, `setIsLoading`, `reset()`

### useToastStore (no persist)

**State:** `toasts: { id, message, type }[]`
**Actions:** `addToast(message, type='success')` (автоудаление 3с), `removeToast(id)`
Витрина: обёртка `useToast()` хук. Админка: `react-hot-toast`.

## Хуки

| Хук | Сигнатура | Описание |
|-----|-----------|----------|
| `useProductVariant` | `(product) → { selections, setSelection, dimensions, getOptionsForDimension, currentVariant, selectedColor, selectedMemory, selectedSim, setSelectedColor, setSelectedMemory, setSelectedSim, colors, memoryOptions, simOptions, availableMemoryForColor }` | Управление вариантом. Dimensions API + legacy compat. Auto-fallback при несовместимых комбинациях |
| `useDebounce` | `(value, delay=300) → debouncedValue` | Дебаунс значения |
| `useMatchMedia` | `(query) → boolean` | CSS медиа-запрос (`false` initial, SSR-safe) |
| `useScrollPosition` | `(threshold=10) → { isScrolled }` | Позиция скролла (passive) |
| `useInView` | `(options?) → [ref, boolean]` | Intersection Observer (однократный, threshold 0.1) |
| `useToast` | `() → { toast(msg, type) }` | Обёртка над useToastStore |
| `useReducedMotion` | `() → boolean` | prefers-reduced-motion |
| `useFilterSync` | `(initialFilters, parseUrl, buildUrl) → { filters, sortBy, setSortBy, setFilter, resetFilters }` | Синхронизация фильтров ↔ URL. Доп. экспорты: `parseBrandPageUrl`, `buildBrandPageUrl`, `parseUsedPageUrl`, `buildUsedPageUrl`, `BRAND_PAGE_INITIAL_FILTERS`, `USED_PAGE_INITIAL_FILTERS` |
| `useCatalogQuery` | `(fetcher, deps=[]) → { data, loading, error, refetch }` | GET-запрос с loading/error. Отмена при unmount |
| `usePageTitle` | `(title) → void` | Установка document.title |
| `useProductFiltering` | `(products, filters, sortBy, options?) → product[]` | Мемоизированная фильтрация + сортировка. `options.extraFilters`, `options.sortNew` |

## Сервисы

### Витрина

**`src/services/catalogApi.js`** — публичный API:
```js
catalogApi.getCategories()                    // GET /api/public/categories
catalogApi.getCategoryBrands(slug)            // GET /api/public/categories/:slug/brands
catalogApi.getProducts({ category, brand, search, is_used })  // GET /api/public/products
catalogApi.getProduct(slug)                   // GET /api/public/products/:slug
catalogApi.getProductsBySlugs(slugs[])        // GET /api/public/products/by-slugs?slugs=...
catalogApi.search(query, options)             // GET /api/public/search?q=...
```

**`src/services/api.js`** — отправка форм (POST /api/requests):
```js
api.submitOrder({ name, phone, items })
api.submitQuickBuy({ name, phone, productName, variantInfo, productId })
api.submitContactForm({ name, phone })
api.submitRepairRequest({ name, phone, device, problem })
```

**`src/services/productMapper.js`** — маппинг snake_case → camelCase:
- `mapProduct(raw)` — один товар (строит attributes из legacy, вычисляет variantId)
- `mapProducts(rawList)` — массив
- `mapCategory(raw)` — категория

### Админка

**`src/admin/services/apiClient.js`** — fetch + JWT Bearer header + авто-signout при 401
**`src/admin/services/*Service.js`** — CRUD обёртки: `bannerService`, `blogService`, `categoryService`, `dashboardService`, `productService`, `requestService`, `serviceService`

**`src/admin/hooks/`:**
- `useAuth` (`.jsx`) — AuthProvider + useAuth(). Login/logout, проверка токена
- `useQuery(url)` → `{ data, loading, error, refetch }`
- `useMutation(method, url, opts)` → `{ mutate, loading }` + react-hot-toast
- `useImageUpload()` → `{ upload, uploading }`

## Компоненты

### UI (19) — `src/components/ui/`

| Компонент | Описание |
|-----------|----------|
| `Button` | Варианты: primary, secondary, outline, outline-white, white, ghost, glass, liquid. Размеры: sm, md, lg. Ripple-эффект |
| `Modal` | isOpen/onClose, title, размеры sm-full, Escape |
| `Drawer` | Боковая панель, side: left/right |
| `Tabs` | variant: underline/pills. Экспорт: TabList, Tab, TabPanel |
| `Badge` | variant: new/hit/sale/discount. + `BadgeGroup` |
| `Breadcrumbs` | items: [{label, href}] |
| `Toast` / `ToastContainer` | Уведомления (подключается в App.jsx) |
| `RangeSlider` | Двойной слайдер для цены |
| `Container` | Макс. ширина |
| `SectionHeader` | title + subtitle |
| `SectionDivider` | Разделитель |
| `Skeleton` | Анимированный скелетон |
| `CardSkeleton` | Скелет карточки товара |
| `ImageWithSkeleton` | Изображение со скелетоном при загрузке |
| `AnimatedSection` | Fade-in при скролле |
| `StaggeredList` | Staggered-анимация |
| `PageSkeleton` | Page-specific скелетоны для lazy-страниц (Service, Cart, Search, Used, Blog, About) |
| `ColorSwatch` | Свотч цвета, размеры sm/md/lg, selected/disabled |

### Header (4) — `src/components/Header/`
Header, TopBar, Navigation, MobileMenu (Drawer)

### Search (2) — `src/components/search/`
SearchInput, SearchDropdown

### Footer (5) — `src/components/Footer/`
Footer, FooterColumn, FooterContacts, FooterSubscribe, FooterBottom

### Catalog (3) — `src/components/catalog/`
ProductGrid (products, category, brand), ProductListCard (product, category, brand), SortDropdown

### Product (11) — `src/components/product/`
ColorSelector, MemorySelector, SimSelector, ProductGallery, ProductConfig, ProductActions, ProductBenefits, RelatedProducts, RecentlyViewed, QuickBuyModal

### Filters (5) — `src/components/filters/`
FilterSidebar (filters, availableMemory, availableBrands, priceRange, hideBrandFilter), CheckboxFilter, ColorFilter, ActiveFilters, UsedFilterSidebar

### Cart (2) — `src/components/cart/`
CartItem, CartRecommendations

### Service (9) — `src/components/Service/`
ServiceHero, ServiceIntro, ServiceFeatures, WhyUs, ServicePricing, HowWeWork, RepairForm, LoanerPhone, MobileService

### SEO (4) — `src/components/seo/JsonLd.jsx`
ProductJsonLd, BreadcrumbJsonLd, OrganizationJsonLd, LocalBusinessJsonLd

### Homepage — `src/components/`
Hero (Swiper), Categories + CategoryCard, ProductCards, Benefits + BenefitCard, InfoBlock, News + NewsCard, FAQ, AboutUs, ContactSection

## Data-файлы

| Файл | Ключевые экспорты |
|------|-------------------|
| `data/config.js` | `SITE_URL`, `LOCATIONS[]`, `CONTACTS` (phone, email, address, whatsapp, telegram, vk), `COMPANY` (name, legalName, inn, ogrnip) |
| `data/navigation.js` | `NAV_MAIN`, `NAV_MOBILE`, `FOOTER_SECTIONS` |
| `data/categories.js` | `CATEGORIES` |
| `data/constants.js` | `CAROUSEL.AUTOPLAY_DELAY` (20000), `PRICE.MAX` (500000), `DEBOUNCE.DEFAULT` (100) |
| `data/benefits.js` | Массив преимуществ |
| `data/faq.js` | FAQ-данные для аккордеона |
| `data/infoPages.js` | `INFO_PAGES` — контент: delivery, warranty, contacts, returns, faq, trade-in, credit, privacy, terms |
| `data/news.js` | Новости |
| `data/redirects.js` | `REDIRECTS[]` — `{ from, to }` для старых URL |
| `data/service.js` | Данные сервисного центра |
| `data/products/` | `iphone.js`, `mac.js`, `samsung.js`, `dyson.js`, `used.js` — массивы товаров |

## Стилизация

### Tailwind токены

**Цвета:** `gray-light` (#f5f5f7), `gray-medium` (#86868b), `gray-dark` (#1d1d1f)

**Border Radius:** `liquid` (20px), `liquid-lg` (28px), `card` (16px), `btn` (12px), `input` (12px)

**Тени:** `glass`, `glass-hover`, `liquid`, `liquid-hover`

**Анимации:** `fade-in-up`, `shimmer`, `scale-in`, `ripple`, `pulse-soft`

**Брейкпоинты:** `xs` (375px), `sm` (640px), `md` (768px), **`lg` (1024px — основной)**, `xl` (1280px). Mobile-first.

### Кастомные CSS-классы (`src/index.css`)

| Класс | Описание |
|-------|----------|
| `.liquid-glass` | Glassmorphism: белый 72%, blur 20px |
| `.liquid-glass-clear` | Прозрачный glassmorphism |
| `.liquid-glass-dark` | Тёмный glassmorphism |
| `.liquid-glass-scrolled` | Усиленный при скролле |
| `.liquid-glass-form` | Для форм поверх изображений |
| `.liquid-glass-reduced` | Fallback без backdrop-filter (a11y) |
| `.card-hover` | Hover: shadow + scale 1.02 |
| `.nav-link` | Ссылка навигации |
| `.section-padding` | `px-6 lg:px-60` |
| `.section-margin` | `mx-6 lg:mx-60` |
| `.text-fluid-2xl` / `.text-fluid-xl` / `.text-fluid-lg` | Fluid typography (clamp) |
| `.scrollbar-hide` | Скрытие скроллбара |
| `.input-dark` | Тёмный underline-инпут |

### Шрифты
- **Inter** — основной текст (system-ui fallback)
- **Unbounded** — заголовки h1-h6

## API

### Публичные (без авторизации)

| Метод | Эндпоинт | Cache | Описание |
|-------|----------|-------|----------|
| GET | `/api/public/categories` | 5 мин | Категории с брендами |
| GET | `/api/public/categories/:slug/brands` | 5 мин | Бренды категории (productCount, minPrice) |
| GET | `/api/public/products` | no-cache | Список с фильтрами (category, brand, search, is_used, page, limit≤100) |
| GET | `/api/public/products/:slug` | — | Детальная + relatedProducts[] |
| GET | `/api/public/products/by-slugs?slugs=...` | — | По slug-ам (корзина, недавние) |
| GET | `/api/public/search?q=...` | — | Поиск (макс 50) |
| GET | `/api/public/services` | 5 мин | Услуги с ценами |
| POST | `/api/requests` | — | Заявка (rate limit: 5/мин на IP). Типы: order, quick_buy, repair, contact |

### Защищённые (JWT Bearer)

| Ресурс | Эндпоинты |
|--------|-----------|
| Auth | `POST /api/auth/login`, `GET /api/auth/me` |
| Banners | CRUD + `PUT /api/banners/reorder` |
| Categories | CRUD + reorder (защита от удаления с товарами) |
| Products | CRUD + reorder (транзакция: товар→варианты→изображения→SIM→связи) |
| Brands | `GET /api/brands` |
| Services | CRUD + reorder |
| Blog | CRUD (draft→published устанавливает published_at) |
| Requests | `GET /api/requests` (фильтры: type, status, page), `PUT /api/requests/:id` (status, admin_notes) |
| Upload | `POST /api/upload` (multer, jpg/png/webp/gif, 5MB, type: products/banners/blog/categories) |
| Dashboard | `GET /api/dashboard/stats` |

**Логин:** `admin@appgrade.ru` / `admin123`, JWT 4 часа. При 401 → авто-logout.

### Image pipeline

`server/routes/image.js` — Sharp обработка с кэшем (`server/uploads/.cache/`).
Запрос: `/uploads/image.jpg?w=800&format=webp`
Допустимые ширины: 200, 400, 800, 1200, 1920px.

### Env-переменные

| Переменная | Default | Описание |
|-----------|---------|----------|
| `JWT_SECRET` | — | Секрет JWT (обязателен на проде) |
| `PORT` | 3001 | Порт Express |
| `NODE_ENV` | development | Окружение |
| `CORS_ORIGINS` | localhost:5173,5174 | Разрешённые домены |

## База данных

SQLite (better-sqlite3), WAL mode, foreign keys ON. Файл: `server/data/store.db`.

**14 таблиц:** admin_users, categories, brands, brand_categories, products, product_variants, product_images, product_sim_options, product_relations, banners, blog_posts, requests, service_items, service_prices

**17 индексов** на slug, category_id, brand_id, active, is_used, product_id, variant_id и др.

**Каскадное удаление:** products → variants → images (CASCADE), products → sim_options/relations (CASCADE), service_items → prices (CASCADE). Categories/brands → products — **без** CASCADE (защита).

**Seed** (`npm run seed`): 1 админ, 9 категорий, 3 бренда, 10 связей бренд-категория, товары из src/data/products/, 3 статьи блога, 2 баннера.

## Админка

### Роуты (`/admin/*`)

```
login                    → LoginPage
dashboard                → DashboardPage
banners, banners/new, banners/:id        → BannersPage / BannerEditPage
categories, categories/new, categories/:id → CategoriesPage / CategoryEditPage
products, products/new, products/:id      → ProductsPage / ProductEditPage
requests                 → RequestsPage
services, services/new, services/:id      → ServicesPage / ServiceEditPage
blog, blog/new, blog/:id → BlogListPage / BlogEditPage
```

### Ключевые компоненты (`src/admin/components/`)

| Компонент | Описание |
|-----------|----------|
| `DataTable` | Таблица с сортировкой и пагинацией |
| `VariantMatrix` | Матрица вариантов (цвет × память → цена/статус) |
| `RichTextEditor` | TipTap WYSIWYG (bold, italic, headings, images, links) |
| `SortableList` | Drag&drop на @dnd-kit |
| `SortableImages` | D&D сортировка + загрузка изображений |
| `ImageUploader` | Drag&drop загрузка с превью |
| `AdminSidebar` | Навигация + счётчик заявок |
| `AdminHeader` | User, logout, mobile menu |
| `StatusBadge` | Бейдж статуса |
| `ConfirmDialog` | Подтверждение удаления |
| `AdminModal` | Модальное окно |

### Сервисы (`src/admin/services/`)
`apiClient`, `bannerService`, `blogService`, `categoryService`, `dashboardService`, `productService`, `requestService`, `serviceService`

## Конвенции

- `.jsx` — с JSX, `.js` — без JSX (утилиты, stores, data, хуки без JSX)
- Компоненты: `PascalCase`, хуки: `use*`, stores: `use*Store`, константы: `UPPER_SNAKE_CASE`
- Порядок импортов: React → библиотеки → компоненты → хуки → утилиты → данные
- Навигация: `<Link to="...">` (не `<a href="...">`)
- Иконки: `import { Heart } from 'lucide-react'`
- Карусели: Swiper
- Коммиты на русском: `тип: описание` (feat, fix, refactor, docs, chore)
- Tailwind mobile-first, основной брейкпоинт `lg:`

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

## Решение проблем

- **Товар не в каталоге:** проверить category/brand, экспорт в index.js, хотя бы один вариант inStock: true
- **Фильтры не работают:** `useProductStore` из `../stores`, `resetFilters()` при смене категории
- **Изображения:** локальные — `import`, URL — проверить CORS, загруженные — сервер запущен
- **Корзина не сохраняется:** localStorage ключ `cart`, persist version 2
- **CORS в dev:** оба сервера запущены (`npm run dev:all`), Vite proxy настроен
- **JWT истёк:** 4 часа, авто-logout, перелогин на `/admin/login`
- **БД не создаётся:** удалить `server/data/store.db`, `npm run seed`
- **404 на проде:** SPA-редирект (`try_files $uri /index.html`)

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
