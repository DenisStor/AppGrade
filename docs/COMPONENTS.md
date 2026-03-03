# Компоненты

Полная документация компонентов проекта ElectronicsStore.

## Оглавление

- [UI (20)](#ui-20)
- [Layout (11)](#layout-11)
- [Homepage (14)](#homepage-14)
- [Catalog (3)](#catalog-3)
- [Product (11)](#product-11)
- [Filters (8)](#filters-8)
- [Search (2)](#search-2)
- [Cart (2)](#cart-2)
- [SEO (4)](#seo-4)
- [Service (9)](#service-9)
- [Навигация (3)](#навигация-3)
- [Админка (11)](#админка-11)

---

## UI (20)

Базовые переиспользуемые UI-компоненты.

### Button

Кнопка с поддержкой вариантов, размеров и ripple-эффектом.

**Путь:** `src/components/ui/Button.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | ReactNode | — | Содержимое кнопки |
| `variant` | string | `'primary'` | Вариант: `primary`, `secondary`, `outline`, `outline-white`, `white`, `ghost`, `glass`, `liquid` |
| `size` | string | `'md'` | Размер: `sm`, `md`, `lg` |
| `className` | string | `''` | Дополнительные классы |
| `onClick` | function | — | Обработчик клика |

```jsx
import { Button } from '../components/ui/Button'

<Button variant="primary" size="md">Купить</Button>
<Button variant="outline">Подробнее</Button>
<Button variant="glass" size="lg">В корзину</Button>
```

### Modal

Модальное окно с backdrop и поддержкой Escape.

**Путь:** `src/components/ui/Modal.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `isOpen` | boolean | — | Состояние открытия |
| `onClose` | function | — | Закрытие модалки |
| `title` | string | — | Заголовок (опционально) |
| `children` | ReactNode | — | Содержимое |
| `size` | string | `'md'` | Размер: `sm`, `md`, `lg`, `xl`, `full` |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { Modal } from '../components/ui/Modal'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Оформление">
  <p>Содержимое модалки</p>
</Modal>
```

### Drawer

Выдвижная боковая панель.

**Путь:** `src/components/ui/Drawer.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `isOpen` | boolean | — | Состояние открытия |
| `onClose` | function | — | Закрытие панели |
| `title` | string | — | Заголовок |
| `children` | ReactNode | — | Содержимое |
| `side` | string | `'right'` | Сторона: `left`, `right` |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { Drawer } from '../components/ui/Drawer'

<Drawer isOpen={cartOpen} onClose={() => setCartOpen(false)} title="Корзина">
  <CartItems />
</Drawer>
```

### Tabs

Компонент табов с вариантами стилей.

**Путь:** `src/components/ui/Tabs.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `tabs` | array | `[]` | Массив: `{ id, label, content }` |
| `defaultTab` | string | — | ID активного таба |
| `onChange` | function | — | Callback смены таба |
| `variant` | string | `'underline'` | Вариант: `underline`, `pills` |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { Tabs } from '../components/ui/Tabs'

<Tabs
  tabs={[
    { id: 'desc', label: 'Описание', content: <Description /> },
    { id: 'specs', label: 'Характеристики', content: <Specs /> },
  ]}
  defaultTab="desc"
/>
```

**Дополнительные экспорты:** `TabList`, `Tab`, `TabPanel` — для ручной сборки табов.

### Badge

Бейдж товара (новинка, хит, скидка).

**Путь:** `src/components/ui/Badge.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `variant` | string | `'new'` | Вариант: `new`, `hit`, `sale`, `discount` |
| `label` | string | — | Кастомный текст |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { Badge, BadgeGroup } from '../components/ui/Badge'

<Badge variant="new" />
<Badge variant="discount" label="-15%" />
<BadgeGroup badges={['new', 'hit']} />
```

**Дополнительный экспорт:** `BadgeGroup` — группа бейджей из массива.

### Breadcrumbs

Хлебные крошки навигации.

**Путь:** `src/components/ui/Breadcrumbs.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `items` | array | `[]` | Массив: `{ label, href }` |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { Breadcrumbs } from '../components/ui/Breadcrumbs'

<Breadcrumbs items={[
  { label: 'Каталог', href: '/catalog' },
  { label: 'iPhone', href: '/catalog/smartphones/apple' },
  { label: 'iPhone 17 Pro Max' }  // последний без href
]} />
```

### Toast / ToastContainer

Уведомление и контейнер уведомлений.

**Путь:** `src/components/ui/Toast.jsx`

**Экспорты:** `ToastContainer` — контейнер, подключается в `App.jsx`.

```jsx
import { useToast } from '../hooks/useToast'

const { toast } = useToast()
toast('Товар добавлен в корзину', 'success')
```

### RangeSlider

Слайдер диапазона (для фильтра цены).

**Путь:** `src/components/ui/RangeSlider.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `min` | number | — | Минимальное значение |
| `max` | number | — | Максимальное значение |
| `step` | number | — | Шаг |
| `value` | array | — | Текущее значение `[min, max]` |
| `onChange` | function | — | Callback изменения |

```jsx
import { RangeSlider } from '../components/ui/RangeSlider'

<RangeSlider
  min={0}
  max={500000}
  step={1000}
  value={[10000, 200000]}
  onChange={([min, max]) => setPriceRange([min, max])}
/>
```

### Container

Контейнер с максимальной шириной.

**Путь:** `src/components/ui/Container.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | ReactNode | — | Содержимое |
| `className` | string | `''` | Дополнительные классы |

### SectionHeader

Заголовок секции с подзаголовком.

**Путь:** `src/components/ui/SectionHeader.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `title` | string | — | Заголовок |
| `subtitle` | string | — | Подзаголовок |
| `className` | string | `''` | Дополнительные классы |

### SectionDivider

Разделитель секций.

**Путь:** `src/components/ui/SectionDivider.jsx`

### Skeleton

Скелетон для загрузки.

**Путь:** `src/components/ui/Skeleton.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `className` | string | `''` | Классы (размеры) |

```jsx
<Skeleton className="w-full h-48 rounded-xl" />
```

### CardSkeleton

Скелетон карточки товара.

**Путь:** `src/components/ui/CardSkeleton.jsx`

### ImageWithSkeleton

Изображение со скелетоном при загрузке.

**Путь:** `src/components/ui/ImageWithSkeleton.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `src` | string | — | URL изображения |
| `alt` | string | — | Alt-текст |
| `className` | string | `''` | Классы |

### AnimatedSection

Секция с анимацией появления.

**Путь:** `src/components/ui/AnimatedSection.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | ReactNode | — | Содержимое |
| `className` | string | `''` | Классы |

### StaggeredList

Список с staggered-анимацией элементов.

**Путь:** `src/components/ui/StaggeredList.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | ReactNode | — | Элементы списка |
| `staggerDelay` | number | — | Задержка между элементами |

### PageSkeleton

Page-specific скелетоны для lazy-loaded страниц. Каждый повторяет layout целевой страницы и обёрнут в `PageLayout` (Header/Footer видны сразу).

**Путь:** `src/components/ui/PageSkeleton.jsx`

| Компонент | Структура |
|-----------|-----------|
| `PageSkeleton` | Generic grid 2×4 карточек (обратная совместимость, без PageLayout) |
| `ServicePageSkeleton` | Hero + 2 колонки (текст + фото) + таблица прайсов |
| `CartPageSkeleton` | Title + grid 2/3 товары-полоски + 1/3 sidebar |
| `SearchPageSkeleton` | Breadcrumbs + title + grid 2×3 карточек |
| `UsedPageSkeleton` | Breadcrumbs + hero-banner + toolbar + sidebar + grid |
| `BlogPageSkeleton` | Breadcrumbs + title + subtitle + grid карточек (aspect 2:1) |
| `AboutPageSkeleton` | Breadcrumbs + 2 колонки (текст + фото) + 4 feature-карточки |

```jsx
import { SearchPageSkeleton } from '../components/ui/PageSkeleton'

<Suspense fallback={<SearchPageSkeleton />}>
  <SearchPage />
</Suspense>
```

### ColorSwatch

Свотч выбора цвета с поддержкой размеров, состояний selected/disabled.

**Путь:** `src/components/ui/ColorSwatch.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `color` | object | — | `{ id, name, hex }` |
| `selected` | boolean | `false` | Выбран ли цвет |
| `size` | string | `'md'` | Размер: `sm`, `md`, `lg` |
| `showCheck` | boolean | `true` | Показывать галочку при выборе |
| `disabled` | boolean | `false` | Заблокирован |
| `disabledStrike` | boolean | `false` | Показывать зачёркивание при disabled |
| `onClick` | function | — | Обработчик клика |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { ColorSwatch } from '../components/ui/ColorSwatch'

<ColorSwatch
  color={{ id: 'black', name: 'Чёрный', hex: '#1d1d1f' }}
  selected={selectedColor === 'black'}
  onClick={() => setSelectedColor('black')}
/>
```

### FloatingCallButton

Плавающая кнопка звонка (fixed bottom-right). Видна только на мобильных (`lg:hidden`).

**Путь:** `src/components/ui/FloatingCallButton.jsx`

Без props. Ссылка из `CONTACTS.phoneLink`. Пульсирующая анимация (ping). Z-index 40.

---

## Layout (11)

Компоненты структуры страницы.

### Header

Главный хедер сайта.

**Путь:** `src/components/Header/Header.jsx`

Включает: TopBar, Navigation, поиск, корзину.

### TopBar

Верхняя панель с контактами.

**Путь:** `src/components/Header/TopBar.jsx`

### Navigation

Основное меню навигации.

**Путь:** `src/components/Header/Navigation.jsx`

### MobileMenu

Мобильное меню (Drawer).

**Путь:** `src/components/Header/MobileMenu.jsx`

### Footer

Подвал сайта.

**Путь:** `src/components/Footer/Footer.jsx`

### FooterColumn

Колонка подвала с ссылками.

**Путь:** `src/components/Footer/FooterColumn.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `title` | string | — | Заголовок колонки |
| `links` | array | — | Массив ссылок |

### FooterContacts

Контакты в подвале.

**Путь:** `src/components/Footer/FooterContacts.jsx`

### FooterSubscribe

Форма подписки на рассылку (email + кнопка).

**Путь:** `src/components/Footer/FooterSubscribe.jsx`

### FooterBottom

Нижняя часть подвала (копирайт, соцсети).

**Путь:** `src/components/Footer/FooterBottom.jsx`

### InfoLayout

Лейаут для информационных страниц (delivery, warranty, faq, terms и др.).

**Путь:** `src/layouts/InfoLayout.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `title` | string | — | Заголовок страницы |
| `children` | ReactNode | — | Содержимое |
| `hasContent` | boolean | — | Если `true` — контент слева (max-w-3xl), если `false` — центрированный |

Структура: Header → main → Footer → BottomNav.

### ScrollToTop

Скролл к верху страницы при навигации.

**Путь:** `src/components/ScrollToTop.jsx`

Подключается в `App.jsx`. Использует `useLocation` из React Router.

---

## Homepage (14)

Компоненты главной страницы.

### Hero

Главный баннер (Swiper-карусель).

**Путь:** `src/components/Hero/Hero.jsx`

### Categories

Секция категорий.

**Путь:** `src/components/Categories/Categories.jsx`

### CategoryCard

Карточка категории.

**Путь:** `src/components/Categories/CategoryCard.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `category` | object | — | Объект категории |

### ProductCards

Группа карточек товаров.

**Путь:** `src/components/ProductCard/ProductCards.jsx`

### Benefits

Секция преимуществ.

**Путь:** `src/components/Benefits/Benefits.jsx`

### BenefitCard

Карточка преимущества.

**Путь:** `src/components/Benefits/BenefitCard.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `icon` | ReactNode | — | Иконка |
| `title` | string | — | Заголовок |
| `description` | string | — | Описание |

### InfoBlock

Информационный блок.

**Путь:** `src/components/InfoBlocks/InfoBlock.jsx`

### News

Секция новостей.

**Путь:** `src/components/News/News.jsx`

### NewsCard

Карточка новости.

**Путь:** `src/components/News/NewsCard.jsx`

### FAQ

Секция FAQ (аккордеон).

**Путь:** `src/components/FAQ/FAQ.jsx`

### AboutUs

Секция "О нас" с видео-фоном.

**Путь:** `src/components/AboutUs/AboutUs.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `showDivider` | boolean | `true` | Показывать разделитель сверху |

Включает видео с play/pause/volume контролами. Видео автовоспроизводится (muted). Слайдер громкости (`volume-slider`).

### ContactSection

Секция контактов с карточками локаций.

**Путь:** `src/components/ContactSection/ContactSection.jsx`

Включает: карточки `LocationCard` для каждого магазина, ссылки на мессенджеры (из `SOCIAL_LINKS`), карта Яндекс.

### LocationCard

Карточка физического местоположения магазина.

**Путь:** `src/components/ContactSection/LocationCard.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `location` | object | — | `{ image, name, address, description, mapUrl, workHours }` |

Адаптивная карточка: 200px (sm: 220px, lg: 370px). Ссылка "Показать на карте", режим работы.

---

## Catalog (3)

Компоненты каталога товаров.

### ProductGrid

Сетка карточек товаров.

**Путь:** `src/components/catalog/ProductGrid.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `products` | array | `[]` | Массив товаров |
| `category` | string | — | Слаг категории |
| `brand` | string | — | Слаг бренда |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { ProductGrid } from '../components/catalog/ProductGrid'

<ProductGrid
  products={products}
  category="smartphones"
  brand="apple"
/>
```

### ProductListCard

Карточка товара в каталоге.

**Путь:** `src/components/catalog/ProductListCard.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `product` | object | — | Объект товара |
| `category` | string | — | Слаг категории |
| `brand` | string | — | Слаг бренда |

### SortDropdown

Выпадающий список сортировки.

**Путь:** `src/components/catalog/SortDropdown.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `value` | string | — | Текущая сортировка |
| `onChange` | function | — | Callback изменения |

---

## Product (11)

Компоненты страницы товара.

### ColorSelector

Выбор цвета товара.

**Путь:** `src/components/product/ColorSelector.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `colors` | array | `[]` | Доступные цвета |
| `selected` | string | — | ID выбранного цвета |
| `onChange` | function | — | Callback изменения |
| `variants` | array | `[]` | Все варианты товара |
| `className` | string | `''` | Дополнительные классы |

```jsx
import { ColorSelector } from '../components/product/ColorSelector'

<ColorSelector
  colors={colors}
  selected={selectedColor}
  onChange={setSelectedColor}
  variants={product.variants}
/>
```

### MemorySelector

Выбор объёма памяти.

**Путь:** `src/components/product/MemorySelector.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `options` | array | `[]` | Варианты памяти `[128, 256, 512]` |
| `selected` | number | — | Выбранный объём |
| `onChange` | function | — | Callback изменения |
| `availableForColor` | array | `[]` | Доступность для цвета |
| `className` | string | `''` | Дополнительные классы |

### SimSelector

Выбор типа SIM-карты.

**Путь:** `src/components/product/SimSelector.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `options` | array | `[]` | Варианты SIM |
| `selected` | string | — | ID выбранного варианта |
| `onChange` | function | — | Callback изменения |

### DimensionSelector

Универсальный селектор измерений (для dimensions API).

**Путь:** `src/components/product/DimensionSelector.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `label` | string | — | Заголовок ("Цвет", "Память") |
| `options` | array | `[]` | `[{ id, name }]` — варианты |
| `selected` | string\|null | — | ID выбранного |
| `onChange` | function | — | `(id) => void` |
| `className` | string | `''` | Дополнительные классы |

```jsx
<DimensionSelector
  label="Память"
  options={getOptionsForDimension('memory')}
  selected={selections.memory}
  onChange={(val) => setSelection('memory', val)}
/>
```

### ProductGallery

Галерея изображений товара.

**Путь:** `src/components/product/ProductGallery.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `images` | array | — | Массив URL изображений |
| `productName` | string | — | Название для alt |

### ProductConfig

Конфигуратор товара. Поддерживает Dimensions API (DimensionSelector для каждого измерения) и Legacy API (ColorSelector + MemorySelector + SimSelector).

**Путь:** `src/components/product/ProductConfig.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `product` | object | — | Объект товара |
| `variant` | object | — | Текущий вариант |
| `onColorChange` | function | — | Callback смены цвета |
| `onMemoryChange` | function | — | Callback смены памяти |
| `onSimChange` | function | — | Callback смены SIM |

### ProductActions

Кнопки действий (купить, в корзину, избранное).

**Путь:** `src/components/product/ProductActions.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `product` | object | — | Объект товара |
| `variant` | object | — | Текущий вариант |
| `sim` | string | — | Выбранный SIM |

### ProductBenefits

Преимущества товара (гарантия, доставка).

**Путь:** `src/components/product/ProductBenefits.jsx`

### RelatedProducts

Похожие товары.

**Путь:** `src/components/product/RelatedProducts.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `productIds` | array | — | ID связанных товаров |

### RecentlyViewed

Недавно просмотренные товары.

**Путь:** `src/components/product/RecentlyViewed.jsx`

### QuickBuyModal

Модалка быстрого заказа с inline-валидацией форм.

**Путь:** `src/components/product/QuickBuyModal.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `isOpen` | boolean | — | Состояние открытия |
| `onClose` | function | — | Callback закрытия |
| `product` | object | — | Товар |
| `variant` | object | — | Вариант |

Маска телефона (`formatPhoneInput`), чекбокс согласия на обработку данных, inline-ошибки валидации.

---

## Filters (8)

Компоненты фильтрации.

### FilterSidebar

Боковая панель фильтров каталога. Поддерживает фильтр по серии товаров (extractSeries).

**Путь:** `src/components/filters/FilterSidebar.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `filters` | object | — | Текущие фильтры (включая `series[]`) |
| `availableMemory` | array | `[]` | Доступные варианты памяти |
| `availableBrands` | array | `[]` | Доступные бренды |
| `availableSeries` | array | `[]` | Доступные серии |
| `priceRange` | array | `[0, MAX]` | Диапазон цен |
| `onFilterChange` | function | — | Callback изменения |
| `onReset` | function | — | Сброс фильтров |
| `hideBrandFilter` | boolean | `false` | Скрыть фильтр брендов |
| `className` | string | `''` | Дополнительные классы |

### CheckboxFilter

Фильтр с чекбоксами.

**Путь:** `src/components/filters/CheckboxFilter.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `options` | array | — | `[{ value, label }]` |
| `selected` | array | — | Выбранные значения |
| `onChange` | function | — | Callback изменения |

### ColorFilter

Фильтр по цвету.

**Путь:** `src/components/filters/ColorFilter.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `colors` | array | — | Доступные цвета |
| `selected` | array | — | Выбранные цвета |
| `onChange` | function | — | Callback изменения |

### ActiveFilters

Активные фильтры (чипы с крестиком). Поддерживает сброс фильтров серии.

**Путь:** `src/components/filters/ActiveFilters.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `filters` | object | — | Активные фильтры (включая `series[]`) |
| `onRemove` | function | — | Удаление фильтра |
| `onReset` | function | — | Сброс всех |

### UsedFilterSidebar

Боковая панель фильтров для б/у товаров.

**Путь:** `src/components/filters/UsedFilterSidebar.jsx`

### EmptyFilterResults

Заглушка при отсутствии результатов фильтрации.

**Путь:** `src/components/filters/EmptyFilterResults.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `onReset` | function | — | Callback сброса фильтров |

"Товары не найдены" + кнопка "Сбросить фильтры". Анимация `animate-fade-in`.

### FilterDrawer

Боковая панель фильтров для мобильных (обёртка над Drawer).

**Путь:** `src/components/filters/FilterDrawer.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `isOpen` | boolean | — | Видимость |
| `onClose` | function | — | Callback закрытия |
| `filteredCount` | number | — | Количество найденных товаров |
| `children` | ReactNode | — | Содержимое фильтров |

Side: left. Внизу кнопка "Показать {количество}" (formatProductCount).

### MobileFilterButton

Кнопка открытия фильтров на мобильных.

**Путь:** `src/components/filters/MobileFilterButton.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `onClick` | function | — | Callback открытия |
| `activeCount` | number | — | Количество активных фильтров (бейдж) |
| `className` | string | `''` | Дополнительные классы |

---

## Search (2)

Компоненты поиска.

### SearchInput

Поле поиска.

**Путь:** `src/components/search/SearchInput.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `value` | string | — | Значение |
| `onChange` | function | — | Callback изменения |
| `onSubmit` | function | — | Callback отправки |
| `placeholder` | string | — | Плейсхолдер |

### SearchDropdown

Выпадающий список результатов поиска.

**Путь:** `src/components/search/SearchDropdown.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `results` | array | — | Результаты поиска |
| `isOpen` | boolean | — | Состояние открытия |
| `onClose` | function | — | Callback закрытия |

---

## Cart (2)

Компоненты корзины.

### CartItem

Элемент корзины.

**Путь:** `src/components/cart/CartItem.jsx`

### CartRecommendations

Рекомендации в корзине.

**Путь:** `src/components/cart/CartRecommendations.jsx`

---

## SEO (4)

SEO-компоненты. Все экспортируются из одного файла.

**Путь:** `src/components/seo/JsonLd.jsx`

### ProductJsonLd

Структурированные данные Schema.org для товара.

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `product` | object | — | Объект товара |
| `variant` | object | — | Текущий вариант |
| `category` | string | — | Слаг категории |
| `brand` | string | — | Слаг бренда |

```jsx
import { ProductJsonLd } from '../components/seo/JsonLd'

<ProductJsonLd product={product} variant={variant} category="smartphones" brand="apple" />
```

### BreadcrumbJsonLd

Структурированные данные для хлебных крошек.

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `items` | array | `[]` | Массив `{ label, href }` |

### OrganizationJsonLd

Структурированные данные об организации. Без пропсов — берёт данные из `config.js`.

### LocalBusinessJsonLd

Структурированные данные о локальном бизнесе. Без пропсов — берёт данные из `config.js`.

---

## Service (9)

Компоненты страницы сервиса.

### ServiceHero

Split-screen баннер сервиса.

**Путь:** `src/components/Service/ServiceHero.jsx`

### ServiceIntro

Вводная секция сервиса.

**Путь:** `src/components/Service/ServiceIntro.jsx`

### ServiceFeatures

Фичи сервиса (Быстро, Как дома, На связи).

**Путь:** `src/components/Service/ServiceFeatures.jsx`

### WhyUs

Преимущества сервиса.

**Путь:** `src/components/Service/WhyUs.jsx`

### ServicePricing

Прайс-лист услуг.

**Путь:** `src/components/Service/ServicePricing.jsx`

### HowWeWork

Этапы работы (01-04).

**Путь:** `src/components/Service/HowWeWork.jsx`

### RepairForm

Форма записи на ремонт.

**Путь:** `src/components/Service/RepairForm.jsx`

### LoanerPhone

Блок про подменный iPhone.

**Путь:** `src/components/Service/LoanerPhone.jsx`

### MobileService

Выездной сервис.

**Путь:** `src/components/Service/MobileService.jsx`

---

## Навигация (3)

### BottomNav

Нижняя навигация для мобильных (4 табы: Главная, Каталог, Сервис, Корзина).

**Путь:** `src/components/BottomNav.jsx`

Без props. Видима только на мобильных (`lg:hidden`). Активная таб — `text-gray-dark`. Счётчик товаров в корзине (до 99+). Z-index 40. Класс `pb-safe` для safe-area iPhone.

### ScrollToTop

Скролл наверх при смене маршрута.

**Путь:** `src/components/ScrollToTop.jsx`

### ErrorBoundary

Обработка ошибок React. Используется в CatalogLayout.

**Путь:** `src/components/ErrorBoundary.jsx`

---

## Админка (11)

Компоненты админ-панели (`src/admin/components/`).

### AdminSidebar

Боковое меню навигации (6 пунктов + счётчик заявок).

**Путь:** `src/admin/components/AdminSidebar.jsx`

### AdminHeader

Верхняя панель (user, logout, mobile menu).

**Путь:** `src/admin/components/AdminHeader.jsx`

### DataTable

Универсальная таблица с сортировкой и пагинацией.

**Путь:** `src/admin/components/DataTable.jsx`

### ImageUploader

Drag&drop загрузка изображений с превью.

**Путь:** `src/admin/components/ImageUploader.jsx`

### StatusBadge

Бейдж статуса (active/draft/new/in_stock).

**Путь:** `src/admin/components/StatusBadge.jsx`

### ConfirmDialog

Модальное окно подтверждения удаления.

**Путь:** `src/admin/components/ConfirmDialog.jsx`

### SortableList

Drag&drop список на @dnd-kit.

**Путь:** `src/admin/components/SortableList.jsx`

### RichTextEditor

TipTap WYSIWYG редактор (bold, italic, headings, images, links).

**Путь:** `src/admin/components/RichTextEditor.jsx`

### VariantMatrix

Матрица вариантов товара (цвет x память → цена/статус).

**Путь:** `src/admin/components/VariantMatrix.jsx`

### AdminModal

Модальное окно для админки с Escape и backdrop.

**Путь:** `src/admin/components/AdminModal.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `open` | boolean | — | Состояние открытия |
| `title` | string | — | Заголовок |
| `onClose` | function | — | Callback закрытия |
| `onConfirm` | function | — | Callback подтверждения (опционально) |
| `confirmText` | string | `'Сохранить'` | Текст кнопки подтверждения |
| `loading` | boolean | — | Состояние загрузки |
| `children` | ReactNode | — | Содержимое |

### SortableImages

Drag&drop сортировка изображений с загрузкой новых.

**Путь:** `src/admin/components/SortableImages.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `images` | array | `[]` | Массив URL изображений |
| `onImagesChange` | function | — | Callback изменения порядка/удаления |
| `onUpload` | function | — | Callback загрузки файлов |
| `uploading` | boolean | — | Состояние загрузки |
