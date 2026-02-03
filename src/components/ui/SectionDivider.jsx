export function SectionDivider({ className = '' }) {
  return (
    <div className={`max-w-container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 ${className}`}>
      <div className="border-t border-gray-200" />
    </div>
  )
}
