const infoBlocks = [
  {
    id: 1,
    title: 'Оригинальная техника',
    subtitle: 'Только сертифицированные устройства Apple',
    description: 'Официальная гарантия и поддержка от производителя. Каждое устройство проходит проверку подлинности.',
    imagePosition: 'right',
  },
  {
    id: 2,
    title: 'Доставка в день заказа',
    subtitle: 'Курьер по Калининграду за 2-3 часа',
    description: 'Бесплатная доставка при заказе от 10 000 ₽. Отслеживание заказа в реальном времени.',
    imagePosition: 'left',
  },
  {
    id: 3,
    title: 'Trade-in и рассрочка',
    subtitle: 'Обменяй старое устройство на скидку',
    description: 'Рассрочка 0% до 24 месяцев без переплат. Мгновенная оценка вашего устройства.',
    imagePosition: 'right',
  },
]

function InfoBlockItem({ title, subtitle, description, imagePosition, index }) {
  const isReversed = imagePosition === 'left'

  const textContent = (
    <div className="flex flex-col justify-center">
      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
        {subtitle}
      </span>
      <h3 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-4">
        {title}
      </h3>
      <p className="text-gray-medium text-lg leading-relaxed">
        {description}
      </p>
    </div>
  )

  const imageContent = (
    <div className="liquid-glass rounded-liquid-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-lg">Изображение {index + 1}</span>
      </div>
    </div>
  )

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Mobile: картинка всегда сверху */}
      <div className="lg:hidden">
        {imageContent}
      </div>
      <div className="lg:hidden">
        {textContent}
      </div>

      {/* Desktop: чередование */}
      {isReversed ? (
        <>
          <div className="hidden lg:block">{imageContent}</div>
          <div className="hidden lg:block">{textContent}</div>
        </>
      ) : (
        <>
          <div className="hidden lg:block">{textContent}</div>
          <div className="hidden lg:block">{imageContent}</div>
        </>
      )}
    </div>
  )
}

export function InfoBlocks() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-6 lg:mx-60 border-t border-gray-300 mb-12" />
      <div className="px-6 lg:px-60">
        <h2 className="text-2xl lg:text-3xl font-bold mb-12 lg:mb-16 text-gray-dark">
          Почему мы
        </h2>
        <div className="flex flex-col gap-16 lg:gap-24">
          {infoBlocks.map((block, index) => (
            <InfoBlockItem
              key={block.id}
              {...block}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
