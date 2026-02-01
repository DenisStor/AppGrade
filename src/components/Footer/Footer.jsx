import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { FooterContacts } from './FooterContacts'
import { FooterColumn } from './FooterColumn'
import { FooterBottom } from './FooterBottom'
import { Send, MessageCircle } from 'lucide-react'
import { CONTACTS } from '../../data/config'
import { FOOTER_SECTIONS } from '../../data/navigation'
import logo from '../../assets/logo.png'

const SOCIAL_LINKS = [
  {
    name: 'Telegram',
    href: CONTACTS.telegram,
    icon: Send,
  },
  {
    name: 'VK',
    href: CONTACTS.vk,
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.189 1.362 1.26 2.174 1.82.614.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.999-1.328 1.398-2.139 1.273-2.485-.119-.33-.856-.243-.856-.243l-2.443.015s-.181-.025-.315.056c-.131.079-.216.262-.216.262s-.387 1.028-.903 1.903c-1.089 1.85-1.525 1.948-1.703 1.833-.414-.266-.31-1.07-.31-1.64 0-1.783.27-2.525-.527-2.718-.265-.064-.46-.106-1.138-.113-.869-.009-1.605.003-2.02.207-.277.135-.49.439-.36.456.161.021.525.098.718.36.25.34.24 1.1.24 1.1s.145 2.098-.332 2.357c-.327.178-.775-.185-1.737-1.848-.493-.853-.866-1.796-.866-1.796s-.072-.176-.2-.27c-.154-.115-.37-.151-.37-.151l-2.322.015s-.348.01-.476.161c-.113.134-.009.412-.009.412s1.817 4.246 3.873 6.386c1.885 1.962 4.025 1.834 4.025 1.834h.97z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: CONTACTS.whatsapp,
    icon: MessageCircle,
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Градиентная линия сверху */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Основной фон с градиентом */}
      <div className="bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
        <Container>
          <div className="pt-16 pb-12">
            {/* Лого и соцсети */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b border-white/5">
              <Link to="/" className="group">
                <img
                  src={logo}
                  alt="APPGRADE"
                  className="h-7 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </Link>

              {/* Соцсети */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-300"
                      aria-label={social.name}
                    >
                      <IconComponent size={20} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-12">
              <FooterContacts />
              <FooterColumn {...FOOTER_SECTIONS.catalog} />
              <FooterColumn {...FOOTER_SECTIONS.info} />
              <FooterColumn {...FOOTER_SECTIONS.support} />
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden">
              <FooterContacts />
              <div className="mt-8">
                <FooterColumn {...FOOTER_SECTIONS.catalog} />
                <FooterColumn {...FOOTER_SECTIONS.info} />
                <FooterColumn {...FOOTER_SECTIONS.support} />
              </div>
            </div>
          </div>

          <FooterBottom />
        </Container>
      </div>
    </footer>
  )
}
