# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ElectronicsStore

SPA магазин электроники Apple-тематики на React 19 + Vite + Tailwind CSS + React Router.

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
main.jsx (BrowserRouter) → App.jsx (Routes) → Pages → [Header, Content, Footer]
```

### Структура src/

```
src/
├── main.jsx              # Точка входа + BrowserRouter
├── App.jsx               # Роутинг (Routes, Route)
├── index.css             # Глобальные стили + Tailwind
├── pages/
│   ├── Home.jsx          # Главная страница
│   ├── catalog/          # Страницы каталога
│   │   ├── IPhonePage.jsx
│   │   ├── MacPage.jsx
│   │   ├── IPadPage.jsx
│   │   ├── WatchPage.jsx
│   │   ├── AirPodsPage.jsx
│   │   ├── AccessoriesPage.jsx
│   │   ├── VisionPage.jsx
│   │   └── UsedPage.jsx
│   └── info/             # Информационные страницы
│       ├── DeliveryPage.jsx
│       ├── WarrantyPage.jsx
│       ├── ContactsPage.jsx
│       ├── AboutPage.jsx
│       ├── ReturnsPage.jsx
│       ├── ServicePage.jsx
│       ├── FaqPage.jsx
│       ├── TradeInPage.jsx
│       ├── CreditPage.jsx
│       ├── PrivacyPage.jsx
│       ├── TermsPage.jsx
│       ├── BlogPage.jsx
│       └── BlogPostPage.jsx
├── components/
│   ├── ui/               # Базовые компоненты
│   ├── Header/           # Шапка сайта
│   ├── Hero/             # Главный баннер
│   ├── Categories/       # Категории товаров
│   ├── ProductCard/      # Карточки товаров
│   ├── News/             # Блок новостей
│   ├── FAQ/              # Часто задаваемые вопросы
│   ├── ContactSection/   # Секция контактов
│   └── Footer/           # Подвал
├── data/                 # Конфигурация и статические данные
│   ├── config.js         # Контакты, юр. информация
│   ├── navigation.js     # Навигационные ссылки
│   ├── faq.js            # FAQ вопросы
│   ├── categories.js     # Категории товаров
│   ├── news.js           # Новости блога
│   └── benefits.js       # Преимущества
├── hooks/                # Кастомные хуки
└── assets/               # Изображения
```

---

## Роутинг

### Каталог

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | Home | Главная страница |
| `/iphone` | IPhonePage | Каталог iPhone |
| `/mac` | MacPage | Каталог Mac |
| `/ipad` | IPadPage | Каталог iPad |
| `/watch` | WatchPage | Каталог Watch |
| `/airpods` | AirPodsPage | Каталог AirPods |
| `/accessories` | AccessoriesPage | Аксессуары |
| `/vision` | VisionPage | Vision Pro |
| `/used` | UsedPage | Проверенное б/у |

### Информационные

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/delivery` | DeliveryPage | Доставка и оплата |
| `/warranty` | WarrantyPage | Гарантия |
| `/contacts` | ContactsPage | Контакты |
| `/about` | AboutPage | О компании |
| `/returns` | ReturnsPage | Возврат товара |
| `/service` | ServicePage | Сервисный центр |
| `/faq` | FaqPage | FAQ |
| `/trade-in` | TradeInPage | Trade-in |
| `/credit` | CreditPage | Рассрочка |
| `/privacy` | PrivacyPage | Политика конфиденциальности |
| `/terms` | TermsPage | Пользовательское соглашение |
| `/blog` | BlogPage | Блог |
| `/blog/:id` | BlogPostPage | Статья блога |

### Навигация

Используй `Link` из `react-router-dom` вместо `<a href>`:

```jsx
import { Link } from 'react-router-dom'

<Link to="/iphone">iPhone</Link>
```

---

## Компоненты

### UI-компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| `Button` | `ui/Button.jsx` | Универсальная кнопка |
| `Container` | `ui/Container.jsx` | Контейнер с max-width |
| `ImageWithSkeleton` | `ui/ImageWithSkeleton.jsx` | Изображение со скелетоном |
| `AnimatedSection` | `ui/AnimatedSection.jsx` | Анимация появления |
| `StaggeredList` | `ui/StaggeredList.jsx` | Последовательная анимация |
| `SectionHeader` | `ui/SectionHeader.jsx` | Заголовок секции + ссылка |
| `SectionDivider` | `ui/SectionDivider.jsx` | Разделитель секций |

#### Button — варианты и размеры

```jsx
// Варианты: primary, secondary, outline, ghost, glass, white, outline-white
<Button variant="primary" size="md">Текст</Button>

// Размеры: sm, md, lg
<Button variant="glass" size="lg">Большая кнопка</Button>
```

#### SectionHeader — заголовок секции

```jsx
import { SectionHeader } from '../ui/SectionHeader'

<SectionHeader
  title="Заголовок секции"
  subtitle="Подзаголовок (опционально)"
  linkText="Смотреть все"  // по умолчанию
  linkHref="/catalog"
  className="mb-10"
/>
```

#### SectionDivider — разделитель секций

```jsx
import { SectionDivider } from '../ui/SectionDivider'

<SectionDivider className="mb-14 md:mb-20" />
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
| `Categories` | Swiper категорий |
| `CategoryCard` | Карточка категории |
| `ProductCards` | Блок "Не спешите покупать новое" |
| `News` | Блок новостей из блога |
| `NewsCard` | Карточка новости |
| `FAQ` | Аккордеон с вопросами и ответами |
| `ContactSection` | Форма связи + карта |

### Footer

| Компонент | Описание |
|-----------|----------|
| `Footer` | Контейнер подвала |
| `FooterContacts` | Контактная информация |
| `FooterColumn` | Колонка со ссылками (аккордеон на mobile) |
| `FooterBottom` | Нижняя строка (копирайт) |

### FAQ

Аккордеон с часто задаваемыми вопросами на главной странице.

**Файл:** `src/components/FAQ/FAQ.jsx`
**Данные:** `src/data/faq.js`

**Особенности:**
- Иконки для каждого вопроса (Lucide)
- Анимация раскрытия через opacity слоёв
- Тёмный фон при раскрытии (bg-gray-dark)
- Декоративное голубое свечение
- Только один вопрос открыт одновременно

---

## Конфигурация и данные

### config.js — контакты и юр. информация

```js
import { CONTACTS, COMPANY } from '../data/config'

// Контакты
CONTACTS.phone       // '+7 (909) 797-31-86'
CONTACTS.phoneLink   // 'tel:+79097973186'
CONTACTS.email       // 'info@appgrade.ru'
CONTACTS.city        // 'Калининград'
CONTACTS.address     // 'проспект Мира, 59'
CONTACTS.fullAddress // 'Калининград, проспект Мира, 59'
CONTACTS.workHours   // 'Ежедневно 11:00 — 20:00'
CONTACTS.whatsapp    // 'https://wa.me/79097973186'
CONTACTS.telegram    // 'https://t.me/appgrade'
CONTACTS.vk          // 'https://vk.com/appgrade'
CONTACTS.mapId       // '204645025784'

// Компания
COMPANY.name         // 'APPGRADE'
COMPANY.legalName    // 'ИП Зелёный Никита Анатольевич'
COMPANY.inn          // '390507826625'
COMPANY.ogrnip       // '314392618400120'
COMPANY.year         // текущий год (динамически)
```

### navigation.js — навигационные ссылки

```js
import { NAV_MAIN, NAV_TOP, NAV_MOBILE, FOOTER_SECTIONS } from '../data/navigation'

// NAV_MAIN — основное меню (каталог)
// NAV_TOP — верхняя панель (доставка, гарантия, контакты)
// NAV_MOBILE — мобильное меню (объединение)
// FOOTER_SECTIONS — секции футера (catalog, info, support)
```

### faq.js — вопросы и ответы

```js
import { FAQ_ITEMS } from '../data/faq'

// Структура элемента:
{
  id: 1,
  icon: ShieldCheck,  // Lucide иконка
  question: 'Текст вопроса',
  answer: 'Текст ответа'
}
```

### categories.js

```js
{
  id: 1,
  name: 'iPhone',
  image: importedImage,
  link: '/iphone'
}
```

### news.js

```js
{
  id: 1,
  image: importedImage,
  date: '27 ЯНВАРЯ, 2026',
  title: 'Заголовок новости'
}
```

---

## Хуки

### useMediaQuery

```js
import { useMediaQuery } from '../hooks/useMediaQuery'

const isDesktop = useMediaQuery('(min-width: 1024px)')
```

### useScrollPosition

```js
import { useScrollPosition } from '../hooks/useScrollPosition'

const { isScrolled } = useScrollPosition(10)
```

---

## Стилизация

### Tailwind — кастомные значения

**Цвета:**
| Класс | HEX | Использование |
|-------|-----|---------------|
| `bg-gray-light` | #f5f5f7 | Фон карточек |
| `text-gray-medium` | #86868b | Вторичный текст |
| `text-gray-dark` / `bg-gray-dark` | #1d1d1f | Основной текст |

**Тени:**
| Класс | Использование |
|-------|---------------|
| `shadow-liquid` | Стандартная тень |
| `shadow-liquid-hover` | Усиленная тень при hover |

### Glassmorphism — паттерн

```jsx
// Базовый liquid-glass эффект
<div className="liquid-glass">

// С hover-анимацией (используй утилиту card-hover)
<div className="liquid-glass card-hover">
```

### Утилитарные классы (index.css)

| Класс | Описание |
|-------|----------|
| `.section-padding` | Стандартные отступы секций (`px-6 lg:px-60`) |
| `.section-margin` | Стандартные margin секций (`mx-6 lg:mx-60`) |
| `.card-hover` | Hover эффект для карточек (тень + scale) |
| `.nav-link` | Стиль навигационной ссылки |

---

## Паттерны кода

### Адаптивность (Mobile-first)

```jsx
// Скрыть на мобильном, показать на desktop
<div className="hidden lg:block">Desktop only</div>

// Адаптивные отступы
<div className="px-6 lg:px-60">  // 24px → 240px
```

### Шаблон страницы

```jsx
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'

export default function PageName() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Контент */}
      </main>
      <Footer />
    </div>
  )
}
```

### Добавление новой страницы

1. Создать файл в `pages/catalog/` или `pages/info/`
2. Использовать шаблон страницы
3. Добавить импорт и Route в `App.jsx`
4. Обновить ссылки в компонентах (Link)

---

## Технологии

| Технология | Версия | Назначение |
|------------|--------|-----------|
| React | 19.x | UI-библиотека |
| React Router | 7.x | Роутинг |
| Vite | 7.x | Сборщик |
| Tailwind CSS | 3.x | Стилизация |
| Swiper | 12.x | Карусели |
| Lucide React | 0.563.x | Иконки |

---

## Контакты магазина

> Все контакты централизованы в `src/data/config.js`

| Поле | Значение |
|------|----------|
| Телефон | +7 (909) 797-31-86 |
| Email | info@appgrade.ru |
| Город | Калининград |
| Адрес | проспект Мира, 59 |
| Время работы | Ежедневно 11:00–20:00 |

---

## Особенности проекта

- React Router для навигации (BrowserRouter)
- Mobile-first подход (брейкпоинт `lg:` = 1024px)
- Шрифт SF Pro Display (CDN)
- Liquid Glass дизайн-система
