// Данные для страницы сервиса (ремонта)
import serviceFast from '../assets/service-fast.jpg'
import serviceHome from '../assets/service-home.jpg'
import serviceContact from '../assets/service-contact.jpg'

export const SERVICE_FEATURES = [
  {
    id: 1,
    title: 'Быстро.',
    description: 'Большинство ремонтов выполняем за 1-2 часа. Вы можете подождать в нашем уютном офисе или оставить устройство и забрать позже.',
    image: serviceFast,
  },
  {
    id: 2,
    title: 'Как дома.',
    description: 'Комфортная зона ожидания с кофе и Wi-Fi. Работаем прозрачно — можете наблюдать за процессом ремонта.',
    image: serviceHome,
  },
  {
    id: 3,
    title: 'На связи.',
    description: 'Информируем о статусе ремонта в мессенджерах. Отвечаем на все вопросы до, во время и после ремонта.',
    image: serviceContact,
  },
]

export const WHY_US = [
  {
    id: 1,
    icon: 'Zap',
    title: 'Быстрый ремонт',
    description: 'Большинство ремонтов за 1-2 часа благодаря наличию запчастей на складе',
  },
  {
    id: 2,
    icon: 'Shield',
    title: 'Гарантия 1 год',
    description: 'Даём гарантию на все выполненные работы и установленные запчасти',
  },
  {
    id: 3,
    icon: 'Smartphone',
    title: 'Подменный iPhone',
    description: 'Предоставляем подменный телефон на время сложного ремонта бесплатно',
  },
]

export const SERVICE_PRICING = [
  {
    id: 1,
    name: 'Замена экрана iPhone',
    time: 'от 1 часа',
    price: 'от 4 990 ₽',
  },
  {
    id: 2,
    name: 'Замена аккумулятора iPhone',
    time: 'от 30 мин',
    price: 'от 2 490 ₽',
  },
  {
    id: 3,
    name: 'Замена заднего стекла iPhone',
    time: 'от 2 часов',
    price: 'от 5 990 ₽',
  },
  {
    id: 4,
    name: 'Замена разъёма зарядки',
    time: 'от 1 часа',
    price: 'от 2 990 ₽',
  },
  {
    id: 5,
    name: 'Ремонт Face ID',
    time: 'от 2 часов',
    price: 'от 6 990 ₽',
  },
  {
    id: 6,
    name: 'Замена динамика',
    time: 'от 40 мин',
    price: 'от 1 990 ₽',
  },
  {
    id: 7,
    name: 'Замена камеры',
    time: 'от 1 часа',
    price: 'от 3 990 ₽',
  },
  {
    id: 8,
    name: 'Восстановление после воды',
    time: 'от 24 часов',
    price: 'от 3 990 ₽',
  },
  {
    id: 9,
    name: 'Диагностика устройства',
    time: 'от 20 мин',
    price: 'Бесплатно',
  },
]

export const HOW_WE_WORK = [
  {
    id: 1,
    number: '01',
    title: 'Диагностика',
    description: 'Бесплатно определяем неисправность и озвучиваем точную стоимость ремонта',
  },
  {
    id: 2,
    number: '02',
    title: 'Согласование',
    description: 'Согласовываем стоимость и сроки. Приступаем к работе только после вашего подтверждения',
  },
  {
    id: 3,
    number: '03',
    title: 'Ремонт',
    description: 'Выполняем ремонт с использованием качественных комплектующих',
  },
  {
    id: 4,
    number: '04',
    title: 'Проверка',
    description: 'Тестируем устройство, выдаём гарантийный талон и чек',
  },
]
