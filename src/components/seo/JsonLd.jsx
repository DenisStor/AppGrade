import { CONTACTS, COMPANY, SITE_URL } from '../../data/config'
import { getBrandSlug } from '../../utils/product'

export function ProductJsonLd({ product, variant, category, brand }) {
  if (!product || !variant) return null

  const brandSlug = brand || getBrandSlug(product.brand)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: variant.images?.[0],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Apple',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/catalog/${category}/${brandSlug}/${product.slug}`,
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
    ...(product.mpn && { mpn: product.mpn }),
    ...(product.gtin13 && { gtin13: product.gtin13 }),
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
        item: `${SITE_URL}/`,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `${SITE_URL}${item.href}` : undefined,
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
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
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
    image: `${SITE_URL}/logo.png`,
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
