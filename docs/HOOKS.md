# Хуки

Документация кастомных React-хуков проекта.

## Оглавление

| Хук | Назначение |
|-----|------------|
| [useProductVariant](#useproductvariant) | Управление вариантом товара |
| [useDebounce](#usedebounce) | Дебаунс значения |
| [useMediaQuery](#usemediaquery) | CSS медиа-запросы |
| [useMatchMedia](#usematchmedia) | Базовый хук для matchMedia |
| [useScrollPosition](#usescrollposition) | Позиция скролла |
| [useInView](#useinview) | Видимость элемента (Intersection Observer) |
| [useToast](#usetoast) | Уведомления |
| [useReducedMotion](#usereducedmotion) | Prefers-reduced-motion |

---

## useProductVariant

Управляет выбором варианта товара (цвет, память, SIM).

**Путь:** `src/hooks/useProductVariant.js`

### Сигнатура

```js
const {
  selectedColor,
  selectedMemory,
  selectedSim,
  setSelectedColor,
  setSelectedMemory,
  setSelectedSim,
  currentVariant,
  colors,
  memoryOptions,
  availableMemoryForColor,
} = useProductVariant(product)
```

### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `product` | object | Объект товара с `variants` и `simOptions` |

### Возвращает

| Свойство | Тип | Описание |
|----------|-----|----------|
| `selectedColor` | string | ID выбранного цвета |
| `selectedMemory` | number | Выбранный объём памяти |
| `selectedSim` | string | ID выбранного SIM |
| `setSelectedColor` | function | Установка цвета (с автоподбором памяти) |
| `setSelectedMemory` | function | Установка памяти |
| `setSelectedSim` | function | Установка SIM |
| `currentVariant` | object | Текущий вариант товара |
| `colors` | array | Доступные цвета |
| `memoryOptions` | array | Доступные варианты памяти |
| `availableMemoryForColor` | array | Память, доступная для выбранного цвета |

### Пример

```jsx
import { useProductVariant } from '../hooks/useProductVariant'

function ProductPage({ product }) {
  const {
    selectedColor,
    selectedMemory,
    setSelectedColor,
    setSelectedMemory,
    currentVariant,
    colors,
    memoryOptions,
    availableMemoryForColor,
  } = useProductVariant(product)

  return (
    <>
      <ColorSelector
        colors={colors}
        selected={selectedColor}
        onChange={setSelectedColor}
        variants={product.variants}
      />
      <MemorySelector
        options={memoryOptions}
        selected={selectedMemory}
        onChange={setSelectedMemory}
        availableForColor={availableMemoryForColor}
      />
      <div>Цена: {currentVariant?.price}</div>
    </>
  )
}
```

### Особенности

- Автоматически выбирает первый вариант в наличии при инициализации
- При смене цвета автоматически подбирает доступную память
- Для товаров без памяти (например, AirPods) ищет вариант только по цвету

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

## useMediaQuery

Отслеживает CSS медиа-запрос (обёртка над useMatchMedia).

**Путь:** `src/hooks/useMediaQuery.js`

### Сигнатура

```js
const matches = useMediaQuery(query)
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
import { useMediaQuery } from '../hooks/useMediaQuery'

function Component() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 768px)')

  return isDesktop ? <DesktopView /> : <MobileView />
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

## Импорт

Все хуки можно импортировать напрямую:

```js
import { useProductVariant } from '../hooks/useProductVariant'
import { useDebounce } from '../hooks/useDebounce'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useMatchMedia } from '../hooks/useMatchMedia'
import { useScrollPosition } from '../hooks/useScrollPosition'
import { useInView } from '../hooks/useInView'
import { useToast } from '../hooks/useToast'
import { useReducedMotion } from '../hooks/useReducedMotion'
```
