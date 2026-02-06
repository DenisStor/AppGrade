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
            → CategoryPage / BrandPage / ProductPage
        → Информационные страницы
    → Zustand stores (корзина, избранное, фильтры)
```

### Структура каталога (4-уровневая)

```
/catalog                           → CatalogPage (все категории)
/catalog/:category                 → CategoryPage (бренды категории)
/catalog/:category/:brand          → BrandPage (товары бренда)
/catalog/:category/:brand/:slug    → ProductPage (карточка товара)
```

**Пример:** `/catalog/smartphones/apple/iphone-17-pro-max`

**Категории:** `smartphones`, `laptops`, `tablets`, `watches`, `headphones`, `hairdryers`, `stylers`, `accessories`, `gaming`

**Бренды:** `apple`, `samsung`, `dyson`

## Компоненты

Полная документация: [docs/COMPONENTS.md](./docs/COMPONENTS.md)

### UI (18)

| Компонент | Путь | Описание |
|-----------|------|----------|
| Button | ui/Button.jsx | Кнопка с вариантами и ripple |
| Modal | ui/Modal.jsx | Модальное окно |
| Drawer | ui/Drawer.jsx | Боковая панель |
| Tabs | ui/Tabs.jsx | Табы (underline/pills) |
| Badge | ui/Badge.jsx | Бейдж (new/hit/sale/used) |
| Breadcrumbs | ui/Breadcrumbs.jsx | Хлебные крошки |
| Toast / ToastContainer | ui/Toast.jsx | Уведомления и контейнер |
| RangeSlider | ui/RangeSlider.jsx | Слайдер диапазона |
| Container | ui/Container.jsx | Контейнер |
| SectionHeader | ui/SectionHeader.jsx | Заголовок секции |
| SectionDivider | ui/SectionDivider.jsx | Разделитель |
| Skeleton | ui/Skeleton.jsx | Скелетон загрузки |
| CardSkeleton | ui/CardSkeleton.jsx | Скелетон карточки |
| PageSkeleton | ui/PageSkeleton.jsx | Скелетон страницы (Suspense fallback) |
| ImageWithSkeleton | ui/ImageWithSkeleton.jsx | Изображение со скелетоном |
| AnimatedSection | ui/AnimatedSection.jsx | Секция с анимацией |
| StaggeredList | ui/StaggeredList.jsx | Список с stagger-анимацией |

### Layout (9)

| Компонент | Путь | Описание |
|-----------|------|----------|
| Header | Header/Header.jsx | Главный хедер |
| TopBar | Header/TopBar.jsx | Верхняя панель |
| Navigation | Header/Navigation.jsx | Навигация |
| MobileMenu | Header/MobileMenu.jsx | Мобильное меню |
| Footer | Footer/Footer.jsx | Подвал |
| FooterColumn | Footer/FooterColumn.jsx | Колонка подвала |
| FooterContacts | Footer/FooterContacts.jsx | Контакты |
| FooterBottom | Footer/FooterBottom.jsx | Копирайт |
| ScrollToTop | ScrollToTop.jsx | Скролл к верху при навигации |

### Homepage (12)

| Компонент | Путь | Описание |
|-----------|------|----------|
| Hero | Hero/Hero.jsx | Главный баннер |
| Categories | Categories/Categories.jsx | Секция категорий |
| CategoryCard | Categories/CategoryCard.jsx | Карточка категории |
| ProductCards | ProductCard/ProductCards.jsx | Группа карточек товаров |
| Benefits | Benefits/Benefits.jsx | Преимущества |
| BenefitCard | Benefits/BenefitCard.jsx | Карточка преимущества |
| InfoBlock | InfoBlocks/InfoBlock.jsx | Информационный блок |
| News | News/News.jsx | Новости |
| NewsCard | News/NewsCard.jsx | Карточка новости |
| FAQ | FAQ/FAQ.jsx | FAQ-аккордеон |
| AboutUs | AboutUs/AboutUs.jsx | О нас |
| ContactSection | ContactSection/ContactSection.jsx | Контакты |

### Catalog (3)

| Компонент | Путь | Описание |
|-----------|------|----------|
| ProductGrid | catalog/ProductGrid.jsx | Сетка товаров |
| ProductListCard | catalog/ProductListCard.jsx | Карточка товара |
| SortDropdown | catalog/SortDropdown.jsx | Сортировка |

### Product (9)

| Компонент | Путь | Описание |
|-----------|------|----------|
| ColorSelector | product/ColorSelector.jsx | Выбор цвета |
| MemorySelector | product/MemorySelector.jsx | Выбор памяти |
| SimSelector | product/SimSelector.jsx | Выбор SIM |
| ProductGallery | product/ProductGallery.jsx | Галерея |
| ProductConfig | product/ProductConfig.jsx | Конфигуратор |
| ProductActions | product/ProductActions.jsx | Кнопки действий |
| ProductBenefits | product/ProductBenefits.jsx | Преимущества |
| RelatedProducts | product/RelatedProducts.jsx | Похожие товары |
| RecentlyViewed | product/RecentlyViewed.jsx | Недавно просмотренные |
| QuickBuyModal | product/QuickBuyModal.jsx | Быстрый заказ |

### Filters (5)

| Компонент | Путь | Описание |
|-----------|------|----------|
| FilterSidebar | filters/FilterSidebar.jsx | Панель фильтров |
| UsedFilterSidebar | filters/UsedFilterSidebar.jsx | Фильтры для б/у товаров |
| CheckboxFilter | filters/CheckboxFilter.jsx | Чекбокс-фильтр |
| ColorFilter | filters/ColorFilter.jsx | Фильтр по цвету |
| ActiveFilters | filters/ActiveFilters.jsx | Активные фильтры |

### Search (2)

| Компонент | Путь | Описание |
|-----------|------|----------|
| SearchInput | search/SearchInput.jsx | Поле поиска |
| SearchDropdown | search/SearchDropdown.jsx | Результаты поиска |

### Cart (2)

| Компонент | Путь | Описание |
|-----------|------|----------|
| CartItem | cart/CartItem.jsx | Элемент корзины |
| CartRecommendations | cart/CartRecommendations.jsx | Рекомендации в корзине |

### SEO (4)

| Компонент | Путь | Описание |
|-----------|------|----------|
| ProductJsonLd | seo/JsonLd.jsx | Schema.org для товара |
| BreadcrumbJsonLd | seo/JsonLd.jsx | Schema.org для хлебных крошек |
| OrganizationJsonLd | seo/JsonLd.jsx | Schema.org для организации |
| LocalBusinessJsonLd | seo/JsonLd.jsx | Schema.org для локального бизнеса |

### Service (9)

| Компонент | Путь | Описание |
|-----------|------|----------|
| ServiceHero | Service/ServiceHero.jsx | Split-screen баннер |
| ServiceIntro | Service/ServiceIntro.jsx | Вводная секция сервиса |
| ServiceFeatures | Service/ServiceFeatures.jsx | Фичи сервиса (Быстро, Как дома, На связи) |
| WhyUs | Service/WhyUs.jsx | Преимущества сервиса |
| ServicePricing | Service/ServicePricing.jsx | Прайс-лист услуг |
| HowWeWork | Service/HowWeWork.jsx | Этапы работы (01-04) |
| RepairForm | Service/RepairForm.jsx | Форма записи на ремонт |
| LoanerPhone | Service/LoanerPhone.jsx | Блок про подменный iPhone |
| MobileService | Service/MobileService.jsx | Выездной сервис |

## Хуки

Полная документация: [docs/HOOKS.md](./docs/HOOKS.md)

| Хук | Сигнатура | Описание |
|-----|-----------|----------|
| useProductVariant | `useProductVariant(product)` | Управление вариантом товара |
| useDebounce | `useDebounce(value, delay=300)` | Дебаунс значения |
| useMatchMedia | `useMatchMedia(query)` | CSS медиа-запросы |
| useScrollPosition | `useScrollPosition(threshold=10)` | Позиция скролла |
| useInView | `useInView(options)` | Видимость элемента |
| useToast | `useToast()` | Уведомления |
| useReducedMotion | `useReducedMotion()` | Prefers-reduced-motion |
| useFilterSync | `useFilterSync(initialFilters, parseUrl, buildUrl)` | Синхронизация фильтров с URL |

```js
// Пример использования
import { useProductVariant } from '../hooks/useProductVariant'
const { selectedColor, currentVariant, setSelectedColor } = useProductVariant(product)

import { useDebounce } from '../hooks/useDebounce'
const debouncedQuery = useDebounce(searchQuery, 300)

import { useToast } from '../hooks/useToast'
const { toast } = useToast()
toast('Добавлено в корзину', 'success')
```

## Data-файлы

| Файл | Экспорты | Описание |
|------|----------|----------|
| config.js | `CONTACTS`, `COMPANY` | Контакты магазина |
| navigation.js | `NAV_MAIN`, `NAV_MOBILE`, `FOOTER_SECTIONS` | Меню навигации |
| categories.js | `CATEGORIES` | Категории товаров |
| benefits.js | `BENEFITS` | Преимущества |
| news.js | `NEWS` | Новости |
| faq.js | `FAQ` | Вопросы-ответы |
| constants.js | `PRICE`, `SORT_OPTIONS` | Константы |
| infoPages.js | `INFO_PAGES` | Информационные страницы |
| redirects.js | `REDIRECTS` | Редиректы URL |
| social.jsx | `SOCIAL_LINKS` | Соцсети |
| service.js | `SERVICE_FEATURES`, `WHY_US`, `SERVICE_PRICING`, `HOW_WE_WORK` | Данные сервиса |
| products/used.js | `usedProducts`, `CONDITIONS` | Б/У товары |

## Система товаров

### Структура продукта

```js
// src/data/products/iphone.js
{
  id: 'iphone-17-pro-max',
  slug: 'iphone-17-pro-max',
  category: 'smartphones',
  brand: 'Apple',  // Обязательно для 4-уровневой структуры URL
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
  // Товары
  getProductsByCategory,           // (categorySlug) → products[]
  getProductsByCategoryAndBrand,   // (categorySlug, brandSlug) → products[]
  getProductBySlug,                // (slug) → product

  // Бренды
  brands,                          // { apple: {...}, samsung: {...}, dyson: {...} }
  getBrandsByCategory,             // (categorySlug) → brand[]
  getBrandBySlug,                  // (slug) → brand | null
  getBrandSlug,                    // (brandName) → slug | null

  // Варианты
  getAvailableColors,              // (product) → colors[]
  getAvailableMemory,              // (product) → [128, 256, 512]

  // Утилиты
  getMinPrice,                     // (product) → number
  hasDiscount,                     // (product) → boolean
  formatPrice,                     // (price) → '169 990 ₽'
  formatMemory,                    // (1024) → '1 ТБ'
  searchProducts,                  // (query) → products[]
  getProductById,                  // (id) → product | undefined
  getCategoryBySlug,               // (slug) → category | null
  getRelatedProducts,              // (productId, limit?) → products[]
  CATALOG_CATEGORIES,              // массив всех категорий

  // Б/У товары
  usedProducts,                    // массив б/у товаров
  getUsedProducts,                 // () → usedProducts[]
  CONDITIONS,                      // { perfect, excellent, good }
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

## Страницы

### Каталог

| Маршрут | Страница | Описание |
|---------|----------|----------|
| `/catalog` | CatalogPage | Все категории |
| `/catalog/:category` | CategoryPage | Бренды категории |
| `/catalog/:category/:brand` | BrandPage | Товары бренда |
| `/catalog/:category/:brand/:slug` | ProductPage | Карточка товара |

### Сервис

| Маршрут | Страница | Описание |
|---------|----------|----------|
| `/service` | ServicePage | Страница ремонта и сервиса |

### Б/У товары

| Маршрут | Страница | Описание |
|---------|----------|----------|
| `/used` | UsedPage | Каталог проверенных б/у товаров |

### Корзина и поиск

| Маршрут | Страница | Описание |
|---------|----------|----------|
| `/cart` | CartPage | Корзина |
| `/search` | SearchPage | Результаты поиска |

### Блог

| Маршрут | Страница | Описание |
|---------|----------|----------|
| `/blog` | BlogPage | Список статей |
| `/blog/:id` | BlogPostPage | Статья блога |

### Информационные

| Маршрут | Страница | Описание |
|---------|----------|----------|
| `/about` | AboutPage | О компании |
| `/delivery` | InfoPage | Доставка |
| `/warranty` | InfoPage | Гарантия |
| `/returns` | InfoPage | Возврат |
| `/contacts` | InfoPage | Контакты |
| `/faq` | InfoPage | FAQ |
| `/privacy` | InfoPage | Политика конфиденциальности |
| `/trade-in` | InfoPage | Trade-in |
| `/credit` | InfoPage | Рассрочка и кредит |
| `/terms` | InfoPage | Пользовательское соглашение |

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

## Troubleshooting

### Товар не отображается в каталоге

1. Проверить `category` и `brand` в объекте товара
2. Убедиться, что товар экспортирован в `src/data/products/index.js`
3. Проверить, что хотя бы один вариант имеет `inStock: true`

### Фильтры не работают

1. Проверить, что `useProductStore` импортирован из `../stores`
2. Убедиться, что `resetFilters()` вызывается при смене категории/бренда
3. Проверить структуру `filters` в компоненте

### Изображения не загружаются

1. Для локальных: использовать `import img from '../assets/...'`
2. Для URL: проверить CORS и доступность ресурса
3. Проверить, что `images` в варианте — массив

### Корзина не сохраняется

1. Проверить localStorage в DevTools
2. Убедиться, что `persist` настроен в `useCartStore`
3. Очистить localStorage и перезагрузить страницу

### Роутинг 404 на продакшене

1. Настроить редиректы на сервере (SPA)
2. Для Vercel/Netlify: добавить `vercel.json` / `_redirects`
3. Проверить базовый путь в `vite.config.js`

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

## Документация

- [Компоненты](./docs/COMPONENTS.md) — полное описание всех компонентов с props
- [Хуки](./docs/HOOKS.md) — документация кастомных хуков
