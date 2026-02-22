# Zustand Stores

5 stores в `src/stores/`. Импорт через barrel: `import { useCartStore } from '../stores'`

## useCartStore

Корзина с сохранением в localStorage.

**Persist:** `name: 'cart'`, `version: 2`

### State

| Поле | Тип | Начальное |
|------|-----|----------|
| items | CartItem[] | [] |

**CartItem:**
```js
{
  id: string,          // `${productId}-${variantId}`
  productId: string,
  variantId: string,
  quantity: number,
  attributes: object,  // произвольные атрибуты варианта (color, memory и т.д.)
  color: { id, name, hex },
  memory: number,
  price: number,
  name: string,
  image: string
}
```

### Actions

| Метод | Сигнатура | Описание |
|-------|-----------|---------|
| addItem | `(product, variant)` | Добавить или +1 к quantity |
| removeItem | `(itemId)` | Удалить из корзины |
| updateQuantity | `(itemId, quantity)` | Обновить количество (≤0 → удаление) |
| clearCart | `()` | Очистить корзину |
| isInCart | `(productId, variantId)` | Проверить наличие |
| getTotal | `()` | Сумма (price × quantity) |
| getCount | `()` | Общее количество товаров |

### Миграция v1 → v2

При обновлении с v1 автоматическая миграция:
- Для элементов без `attributes` собирает объект из `color`, `memory`, `sim`
- Поле `sim` убрано из CartItem, данные перенесены в `attributes`
- Формула `id` упрощена: `${productId}-${variantId}` (без sim)

### Пример

```js
const { items, addItem, getTotal, getCount } = useCartStore()
addItem(product, selectedVariant)
```

---

## useProductStore

Фильтры каталога и режим отображения. Без persistence — сбрасывается при перезагрузке.

### State

| Поле | Тип | Начальное |
|------|-----|----------|
| filters.priceRange | [number, number] | [0, PRICE.MAX] |
| filters.colors | string[] | [] |
| filters.memory | number[] | [] |
| filters.brands | string[] | [] |
| filters.inStock | boolean | false |
| sortBy | string | 'popular' |
| viewMode | string | 'grid' |

### Actions

| Метод | Сигнатура | Описание |
|-------|-----------|---------|
| setFilter | `(key, value)` | Установить значение фильтра |
| toggleArrayFilter | `(key, value)` | Добавить/убрать элемент массива |
| resetFilters | `()` | Сбросить все фильтры |
| setSortBy | `(sortBy)` | Установить сортировку |
| setViewMode | `(viewMode)` | grid / list |

### Пример

```js
const { filters, setFilter, toggleArrayFilter, resetFilters, sortBy, setSortBy } = useProductStore()
toggleArrayFilter('colors', 'black')
setFilter('priceRange', [50000, 150000])
```

---

## useRecentlyViewedStore

Недавно просмотренные товары (макс. 10).

**Persist:** `name: 'recently-viewed'`, `version: 1`

### State

| Поле | Тип | Начальное |
|------|-----|----------|
| items | string[] | [] (productId, новые в начале, макс. 10) |

### Actions

| Метод | Сигнатура | Описание |
|-------|-----------|---------|
| addItem | `(productId)` | Добавить в начало (дедупликация, обрезка до 10) |
| clearItems | `()` | Очистить |

### Пример

```js
const { items, addItem } = useRecentlyViewedStore()
addItem(product.id) // При просмотре товара
```

---

## useSearchStore

Состояние поиска. Без persistence.

### State

| Поле | Тип | Начальное |
|------|-----|----------|
| query | string | '' |
| isOpen | boolean | false |
| results | Product[] | [] |
| isLoading | boolean | false |

### Actions

| Метод | Сигнатура | Описание |
|-------|-----------|---------|
| setQuery | `(query)` | Установить запрос |
| setResults | `(results)` | Установить результаты |
| setIsOpen | `(isOpen)` | Показать/скрыть дропдаун |
| setIsLoading | `(isLoading)` | Установить загрузку |
| reset | `()` | Сбросить всё |

---

## useToastStore

Уведомления. Без persistence. Автоудаление через 3 сек.

### State

| Поле | Тип | Начальное |
|------|-----|----------|
| toasts | Toast[] | [] |

**Toast:** `{ id: number, message: string, type: 'success' | 'error' | 'info' }`

### Actions

| Метод | Сигнатура | Описание |
|-------|-----------|---------|
| addToast | `(message, type='success')` | Добавить (автоудаление через 3с) |
| removeToast | `(id)` | Удалить вручную |

> Витрина: `useToast()` хук — обёртка над этим store.
> Админка: `react-hot-toast` (отдельная система).

---

## Сводка

| Store | Persist | localStorage key |
|-------|---------|-----------------|
| useCartStore | Да | `cart` (v2) |
| useProductStore | Нет | — |
| useRecentlyViewedStore | Да | `recently-viewed` |
| useSearchStore | Нет | — |
| useToastStore | Нет | — |
