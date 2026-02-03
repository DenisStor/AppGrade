// Базовые ссылки (единый источник)
const CATALOG_LINKS = [
  { label: 'iPhone', href: '/catalog/smartphones' },
  { label: 'Mac', href: '/catalog/laptops' },
  { label: 'iPad', href: '/catalog/tablets' },
  { label: 'Watch', href: '/catalog/watches' },
  { label: 'AirPods', href: '/catalog/headphones' },
  { label: 'Аксессуары', href: '/catalog/accessories' },
]

const INFO_LINKS = [
  { label: 'Доставка и оплата', href: '/delivery' },
  { label: 'Гарантия', href: '/warranty' },
  { label: 'Контакты', href: '/contacts' },
]

const EXTRA_NAV_LINKS = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Сервис', href: '/service' },
  { label: 'Блог', href: '/blog' },
  { label: 'О нас', href: '/about' },
]

// Производные (компонуем из базовых)
export const NAV_MAIN = [...CATALOG_LINKS, ...EXTRA_NAV_LINKS]

export const NAV_TOP = INFO_LINKS

export const NAV_MOBILE = [
  ...CATALOG_LINKS,
  ...INFO_LINKS,
  { label: 'Блог', href: '/blog' },
  { label: 'О нас', href: '/about' },
]

export const FOOTER_SECTIONS = {
  catalog: {
    title: 'Каталог',
    links: CATALOG_LINKS,
  },
  info: {
    title: 'Информация',
    links: [
      { label: 'О компании', href: '/about' },
      ...INFO_LINKS.slice(0, 2),
      { label: 'Возврат товара', href: '/returns' },
      { label: 'Сервисный центр', href: '/service' },
    ],
  },
  support: {
    title: 'Поддержка',
    links: [
      { label: 'Контакты', href: '/contacts' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Trade-in', href: '/trade-in' },
      { label: 'Рассрочка', href: '/credit' },
    ],
  },
}

// Экспорт базовых для переиспользования
export { CATALOG_LINKS, INFO_LINKS }
