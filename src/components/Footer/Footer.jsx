import { Container } from '../ui/Container'
import { FooterContacts } from './FooterContacts'
import { FooterColumn } from './FooterColumn'
import { FooterBottom } from './FooterBottom'
import logo from '../../assets/logo.png'

const FOOTER_LINKS = {
  catalog: {
    title: 'Каталог',
    links: [
      { label: 'iPhone', href: '/iphone' },
      { label: 'Mac', href: '/mac' },
      { label: 'iPad', href: '/ipad' },
      { label: 'Watch', href: '/watch' },
      { label: 'AirPods', href: '/airpods' },
      { label: 'Аксессуары', href: '/accessories' },
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

export function Footer() {
  return (
    <footer className="bg-gray-dark border-t border-gray-700 pt-12 pb-6">
      <Container>
        {/* Logo */}
        <div className="mb-8">
          <a href="/">
            <img src={logo} alt="APPGRADE" className="h-6 brightness-0 invert" />
          </a>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          <FooterContacts />
          <FooterColumn {...FOOTER_LINKS.catalog} />
          <FooterColumn {...FOOTER_LINKS.info} />
          <FooterColumn {...FOOTER_LINKS.support} />
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden">
          <FooterContacts />
          <div className="mt-6">
            <FooterColumn {...FOOTER_LINKS.catalog} />
            <FooterColumn {...FOOTER_LINKS.info} />
            <FooterColumn {...FOOTER_LINKS.support} />
          </div>
        </div>

        <FooterBottom />
      </Container>
    </footer>
  )
}
