# API

Express 5, порт 3001. CORS: `http://localhost:5173`, `http://localhost:4173` (или `CORS_ORIGINS`).

## Авторизация

Bearer token в заголовке `Authorization`. JWT, срок — 4 часа.

```
Authorization: Bearer eyJhbGc...
```

При 401 → автоматический logout в админке.

---

## Публичные эндпоинты (без авторизации)

### GET /api/public/categories

Все активные категории с брендами.

**Cache:** 5 минут (max-age=300)

```json
// Ответ 200
[
  {
    "id": 1,
    "name": "Смартфоны",
    "slug": "smartphones",
    "description": "...",
    "image_url": "/uploads/categories/smartphones.jpg",
    "sort_order": 0,
    "brands": [
      { "id": 1, "name": "Apple", "slug": "apple", "logo_url": "...", "display_name": "iPhone" }
    ]
  }
]
```

### GET /api/public/categories/:slug/brands

Бренды категории с количеством товаров и мин. ценой.

**Cache:** 5 минут

```json
// Ответ 200
{
  "category": { "id": 1, "name": "Смартфоны", "slug": "smartphones", "..." : "..." },
  "brands": [
    {
      "id": 1, "name": "Apple", "slug": "apple",
      "display_name": "iPhone",
      "productCount": 12,
      "minPrice": 79990,
      "flagshipImage": "/uploads/products/iphone-17-pro-max.jpg"
    }
  ]
}

// Ответ 404
{ "error": "Категория не найдена" }
```

### GET /api/public/products

Список товаров с фильтрами.

**Cache:** no-cache (браузер проверяет актуальность при каждом запросе)

| Параметр | Тип | Описание |
|----------|-----|---------|
| category | string | Slug категории |
| brand | string | Slug бренда |
| search | string | Поиск по имени/описанию |
| is_used | 0\|1 | Б/у товары |
| page | number | Страница (по умолчанию 1) |
| limit | number | Лимит (по умолчанию 100, макс. 100) |

```json
// Ответ 200
[
  {
    "id": 1,
    "name": "iPhone 17 Pro Max",
    "slug": "iphone-17-pro-max",
    "category_name": "Смартфоны",
    "category_slug": "smartphones",
    "brand_name": "Apple",
    "brand_slug": "apple",
    "short_description": "...",
    "badges": ["new", "hit"],
    "specs": { "display": "6.9\"", "chip": "A19 Pro" },
    "is_used": 0,
    "variants": [
      {
        "id": 1, "color_name": "Чёрный", "color_hex": "#1d1d1f",
        "memory": 256, "price": 169990, "old_price": null,
        "stock_status": "in_stock",
        "images": ["/uploads/products/..."]
      }
    ],
    "simOptions": [{ "sim_id": "dual", "name": "nanoSIM + eSIM" }],
    "relatedIds": [2, 3]
  }
]
```

### GET /api/public/products/:slug

Детальная страница товара с связанными товарами.

```json
// Ответ 200 — полный объект товара + relatedProducts[]
// Ответ 404
{ "error": "Товар не найден" }
```

### GET /api/public/products/by-slugs?slugs=slug1,slug2

Товары по slug-ам (для корзины/недавних).

```json
// Ответ 200
[ { "...товар..." }, { "...товар..." } ]
```

### GET /api/public/search?q=iphone

Поиск по названию и описанию. Макс. 50 результатов.

```json
// Ответ 200
[ { "...товар..." } ]
// Пустой запрос → []
```

### GET /api/public/services

Активные услуги с ценами.

**Cache:** 5 минут (max-age=300)

```json
// Ответ 200
[
  {
    "id": 1,
    "name": "Замена экрана",
    "time": "1-2 часа",
    "sort_order": 0,
    "active": 1,
    "prices": [
      { "model_id": "iphone-15", "price": "12990" },
      { "model_id": "iphone-16", "price": "15990" }
    ]
  }
]
```

---

## Аутентификация

### POST /api/auth/login

```json
// Запрос
{ "email": "admin@appgrade.ru", "password": "admin123" }

// Ответ 201
{ "token": "eyJ...", "user": { "id": 1, "email": "admin@appgrade.ru", "name": "Администратор" } }

// Ошибки
{ "error": "Email и пароль обязательны" }    // 400
{ "error": "Неверный email или пароль" }     // 401
```

### GET /api/auth/me

**Auth:** Да

```json
// Ответ 200
{ "id": 1, "email": "admin@appgrade.ru", "name": "Администратор" }
```

---

## Баннеры (protected)

### GET /api/banners

Список всех баннеров.

### GET /api/banners/:id

Один баннер.

### POST /api/banners

```json
// Запрос
{
  "title": "iPhone 17 PRO MAX",
  "image_desktop": "/uploads/banners/hero-desktop.png",
  "image_mobile": "/uploads/banners/hero-mobile.png",
  "alt": "iPhone 17 PRO MAX",
  "link": "/catalog/smartphones/apple/iphone-17-pro-max",
  "active": 1
}

// Ответ 201 — баннер с id, sort_order, timestamps
// Ошибка 400
{ "error": "Изображения обязательны" }
```

### PUT /api/banners/:id

Частичное обновление. Ответ 200.

### PUT /api/banners/reorder

```json
// Запрос
{ "ids": [3, 1, 2] }
// Ответ 200
{ "success": true }
```

### DELETE /api/banners/:id

```json
// Ответ 200
{ "success": true }
// Ошибка 404
{ "error": "Баннер не найден" }
```

---

## Категории (protected)

### GET /api/categories

Список категорий.

### GET /api/categories/:id

Одна категория.

### POST /api/categories

```json
// Запрос
{ "name": "Смартфоны", "slug": "smartphones", "description": "...", "image_url": "...", "active": 1 }

// Ошибки 400
{ "error": "Название и slug обязательны" }
{ "error": "Slug уже используется" }
```

### PUT /api/categories/:id

Частичное обновление. Проверка уникальности slug.

### PUT /api/categories/reorder

```json
{ "ids": [2, 1, 3] }
```

### DELETE /api/categories/:id

```json
// Ошибки 400
{ "error": "Нельзя удалить категорию с подкатегориями" }
{ "error": "Нельзя удалить категорию с товарами" }
```

---

## Товары (protected)

### GET /api/products

| Параметр | Тип | Описание |
|----------|-----|---------|
| category_id | number | Фильтр по категории |
| brand_id | number | Фильтр по бренду |
| search | string | Поиск |
| active | 0\|1 | Активные/неактивные |
| is_used | 0\|1 | Б/у |
| page | number | По умолчанию 1 |
| limit | number | По умолчанию 50, макс. 100 |

```json
// Ответ 200
{
  "items": [{ "id": 1, "name": "...", "minPrice": 169990, "variantCount": 3, "..." : "..." }],
  "total": 156,
  "page": 1,
  "limit": 50
}
```

### GET /api/products/:id

Полный объект товара с вариантами, изображениями, SIM-опциями, связанными товарами.

### POST /api/products

```json
// Запрос
{
  "name": "iPhone 17 Pro Max",
  "slug": "iphone-17-pro-max",
  "category_id": 1,
  "brand_id": 1,
  "short_description": "...",
  "badges": ["new", "hit"],
  "specs": { "display": "6.9\"", "chip": "A19 Pro" },
  "active": 1,
  "variants": [
    {
      "color_name": "Чёрный", "color_hex": "#1d1d1f",
      "memory": 256, "price": 169990, "old_price": null,
      "stock_status": "in_stock",
      "images": ["/uploads/products/uuid.jpg"]
    }
  ],
  "simOptions": [{ "sim_id": "dual", "name": "nanoSIM + eSIM" }],
  "relatedIds": [2, 3]
}

// Ошибки 400
{ "error": "Название, slug, категория и бренд обязательны" }
{ "error": "Slug уже используется" }
{ "error": "Категория не найдена" }
{ "error": "Бренд не найден" }
```

Вставка атомарная (транзакция): товар → варианты → изображения → SIM → связи.

### PUT /api/products/:id

Частичное обновление. Варианты, SIM, связи заменяются целиком если указаны.

### PUT /api/products/reorder

```json
// Запрос
{ "ids": [5, 3, 1, 2, 4] }
// Ответ 200
{ "success": true }
```

### DELETE /api/products/:id

```json
{ "success": true }
```

---

## Бренды (protected)

### GET /api/brands

Список всех брендов.

```json
// Ответ 200
[
  { "id": 1, "name": "Apple", "slug": "apple", "logo_url": "...", "sort_order": 0, "active": 1 }
]
```

---

## Услуги (protected)

### GET /api/services

Все услуги с ценами.

```json
// Ответ 200
[
  {
    "id": 1, "name": "Замена экрана", "time": "1-2 часа",
    "sort_order": 0, "active": 1,
    "prices": [{ "model_id": "iphone-15", "price": "12990" }]
  }
]
```

### GET /api/services/:id

Одна услуга с ценами.

### POST /api/services

```json
// Запрос
{
  "name": "Замена экрана",
  "time": "1-2 часа",
  "active": 1,
  "prices": { "iphone-15": "12990", "iphone-16": "15990" }
}

// Ответ 201 — услуга с id, sort_order, timestamps, prices[]
// Ошибка 400
{ "error": "Название и время обязательны" }
```

### PUT /api/services/:id

Частичное обновление. Цены заменяются целиком если указаны.

### PUT /api/services/reorder

```json
// Запрос
{ "ids": [3, 1, 2] }
// Ответ 200
{ "success": true }
```

### DELETE /api/services/:id

```json
// Ответ 200
{ "success": true }
// Ошибка 404
{ "error": "Услуга не найдена" }
```

---

## Заявки (mixed auth)

### POST /api/requests (публичный)

**Rate Limit:** 5 запросов/минуту на IP

```json
// Запрос
{
  "type": "order",
  "name": "Иван Иванов",
  "phone": "+7 (999) 123-45-67",
  "email": "ivan@example.com",
  "product_name": "iPhone 17 Pro Max",
  "variant_info": "Чёрный, 256 ГБ",
  "comment": "Перезвоните после 18:00"
}

// Ответ 201
{ "id": 42, "success": true }

// Ошибки 400
{ "error": "Имя и телефон обязательны" }
{ "error": "Некорректный формат телефона" }
{ "error": "Некорректный формат email" }
{ "error": "Комментарий не должен превышать 5000 символов" }
```

### GET /api/requests (protected)

| Параметр | Тип | Описание |
|----------|-----|---------|
| type | string | order, quick_buy, repair |
| status | string | new, processing, closed |
| page | number | По умолчанию 1 |
| limit | number | По умолчанию 50 |

```json
// Ответ 200
{ "items": [...], "total": 127, "page": 1, "limit": 50 }
```

### PUT /api/requests/:id (protected)

```json
// Запрос
{ "status": "processing", "admin_notes": "Клиент перезвонил" }
```

---

## Блог (protected)

### GET /api/blog

| Параметр | Тип | Описание |
|----------|-----|---------|
| status | string | published, draft |
| page | number | По умолчанию 1 |
| limit | number | По умолчанию 50 |

```json
{ "items": [...], "total": 8, "page": 1, "limit": 50 }
```

### GET /api/blog/:id

Одна статья.

### POST /api/blog

```json
// Запрос
{
  "title": "Новости Apple",
  "slug": "novosti-apple",
  "image_url": "/uploads/blog/uuid.jpg",
  "excerpt": "...",
  "content": "<h2>...</h2><p>...</p>",
  "status": "draft"
}
// При status === "published" → published_at = now()
```

### PUT /api/blog/:id

Частичное обновление. При смене draft → published устанавливается published_at.

### DELETE /api/blog/:id

```json
{ "success": true }
```

---

## Загрузка файлов (protected)

### POST /api/upload

Multipart form data.

| Поле | Описание |
|------|---------|
| file | Файл (jpg, png, webp, gif) |
| type | products \| banners \| blog \| categories (по умолчанию products) |

**Макс. размер:** 5 МБ

```json
// Ответ 200
{ "url": "/uploads/products/550e8400-e29b-41d4-a716-446655440000.jpg" }

// Ошибки 400
{ "error": "Файл не загружен" }
{ "error": "Допустимые форматы: jpg, png, webp, gif" }
{ "error": "Файл слишком большой (макс. 5 МБ)" }
```

---

## Дашборд (protected)

### GET /api/dashboard/stats

```json
{
  "products": 156,
  "categories": 9,
  "requests": 248,
  "newRequests": 12,
  "blogPosts": 8,
  "banners": 5,
  "recentRequests": [
    { "id": 42, "type": "order", "status": "new", "name": "...", "phone": "...", "created_at": "..." }
  ]
}
```

---

## Image pipeline

Sharp-обработка изображений на лету с кэшированием.

**Путь:** `server/routes/image.js`

### Запрос

```
GET /uploads/products/image.jpg?w=800&format=webp
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| `w` | number | Ширина (snap к: 200, 400, 800, 1200, 1920) |
| `format` | string | Формат: `webp`, `jpeg`, `png`, `avif` |

### Качество

| Формат | Quality | Доп. параметры |
|--------|---------|----------------|
| WebP | 80 | — |
| AVIF | 65 | — |
| JPEG | 80 | progressive |
| PNG | 80 | compressionLevel 9 |

### Кэш

Обработанные изображения кэшируются в `server/uploads/.cache/`. Ключ: `{path}-{width}.{format}`. При повторном запросе отдаётся из кэша без обработки.

### Rate limiting

| Эндпоинт | Лимит |
|----------|-------|
| `POST /api/auth/login` | 10 запросов / 15 мин на IP |
| `POST /api/requests` | 5 запросов / мин на IP |

---

## Формат ошибок

```json
// 400 Bad Request
{ "error": "Описание ошибки валидации" }

// 401 Unauthorized
{ "error": "Требуется авторизация" }
{ "error": "Невалидный токен" }

// 404 Not Found
{ "error": "Ресурс не найден" }

// 500 Internal Server Error
// Production: { "error": "Внутренняя ошибка сервера" }
// Development: { "error": "Реальное сообщение об ошибке" }
```
