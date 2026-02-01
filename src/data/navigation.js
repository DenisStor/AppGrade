// Основная навигация (каталог)
export const NAV_MAIN = [
  { label: 'iPhone', href: '/catalog/iphone' },
  { label: 'Mac', href: '/catalog/mac' },
  { label: 'iPad', href: '/catalog/ipad' },
  { label: 'Watch', href: '/catalog/watch' },
  { label: 'AirPods', href: '/catalog/airpods' },
  { label: 'Аксессуары', href: '/catalog/accessories' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Сервис', href: '/service' },
  { label: 'О нас', href: '/about' },
]

// Ссылки верхней панели
export const NAV_TOP = [
  { label: 'Доставка и оплата', href: '/delivery' },
  { label: 'Гарантия', href: '/warranty' },
  { label: 'Контакты', href: '/contacts' },
]

// Мобильное меню (объединение основной навигации и инфо-ссылок)
export const NAV_MOBILE = [
  { label: 'iPhone', href: '/catalog/iphone' },
  { label: 'Mac', href: '/catalog/mac' },
  { label: 'iPad', href: '/catalog/ipad' },
  { label: 'Watch', href: '/catalog/watch' },
  { label: 'AirPods', href: '/catalog/airpods' },
  { label: 'Аксессуары', href: '/catalog/accessories' },
  { label: 'Доставка и оплата', href: '/delivery' },
  { label: 'Гарантия', href: '/warranty' },
  { label: 'Контакты', href: '/contacts' },
  { label: 'О нас', href: '/about' },
]

// Секции футера
export const FOOTER_SECTIONS = {
  catalog: {
    title: 'Каталог',
    links: [
      { label: 'iPhone', href: '/catalog/iphone' },
      { label: 'Mac', href: '/catalog/mac' },
      { label: 'iPad', href: '/catalog/ipad' },
      { label: 'Watch', href: '/catalog/watch' },
      { label: 'AirPods', href: '/catalog/airpods' },
      { label: 'Аксессуары', href: '/catalog/accessories' },
    ],
  },
  info: {
    title: 'Информация',
    links: [
      { label: 'О компании', href: '/about' },
      { label: 'Доставка и оплата', href: '/delivery' },
      { label: 'Гарантия', href: '/warranty' },
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
