# AppGrade

Магазин электроники Apple-тематики — современный SPA на React.

## Технологии

| Технология | Версия | Назначение |
|------------|--------|-----------|
| React | 19 | UI-библиотека |
| Vite | 7 | Сборщик |
| Tailwind CSS | 3.4 | Стилизация |
| Swiper | 12 | Карусели |
| Lucide React | — | Иконки |

## Запуск

```bash
# Установка зависимостей
npm install

# Dev-сервер
npm run dev

# Сборка
npm run build

# Превью сборки
npm run preview
```

## Структура

```
src/
├── main.jsx              # Точка входа
├── App.jsx               # Корневой компонент
├── index.css             # Глобальные стили
├── pages/                # Страницы
├── components/           # Компоненты
│   ├── ui/               # UI-компоненты
│   ├── Header/           # Шапка
│   ├── Hero/             # Баннер
│   ├── Categories/       # Категории
│   ├── ProductCard/      # Карточки товаров
│   ├── Benefits/         # Преимущества
│   ├── InfoBlocks/       # Инфо-блоки
│   └── Footer/           # Подвал
├── data/                 # Статические данные
├── hooks/                # Кастомные хуки
└── assets/               # Изображения
```

## Особенности

- Glassmorphism дизайн
- Mobile-first подход
- Адаптивная верстка
- Шрифт SF Pro Display

## Автор

Denis Storozev
