# Код-стайл и паттерны

## Именование

| Что | Стиль | Пример |
|-----|-------|--------|
| Компоненты | PascalCase | `ProductCard.jsx`, `FilterSidebar.jsx` |
| Хуки | camelCase с `use` | `useProductVariant.js`, `useCatalogQuery.js` |
| Утилиты | camelCase | `product.js`, `pluralize.js` |
| Stores | camelCase с `use...Store` | `useCartStore.js` |
| Константы | UPPER_SNAKE_CASE | `PRICE.MAX`, `SORT_OPTIONS` |
| Data-файлы | camelCase | `categories.js`, `navigation.js` |
| Сервисы | camelCase | `catalogApi.js`, `apiClient.js` |
| CSS-классы | kebab-case | `.liquid-glass`, `.card-hover` |

## Расширения файлов

- `.jsx` — файлы с JSX (компоненты, хуки с JSX как useAuth)
- `.js` — файлы без JSX (утилиты, хуки, stores, сервисы, data)

## Структура компонента

```jsx
// 1. Импорты (React → библиотеки → компоненты → хуки → утилиты → данные → стили)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '../ui/Button'
import { useCartStore } from '../../stores'
import { formatPrice } from '../../utils/product'

// 2. Компонент
export function ProductCard({ product, variant }) {
  // 3. Хуки
  const { addItem } = useCartStore()
  const [isHovered, setIsHovered] = useState(false)

  // 4. Обработчики
  const handleAddToCart = () => {
    addItem(product, variant)
  }

  // 5. JSX
  return (
    <article className="group rounded-3xl p-5 border border-gray-100 shadow-sm
      transition-all hover:shadow-xl hover:-translate-y-1">
      {/* ... */}
    </article>
  )
}
```

## Паттерн карточки товара

```jsx
<article className="group rounded-3xl p-5 border border-gray-100 shadow-sm
  transition-all hover:shadow-xl hover:-translate-y-1">
  {/* Изображение */}
  {/* Бейджи */}
  {/* Название + описание */}
  {/* Цена */}
  {/* Действия */}
</article>
```

## Сервисный слой

### Витрина

```
catalogApi.js → fetch /api/public/* → JSON (snake_case)
productMapper.js → mapProduct() → camelCase для компонентов
```

```js
import { catalogApi } from '../services/catalogApi'
import { mapProducts } from '../services/productMapper'

const raw = await catalogApi.getProducts({ category: 'smartphones' })
const products = mapProducts(raw)
```

### Админка

```
apiClient.js → fetch + JWT header + auto-signout на 401
*Service.js → CRUD обёртки (bannerService, productService...)
useQuery/useMutation → хуки для компонентов
```

```js
import { useQuery } from '../hooks/useQuery'
import { useMutation } from '../hooks/useMutation'

const { data, loading, refetch } = useQuery('/api/products')
const { mutate } = useMutation('POST', '/api/products', {
  successMessage: 'Товар создан',
  onSuccess: () => navigate('/admin/products')
})
```

## CSS-подход

- **Tailwind CSS** — основной инструмент стилизации
- **Кастомные классы** в `index.css` через `@layer utilities` и `@layer components`
- **Без CSS-модулей** — все стили через className
- **Mobile-first** — базовые стили для мобильных, `lg:` для десктопа

## Навигация

- Всегда `<Link to="...">` вместо `<a href="...">`
- Иконки: Lucide React (`import { Heart } from 'lucide-react'`)
- Карусели: Swiper

## Git

- Коммиты на русском
- Формат: `тип: описание` (feat, fix, refactor, docs, chore)
- Осмысленные сообщения (что и зачем)
