import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { FooterContacts } from './FooterContacts'
import { FooterColumn } from './FooterColumn'
import { FooterBottom } from './FooterBottom'
import { FOOTER_SECTIONS } from '../../data/navigation'
import { SOCIAL_LINKS } from '../../data/social.jsx'
import logo from '../../assets/logo.png'

export function Footer() {
  return (
    <footer className="relative overflow-hidden pb-20 lg:pb-0">
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
