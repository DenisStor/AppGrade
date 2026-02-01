export const dysonProducts = [
  {
    id: 'dyson-supersonic-hd08',
    slug: 'dyson-supersonic-hd08',
    category: 'hairdryers',
    name: 'Dyson Supersonic HD08',
    shortDescription: 'Фен с технологией Air Multiplier. 5 насадок в комплекте.',
    badges: ['hit'],
    variants: [
      {
        id: 'dyson-supersonic-hd08-fuchsia',
        color: { id: 'iron-fuchsia', name: 'Никель/Фуксия', hex: '#c8326f' },
        memory: null,
        price: 49990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/332966-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
      {
        id: 'dyson-supersonic-hd08-copper',
        color: { id: 'nickel-copper', name: 'Никель/Медь', hex: '#b87333' },
        memory: null,
        price: 49990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/389922-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
      {
        id: 'dyson-supersonic-hd08-blue',
        color: { id: 'prussian-blue', name: 'Берлинская лазурь', hex: '#003153' },
        memory: null,
        price: 49990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/426107-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
    ],
    specs: {
      power: '1600 Вт',
      airflow: '41 л/с',
      weight: '720 г',
      attachments: '5 насадок',
      cord: '2.7 м',
    },
    description:
      'Dyson Supersonic HD08 — революционный фен с цифровым мотором V9 и интеллектуальным контролем температуры. Предотвращает экстремальные повреждения от перегрева.',
    relatedIds: ['dyson-airwrap-complete', 'dyson-corrale'],
  },
  {
    id: 'dyson-airwrap-complete',
    slug: 'dyson-airwrap-complete',
    category: 'stylers',
    name: 'Dyson Airwrap Complete',
    shortDescription: 'Стайлер для разных типов волос. 6 насадок.',
    badges: ['new'],
    variants: [
      {
        id: 'dyson-airwrap-complete-fuchsia',
        color: { id: 'nickel-fuchsia', name: 'Никель/Фуксия', hex: '#c8326f' },
        memory: null,
        price: 54990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/400714-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
      {
        id: 'dyson-airwrap-complete-copper',
        color: { id: 'nickel-copper', name: 'Никель/Медь', hex: '#b87333' },
        memory: null,
        price: 54990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/400716-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
    ],
    specs: {
      power: '1300 Вт',
      airflow: '35 л/с',
      weight: '660 г',
      attachments: '6 насадок',
      cord: '2.7 м',
    },
    description:
      'Dyson Airwrap Complete — мультистайлер для укладки, завивки и сушки волос без экстремального нагрева. Использует эффект Коанда для укладки.',
    relatedIds: ['dyson-airwrap-complete-long', 'dyson-supersonic-hd08'],
  },
  {
    id: 'dyson-airwrap-complete-long',
    slug: 'dyson-airwrap-complete-long',
    category: 'stylers',
    name: 'Dyson Airwrap Complete Long',
    shortDescription: 'Стайлер для длинных волос. Удлинённые насадки.',
    badges: ['new'],
    variants: [
      {
        id: 'dyson-airwrap-complete-long-fuchsia',
        color: { id: 'nickel-fuchsia', name: 'Никель/Фуксия', hex: '#c8326f' },
        memory: null,
        price: 57990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/400718-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
      {
        id: 'dyson-airwrap-complete-long-blue',
        color: { id: 'prussian-blue', name: 'Берлинская лазурь', hex: '#003153' },
        memory: null,
        price: 57990,
        oldPrice: null,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/426059-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
    ],
    specs: {
      power: '1300 Вт',
      airflow: '35 л/с',
      weight: '660 г',
      attachments: '6 удлинённых насадок',
      cord: '2.7 м',
    },
    description:
      'Dyson Airwrap Complete Long — версия мультистайлера с удлинёнными насадками для волос длиной от 25 см. Идеален для длинных волос.',
    relatedIds: ['dyson-airwrap-complete', 'dyson-corrale'],
  },
  {
    id: 'dyson-corrale',
    slug: 'dyson-corrale',
    category: 'stylers',
    name: 'Dyson Corrale',
    shortDescription: 'Беспроводной выпрямитель. Гибкие пластины.',
    badges: ['hit'],
    variants: [
      {
        id: 'dyson-corrale-fuchsia',
        color: { id: 'nickel-fuchsia', name: 'Никель/Фуксия', hex: '#c8326f' },
        memory: null,
        price: 44990,
        oldPrice: 49990,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/322961-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
      {
        id: 'dyson-corrale-blue',
        color: { id: 'prussian-blue', name: 'Берлинская лазурь', hex: '#003153' },
        memory: null,
        price: 44990,
        oldPrice: 49990,
        inStock: true,
        images: [
          'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/426041-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=480',
        ],
      },
    ],
    specs: {
      power: '200 Вт (беспроводной)',
      temperature: '165°C / 185°C / 210°C',
      weight: '561 г',
      battery: 'До 30 минут',
      charging: '70 минут',
    },
    description:
      'Dyson Corrale — единственный выпрямитель с гибкими пластинами. Адаптируется к форме волос, снижает повреждения на 50%. Работает от батареи.',
    relatedIds: ['dyson-supersonic-hd08', 'dyson-airwrap-complete'],
  },
]

