# Компоненты

Полная документация компонентов проекта ElectronicsStore.

## Оглавление

- [UI (19)](#ui-19)
- [Layout (9)](#layout-9)
- [Homepage (10)](#homepage-10)
- [Catalog (3)](#catalog-3)
- [Product (9)](#product-9)
- [Filters (3)](#filters-3)
- [Search (2)](#search-2)
- [Cart (1)](#cart-1)
- [SEO (1)](#seo-1)

---

## UI (19)

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

### Toast

Уведомление (toast).

**Путь:** `src/components/ui/Toast.jsx`

Используется через `useToastStore` для отображения уведомлений.

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

---

## Layout (9)

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

Форма подписки на рассылку.

**Путь:** `src/components/Footer/FooterSubscribe.jsx`

### FooterBottom

Нижняя часть подвала (копирайт, соцсети).

**Путь:** `src/components/Footer/FooterBottom.jsx`

---

## Homepage (10)

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

Секция "О нас".

**Путь:** `src/components/AboutUs/AboutUs.jsx`

### ContactSection

Секция контактов.

**Путь:** `src/components/ContactSection/ContactSection.jsx`

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

## Product (9)

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

### ProductGallery

Галерея изображений товара.

**Путь:** `src/components/product/ProductGallery.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `images` | array | — | Массив URL изображений |
| `productName` | string | — | Название для alt |

### ProductConfig

Конфигуратор товара (цвет + память + SIM).

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

Модалка быстрого заказа.

**Путь:** `src/components/product/QuickBuyModal.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `isOpen` | boolean | — | Состояние открытия |
| `onClose` | function | — | Callback закрытия |
| `product` | object | — | Товар |
| `variant` | object | — | Вариант |

---

## Filters (3)

Компоненты фильтрации.

### FilterSidebar

Боковая панель фильтров каталога.

**Путь:** `src/components/filters/FilterSidebar.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `filters` | object | — | Текущие фильтры |
| `availableMemory` | array | `[]` | Доступные варианты памяти |
| `availableBrands` | array | `[]` | Доступные бренды |
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

Активные фильтры (чипы с крестиком).

**Путь:** `src/components/filters/ActiveFilters.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `filters` | object | — | Активные фильтры |
| `onRemove` | function | — | Удаление фильтра |
| `onReset` | function | — | Сброс всех |

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

## Cart (1)

Компоненты корзины.

### CartRecommendations

Рекомендации в корзине.

**Путь:** `src/components/cart/CartRecommendations.jsx`

---

## SEO (1)

SEO-компоненты.

### JsonLd

Структурированные данные Schema.org.

**Путь:** `src/components/seo/JsonLd.jsx`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `type` | string | — | Тип: `Product`, `Organization`, `BreadcrumbList` |
| `data` | object | — | Данные для JSON-LD |

```jsx
import { JsonLd } from '../components/seo/JsonLd'

<JsonLd
  type="Product"
  data={{
    name: product.name,
    price: variant.price,
    image: variant.images[0],
  }}
/>
```

---

## Другие компоненты

### ProductCard

Карточка товара (устаревший вариант).

**Путь:** `src/components/ProductCard/ProductCard.jsx`

### ProductCards

Группа карточек товаров.

**Путь:** `src/components/ProductCard/ProductCards.jsx`

### InfoBlock

Информационный блок.

**Путь:** `src/components/InfoBlocks/InfoBlock.jsx`
