# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ElectronicsStore

SPA магазин электроники Apple-тематики на React 19 + Vite + Tailwind CSS.

---

## Команды

| Команда | Назначение |
|---------|-----------|
| `npm run dev` | Dev-сервер (http://localhost:5173) |
| `npm run build` | Сборка в `dist/` |
| `npm run preview` | Превью сборки |

---

## Архитектура

### Поток данных

```
main.jsx → App.jsx → Home.jsx → [Header, Hero, Categories, ProductCards, Benefits, InfoBlocks, Footer]
```

### Структура src/

```
src/
├── main.jsx              # Точка входа
├── App.jsx               # Корневой компонент
├── index.css             # Глобальные стили + Tailwind
├── pages/
│   └── Home.jsx          # Главная страница
├── components/
│   ├── ui/               # Базовые компоненты
│   ├── Header/           # Шапка сайта
│   ├── Hero/             # Главный баннер
│   ├── Categories/       # Категории товаров
│   ├── ProductCard/      # Карточки товаров
│   ├── Benefits/         # Преимущества
│   ├── InfoBlocks/       # Информационные блоки
│   └── Footer/           # Подвал
├── data/                 # Статические данные
├── hooks/                # Кастомные хуки
└── assets/               # Изображения
```

---

## Компоненты

### UI-компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| `Button` | `ui/Button.jsx` | Универсальная кнопка |
| `Container` | `ui/Container.jsx` | Контейнер с max-width |

#### Button — варианты и размеры

```jsx
// Варианты: primary, secondary, outline, ghost, glass
<Button variant="primary" size="md">Текст</Button>

// Размеры: sm, md, lg
<Button variant="glass" size="lg">Большая кнопка</Button>
```

### Header

| Компонент | Описание |
|-----------|----------|
| `Header` | Контейнер шапки |
| `TopBar` | Верхняя строка (контакты, ссылки) |
| `Navigation` | Навигационное меню |
| `MobileMenu` | Мобильное меню |

### Контентные секции

| Компонент | Описание |
|-----------|----------|
| `Hero` | Главный баннер с каруселью |
| `Categories` | Сетка категорий |
| `CategoryCard` | Карточка категории |
| `ProductCards` | Сетка товаров |
| `ProductCard` | Карточка товара |
| `Benefits` | Секция преимуществ |
| `BenefitCard` | Карточка преимущества |
| `InfoBlocks` | Информационные блоки |
| `InfoBlock` | Один инфо-блок |

### Footer

| Компонент | Описание |
|-----------|----------|
| `Footer` | Контейнер подвала |
| `FooterContacts` | Контактная информация |
| `FooterColumn` | Колонка со ссылками |
| `FooterSubscribe` | Форма подписки |
| `FooterBottom` | Нижняя строка (копирайт) |

---

## Данные

### categories.js

```js
// 9 категорий: iPhone, AirPods, iPad, Mac, Watch, Vision Pro, Dyson, Samsung, Аксессуары
{
  id: 1,
  name: 'iPhone',
  image: 'url',
  link: '/iphone'
}
```

### benefits.js

```js
// 4 преимущества магазина
{
  id: 1,
  icon: 'Headphones',  // Иконка из lucide-react
  title: 'Клиентский сервис',
  description: 'Поддержка 24/7 для всех клиентов'
}
```

**Доступные иконки:** `Headphones`, `Truck`, `Shield`, `Gift`

---

## Хуки

### useMediaQuery

```js
import { useMediaQuery } from '../hooks/useMediaQuery'

const isDesktop = useMediaQuery('(min-width: 1024px)')
// true если ширина >= 1024px
```

### useScrollPosition

```js
import { useScrollPosition } from '../hooks/useScrollPosition'

const { isScrolled } = useScrollPosition(10)  // threshold = 10px
// true если проскроллено больше 10px
```

---

## Стилизация

### Tailwind — кастомные значения

**Цвета:**
| Класс | HEX | Использование |
|-------|-----|---------------|
| `text-gray-light` / `bg-gray-light` | #f5f5f7 | Фон карточек |
| `text-gray-medium` | #86868b | Вторичный текст |
| `text-gray-dark` / `bg-gray-dark` | #1d1d1f | Основной текст |

**Тени:**
| Класс | Использование |
|-------|---------------|
| `shadow-glass` | Стандартная тень glass-элементов |
| `shadow-glass-hover` | Усиленная тень при hover |

**Контейнер:**
```
max-w-container = 1200px
```

### CSS-утилиты (index.css)

```css
/* Готовые glass-классы */
.glass         /* rgba(245,245,247,0.9) + blur(10px) */
.glass-strong  /* rgba(245,245,247,0.95) + blur(12px) */
```

### Glassmorphism — паттерн

```jsx
// Базовый glass-эффект
<div className="bg-gray-light border border-gray-200/50 shadow-glass">

// С hover-анимацией
<div className="bg-gray-light shadow-glass hover:shadow-glass-hover hover:scale-[1.02] transition-all duration-300">
```

---

## Паттерны кода

### Адаптивность (Mobile-first)

```jsx
// Скрыть на мобильном, показать на desktop
<div className="hidden lg:block">Desktop only</div>

// Показать на мобильном, скрыть на desktop
<div className="lg:hidden">Mobile only</div>

// Адаптивные отступы
<div className="p-4 lg:p-8">

// Адаптивная сетка
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
```

### Карточка товара

```jsx
<div className="
  rounded-3xl overflow-hidden p-8 md:p-10
  flex flex-col h-full
  bg-gray-light border border-gray-200/50
  shadow-glass hover:shadow-glass-hover
  hover:scale-[1.02] transition-all duration-300
">
```

### Секция страницы

```jsx
<section className="py-12 lg:py-16">
  <Container>
    <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-dark">
      Заголовок
    </h2>
    {/* Контент */}
  </Container>
</section>
```

---

## Добавление нового функционала

### Новая категория

```js
// data/categories.js
{
  id: 10,
  name: 'Новая категория',
  image: 'https://...',
  link: '/new-category'
}
```

### Новый компонент

1. Создать файл в соответствующей папке `components/`
2. Использовать существующие UI-компоненты (`Button`, `Container`)
3. Следовать паттерну glass-стилизации
4. Импортировать в родительский компонент

### Новая страница

1. Создать файл в `pages/`
2. Импортировать `Header` и `Footer`
3. Добавить роутинг (потребуется установка react-router-dom)

### Новый хук

```js
// hooks/useNewHook.js
import { useState, useEffect } from 'react'

export function useNewHook(param) {
  const [state, setState] = useState(null)

  useEffect(() => {
    // Логика
  }, [param])

  return state
}
```

---

## Технологии

| Технология | Версия | Назначение |
|------------|--------|-----------|
| React | 19.2.4 | UI-библиотека |
| Vite | 7.3.1 | Сборщик |
| Tailwind CSS | 3.4.19 | Стилизация |
| Swiper | 12.0.3 | Карусели |
| Lucide React | 0.563.0 | Иконки |

---

## Особенности проекта

- Без TypeScript — обычный JSX
- Без роутинга — одна страница (SPA)
- Без ESLint/Prettier — нет автоформатирования
- Шрифт SF Pro Display (CDN)
- Mobile-first подход (брейкпоинт `lg:` = 1024px)
