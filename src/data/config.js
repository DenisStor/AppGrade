import serviceContact from '../assets/service-contact.jpg'

export const SITE_URL = 'https://appgrade.ru'

// Локации магазинов
export const LOCATIONS = [
  {
    id: 1,
    name: 'APPGRADE',
    address: 'Калининград, проспект Мира, 57-59',
    description: 'Магазин техники и сервисный центр',
    workHours: 'Ежедневно 11:00 — 20:00',
    image: serviceContact,
    mapUrl: 'https://yandex.ru/maps/-/CDxZjE~Z',
    iframeSrc: 'https://yandex.ru/map-widget/v1/?ll=20.479182,54.720305&z=16&l=map&pt=20.479182,54.720305,pm2rdm',
  },
]

// Контактные данные магазина
export const CONTACTS = {
  phone: '52-56-56',
  phoneLink: 'tel:525656',
  email: 'info@appgrade.ru',
  city: 'Калининград',
  address: 'проспект Мира, 57-59',
  fullAddress: 'Калининград, проспект Мира, 57-59',
  workHours: 'Ежедневно 11:00 — 20:00',
  whatsapp: 'https://wa.me/79097973186',
  telegram: 'https://t.me/appgrade',
  vk: 'https://vk.com/appgrade',
  mapId: '156841140469'
}

// Юридическая информация
export const COMPANY = {
  name: 'APPGRADE',
  legalName: 'ИП Серов Василий Александрович',
  inn: '390606876585',
  ogrnip: '325390000056442',
  year: new Date().getFullYear()
}
