export function NewsCard({ image, date, title }) {
  return (
    <a href="#" className="block group cursor-pointer">
      <div className="aspect-[2/1] overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-xl md:text-2xl text-gray-dark group-hover:underline mb-2">
        {title}
      </h3>
      <span className="text-xs text-gray-medium uppercase tracking-wider">
        {date}
      </span>
    </a>
  )
}
