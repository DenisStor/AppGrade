# Сборка и деплой

## Переменные окружения

Файл `.env` в корне `server/` (или в корне проекта):

| Переменная | По умолчанию | Описание |
|-----------|-------------|---------|
| `JWT_SECRET` | — | Секретный ключ для JWT (обязателен на проде) |
| `PORT` | 3001 | Порт Express-сервера |
| `NODE_ENV` | development | Окружение (development / production) |
| `CORS_ORIGINS` | http://localhost:5173,http://localhost:4173 | Разрешённые CORS-домены через запятую |

Пример: `.env.example`
```env
JWT_SECRET=your-secret-key-change-me
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
```

## Разработка

```bash
npm install          # Установить зависимости
npm run seed         # Заполнить БД (первый запуск)
npm run dev:all      # Витрина (5173) + API (3001)
```

Vite proxy: `/api` и `/uploads` → `http://localhost:3001` (настроено в `vite.config.js`).

## Сборка

```bash
npm run build        # Сборка витрины в dist/
npm run preview      # Превью сборки на localhost:4173
```

Результат: `dist/` — статические файлы (HTML + JS + CSS + assets).

Самый тяжёлый чанк — BlogEditPage (TipTap WYSIWYG): ~404KB / ~126KB gzip.

## Seed БД

```bash
npm run seed
```

Создаёт `server/data/store.db` и заполняет:
- 1 администратор (admin@appgrade.ru / admin123)
- 9 категорий, 3 бренда, 10 связей
- Товары из `src/data/products/`
- 3 статьи блога, 2 баннера

При повторном запуске — пересоздаёт данные.

## Продакшен (nginx)

```nginx
server {
    listen 80;
    server_name example.com;

    # Витрина (SPA)
    location / {
        root /var/www/electronics-store/dist;
        try_files $uri /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Загруженные файлы
    location /uploads {
        proxy_pass http://localhost:3001;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

## Запуск сервера на проде

```bash
NODE_ENV=production JWT_SECRET=your-strong-secret node server/index.js
```

Рекомендуется: PM2, Docker или systemd для управления процессом.

## Скрипты оптимизации

| Скрипт | Описание |
|--------|----------|
| `npm run optimize-assets` | Оптимизация всех изображений (scripts/optimize-assets.mjs) |
| `node scripts/optimize-iphone-photos.mjs` | Оптимизация iPhone фото из ~/Desktop/iPhone_Shop_Photos → public/images/iphone/ (Sharp resize 1200px, JPEG 80%) |

## Файлы в .gitignore

- `server/data/` — файл БД
- `server/uploads/*` — загруженные изображения
- `node_modules/`
- `dist/`
- `.env`
