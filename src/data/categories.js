import iphoneImg from '../assets/categories/iphone-new.png'
import ipadImg from '../assets/categories/ipad-new.png'
import airpodsImg from '../assets/categories/airpods-new.png'
import watchImg from '../assets/categories/watch-new.png'
import macbookImg from '../assets/categories/macbook-new.png'

export const categories = [
  { id: 1, name: 'iPhone', subtitle: 'Больше, чем телефон', image: iphoneImg, link: '/catalog/smartphones/apple', imageClassName: 'w-[72%]', imageContainerClassName: 'items-end' },
  { id: 2, name: 'iPad', subtitle: 'Создавай без границ', image: ipadImg, link: '/catalog/tablets/apple', imageClassName: 'w-[82%] ml-auto', imageContainerClassName: 'items-end' },
  { id: 3, name: 'AirPods', subtitle: 'Звук, который чувствуешь', image: airpodsImg, link: '/catalog/headphones/apple', imageClassName: 'w-[48%]' },
  { id: 4, name: 'Apple Watch', subtitle: 'Время быть лучше', image: watchImg, link: '/catalog/watches/apple', imageClassName: 'w-[50%]' },
  { id: 5, name: 'Macbook', subtitle: 'Мощь в каждом пикселе', image: macbookImg, link: '/catalog/laptops/apple', imageClassName: 'w-[90%]' },
]
