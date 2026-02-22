# Хуки

Документация кастомных React-хуков проекта.

## Оглавление

| Хук | Назначение |
|-----|------------|
| [useProductVariant](#useproductvariant) | Управление вариантом товара |
| [useDebounce](#usedebounce) | Дебаунс значения |
| [useMatchMedia](#usematchmedia) | CSS медиа-запросы |
| [useScrollPosition](#usescrollposition) | Позиция скролла |
| [useInView](#useinview) | Видимость элемента (Intersection Observer) |
| [useToast](#usetoast) | Уведомления |
| [useReducedMotion](#usereducedmotion) | Prefers-reduced-motion |
| [useFilterSync](#usefiltersync) | Синхронизация фильтров с URL |
| [useCatalogQuery](#usecatalogquery) | GET-запросы с loading/error/refetch |
| [usePageTitle](#usepagetitle) | Управление `<title>` страницы |
| [useProductFiltering](#useproductfiltering) | Фильтрация и сортировка товаров |

---

## useProductVariant

Управляет выбором варианта товара через универсальную систему dimensions (цвет, память, SIM и любые другие атрибуты).

**Путь:** `src/hooks/useProductVariant.js`

### Сигнатура

```js
const {
  // Dimensions API (основной)
  selections,
  setSelection,
  dimensions,
  getOptionsForDimension,
  currentVariant,
  // Legacy API (обратная совместимость)
  selectedColor,
  selectedMemory,
  selectedSim,
  setSelectedColor,
  setSelectedMemory,
  setSelectedSim,
  colors,
  memoryOptions,
  simOptions,
  availableMemoryForColor,
} = useProductVariant(product)
```

### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `product` | object | Объект товара с `variants`, `dimensions` и `simOptions` |

### Возвращает

**Dimensions API:**

| Свойство | Тип | Описание |
|----------|-----|----------|
| `selections` | object | `{ [dimKey]: valueId }` — текущие выборы |
| `setSelection` | function | `(dimKey, valueId)` — установка значения с автоподбором совместимой комбинации |
| `dimensions` | array | `product.dimensions` — массив измерений |
| `getOptionsForDimension` | function | `(dimKey)` — доступные опции для измерения |
| `currentVariant` | object\|null | Найденный вариант по текущим selections |

**Legacy API (обратная совместимость):**

| Свойство | Тип | Описание |
|----------|-----|----------|
| `selectedColor` | string\|null | `selections.color` |
| `selectedMemory` | number\|null | `Number(selections.memory)` |
| `selectedSim` | string\|null | `selections.sim` |
| `setSelectedColor` | function | Обёртка: `setSelection('color', id)` |
| `setSelectedMemory` | function | Обёртка: `setSelection('memory', String(mem))` |
| `setSelectedSim` | function | Обёртка: `setSelection('sim', id)` |
| `colors` | array | Доступные цвета |
| `memoryOptions` | array | Доступные варианты памяти |
| `simOptions` | array | Доступные SIM-опции |
| `availableMemoryForColor` | array | `[{ memory, inStock }]` для выбранного цвета |

### Пример

```jsx
import { useProductVariant } from '../hooks/useProductVariant'

function ProductPage({ product }) {
  const {
    selections,
    setSelection,
    dimensions,
    getOptionsForDimension,
    currentVariant,
  } = useProductVariant(product)

  return (
    <>
      {dimensions.map(dim => (
        <DimensionSelector
          key={dim.key}
          dimension={dim}
          options={getOptionsForDimension(dim.key)}
          selected={selections[dim.key]}
          onChange={(val) => setSelection(dim.key, val)}
        />
      ))}
      <div>Цена: {currentVariant?.price}</div>
    </>
  )
}
```

### Особенности

- **Dimensions:** `product.dimensions` — массив объектов с полем `key`. Варианты матчатся через `v.attributes?.[key]?.id`
- **Auto-fallback:** при выборе несовместимой комбинации автоматически переключает другие dimensions на ближайший совместимый вариант
- **Legacy-compat:** если `dimensions` пуст — используется legacy-режим (`color`, `memory`, `sim`). Legacy-свойства (`selectedColor`, `colors` и т.д.) работают всегда как обёртки над dimensions API
- Автоматически выбирает первый вариант в наличии при инициализации

---

## useDebounce

Возвращает дебаунсированное значение с задержкой.

**Путь:** `src/hooks/useDebounce.js`

### Сигнатура

```js
const debouncedValue = useDebounce(value, delay)
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `value` | any | — | Значение для дебаунса |
| `delay` | number | `300` | Задержка в мс |

### Возвращает

| Тип | Описание |
|-----|----------|
| any | Дебаунсированное значение |

### Пример

```jsx
import { useDebounce } from '../hooks/useDebounce'

function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      searchProducts(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

---

## useMatchMedia

Базовый хук для работы с `window.matchMedia`.

**Путь:** `src/hooks/useMatchMedia.js`

### Сигнатура

```js
const matches = useMatchMedia(query)
```

### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `query` | string | CSS медиа-запрос |

### Возвращает

| Тип | Описание |
|-----|----------|
| boolean | Соответствует ли запросу |

### Пример

```jsx
import { useMatchMedia } from '../hooks/useMatchMedia'

function Component() {
  const prefersDark = useMatchMedia('(prefers-color-scheme: dark)')
  // ...
}
```

### Особенности

- Начальное значение: `false` (SSR-safe)
- Автоматически подписывается на изменения медиа-запроса

---

## useScrollPosition

Отслеживает позицию скролла страницы.

**Путь:** `src/hooks/useScrollPosition.js`

### Сигнатура

```js
const { isScrolled } = useScrollPosition(threshold)
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `threshold` | number | `10` | Порог в пикселях |

### Возвращает

| Свойство | Тип | Описание |
|----------|-----|----------|
| `isScrolled` | boolean | Прокручено ли больше threshold |

### Пример

```jsx
import { useScrollPosition } from '../hooks/useScrollPosition'

function Header() {
  const { isScrolled } = useScrollPosition(50)

  return (
    <header className={isScrolled ? 'bg-white shadow' : 'bg-transparent'}>
      {/* ... */}
    </header>
  )
}
```

### Особенности

- Использует `passive: true` для оптимизации
- Вызывает `handleScroll` сразу при монтировании

---

## useInView

Определяет, виден ли элемент во viewport (Intersection Observer).

**Путь:** `src/hooks/useInView.js`

### Сигнатура

```js
const [ref, isInView] = useInView(options)
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `options` | object | `{ threshold: 0.1 }` | Опции IntersectionObserver |

### Возвращает

| Индекс | Тип | Описание |
|--------|-----|----------|
| `0` | ref | Реф для прикрепления к элементу |
| `1` | boolean | Виден ли элемент |

### Пример

```jsx
import { useInView } from '../hooks/useInView'

function AnimatedSection({ children }) {
  const [ref, isInView] = useInView({ threshold: 0.2 })

  return (
    <section
      ref={ref}
      className={`transition-opacity ${isInView ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </section>
  )
}
```

### Особенности

- Срабатывает один раз (disconnect после первого пересечения)
- Порог по умолчанию: 10% видимости элемента

---

## useToast

Хук для показа уведомлений.

**Путь:** `src/hooks/useToast.js`

### Сигнатура

```js
const { toast } = useToast()
```

### Возвращает

| Свойство | Тип | Описание |
|----------|-----|----------|
| `toast` | function | `(message, type) => void` |

### Параметры toast

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `message` | string | — | Текст уведомления |
| `type` | string | `'success'` | Тип: `success`, `error`, `info` |

### Пример

```jsx
import { useToast } from '../hooks/useToast'

function AddToCartButton({ product, variant }) {
  const { toast } = useToast()
  const { addItem } = useCartStore()

  const handleClick = () => {
    addItem(product, variant)
    toast('Товар добавлен в корзину', 'success')
  }

  return <Button onClick={handleClick}>В корзину</Button>
}
```

### Особенности

- Использует Zustand store (`useToastStore`)
- Уведомления автоматически исчезают через 3 секунды
- Экспортирует также `useToastStore` для доступа к списку уведомлений

---

## useReducedMotion

Определяет предпочтение пользователя по анимациям.

**Путь:** `src/hooks/useReducedMotion.js`

### Сигнатура

```js
const prefersReducedMotion = useReducedMotion()
```

### Возвращает

| Тип | Описание |
|-----|----------|
| boolean | Предпочитает ли пользователь меньше анимаций |

### Пример

```jsx
import { useReducedMotion } from '../hooks/useReducedMotion'

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={prefersReducedMotion ? '' : 'animate-fade-in'}
    >
      {/* ... */}
    </div>
  )
}
```

### Особенности

- Обёртка над `useMatchMedia('(prefers-reduced-motion: reduce)')`
- Для accessibility (a11y) — уважает системные настройки пользователя

---

## useFilterSync

Синхронизация фильтров с URL (searchParams).

**Путь:** `src/hooks/useFilterSync.js`

### Сигнатура

```js
const { filters, sortBy, setSortBy, setFilter, resetFilters } = useFilterSync(
  initialFilters,
  parseUrl,
  buildUrl
)
```

### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `initialFilters` | object | Начальное состояние фильтров |
| `parseUrl` | function | `(searchParams) → { filters, sortBy }` |
| `buildUrl` | function | `(filters, sortBy) → URLSearchParams` |

### Возвращает

| Свойство | Тип | Описание |
|----------|-----|----------|
| `filters` | object | Текущие фильтры |
| `sortBy` | string | Текущая сортировка |
| `setSortBy` | function | Установка сортировки |
| `setFilter` | function | `(key, value) → void` |
| `resetFilters` | function | Сброс к начальному состоянию |

### Дополнительные экспорты

| Экспорт | Описание |
|---------|----------|
| `parseBrandPageUrl` | Парсер URL для BrandPage |
| `buildBrandPageUrl` | Построитель URL для BrandPage |
| `parseUsedPageUrl` | Парсер URL для UsedPage |
| `buildUsedPageUrl` | Построитель URL для UsedPage |
| `BRAND_PAGE_INITIAL_FILTERS` | Начальное состояние фильтров BrandPage |
| `USED_PAGE_INITIAL_FILTERS` | Начальное состояние фильтров UsedPage |
| `parseArray`, `parseNumberArray`, `parseBoolean`, `parseNumber` | Хелперы парсинга |

### Пример

```jsx
import {
  useFilterSync,
  parseBrandPageUrl,
  buildBrandPageUrl,
  BRAND_PAGE_INITIAL_FILTERS,
} from '../hooks/useFilterSync'

function BrandPage() {
  const { filters, sortBy, setSortBy, setFilter, resetFilters } = useFilterSync(
    BRAND_PAGE_INITIAL_FILTERS,
    parseBrandPageUrl,
    buildBrandPageUrl
  )

  return <FilterSidebar filters={filters} onFilterChange={setFilter} onReset={resetFilters} />
}
```

### Особенности

- При загрузке парсит URL → state
- При изменении state обновляет URL (replace)
- Пропускает первый рендер (не перезаписывает URL до парсинга)

---

## useCatalogQuery

Универсальный хук для GET-запросов к API каталога с управлением loading/error.

**Путь:** `src/hooks/useCatalogQuery.js`

### Сигнатура

```js
const { data, loading, error, refetch } = useCatalogQuery(fetcher, deps)
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `fetcher` | function | — | Async-функция, возвращающая данные |
| `deps` | array | `[]` | Зависимости для перезапроса |

### Возвращает

| Свойство | Тип | Описание |
|----------|-----|----------|
| `data` | any | Результат запроса |
| `loading` | boolean | Идёт ли загрузка |
| `error` | string\|null | Текст ошибки |
| `refetch` | function | Повторный запрос |

### Пример

```jsx
import { useCatalogQuery } from '../hooks/useCatalogQuery'
import { catalogApi } from '../services/catalogApi'

function CategoryPage({ slug }) {
  const { data, loading, error } = useCatalogQuery(
    () => catalogApi.getCategoryBrands(slug),
    [slug]
  )

  if (loading) return <Skeleton />
  if (error) return <p>Ошибка: {error}</p>
  return <BrandList brands={data.brands} />
}
```

### Особенности

- Автоматическая отмена при размонтировании (mountedRef)
- Если `fetcher` равен `null/undefined`, сбрасывает data и не загружает

---

## usePageTitle

Устанавливает `document.title` при монтировании и изменении.

**Путь:** `src/hooks/usePageTitle.js`

### Сигнатура

```js
usePageTitle(title)
```

### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `title` | string | Заголовок страницы |

### Пример

```jsx
import { usePageTitle } from '../hooks/usePageTitle'

function ProductPage({ product }) {
  usePageTitle(`${product.name} — AppGrade`)
  return <div>...</div>
}
```

---

## useProductFiltering

Мемоизированная фильтрация и сортировка массива товаров.

**Путь:** `src/hooks/useProductFiltering.js`

### Сигнатура

```js
const filteredProducts = useProductFiltering(products, filters, sortBy, options)
```

### Параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `products` | array | — | Исходный массив товаров |
| `filters` | object | — | Объект фильтров (`priceRange`, `inStock` и др.) |
| `sortBy` | string | — | Сортировка: `price-asc`, `price-desc`, `new` |
| `options` | object | `{}` | Доп. опции |
| `options.extraFilters` | function | — | `(products, filters) → products[]` — кастомные фильтры |
| `options.sortNew` | function | — | Функция сортировки для `'new'` |

### Возвращает

| Тип | Описание |
|-----|----------|
| array | Отфильтрованный и отсортированный массив товаров |

### Пример

```jsx
import { useProductFiltering } from '../hooks/useProductFiltering'

function BrandPage({ products, filters, sortBy }) {
  const filtered = useProductFiltering(products, filters, sortBy, {
    extraFilters: (items, f) => {
      if (f.memory.length) {
        return items.filter(p => p.variants.some(v => f.memory.includes(v.memory)))
      }
      return items
    },
  })

  return <ProductGrid products={filtered} />
}
```

### Особенности

- Обёрнут в `useMemo` для оптимизации
- Встроенные фильтры: по цене (`priceRange`), наличию (`inStock`)
- `extraFilters` позволяет добавить специфичные фильтры страницы

---

## Импорт

Все хуки можно импортировать напрямую:

```js
import { useProductVariant } from '../hooks/useProductVariant'
import { useDebounce } from '../hooks/useDebounce'
import { useMatchMedia } from '../hooks/useMatchMedia'
import { useScrollPosition } from '../hooks/useScrollPosition'
import { useInView } from '../hooks/useInView'
import { useToast } from '../hooks/useToast'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useFilterSync } from '../hooks/useFilterSync'
import { useCatalogQuery } from '../hooks/useCatalogQuery'
import { usePageTitle } from '../hooks/usePageTitle'
import { useProductFiltering } from '../hooks/useProductFiltering'
```
