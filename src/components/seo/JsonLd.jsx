import { CONTACTS, COMPANY } from '../../data/config'

export function ProductJsonLd({ product, variant, category }) {
  if (!product || !variant) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: variant.images?.[0],
    brand: {
      '@type': 'Brand',
      name: 'Apple',
    },
    offers: {
      '@type': 'Offer',
      url: `https://appgrade.ru/catalog/${category}/${product.slug}`,
      priceCurrency: 'RUB',
      price: variant.price,
      availability: variant.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: COMPANY.name,
      },
    },
    sku: variant.id,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbJsonLd({ items = [] }) {
  if (!items.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://appgrade.ru/',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `https://appgrade.ru${item.href}` : undefined,
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: 'https://appgrade.ru',
    logo: 'https://appgrade.ru/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACTS.phone,
      contactType: 'customer service',
      availableLanguage: 'Russian',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACTS.city,
      streetAddress: CONTACTS.address,
      addressCountry: 'RU',
    },
    sameAs: [CONTACTS.vk, CONTACTS.telegram],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: COMPANY.name,
    image: 'https://appgrade.ru/logo.png',
    telephone: CONTACTS.phone,
    email: CONTACTS.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACTS.city,
      streetAddress: CONTACTS.address,
      addressCountry: 'RU',
    },
    openingHours: 'Mo-Su 11:00-20:00',
    priceRange: '₽₽₽',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
