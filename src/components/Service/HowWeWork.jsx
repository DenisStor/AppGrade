import { ChevronRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeader } from '../ui/SectionHeader'
import { HOW_WE_WORK } from '../../data/service'

export function HowWeWork() {
  return (
    <section className="py-12 lg:py-20">
      <Container>
        <SectionHeader
          title="Как мы работаем"
          subtitle="4 простых шага до исправного устройства"
          className="mb-10"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
          {HOW_WE_WORK.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="text-center lg:px-4">
                <span className="text-6xl lg:text-8xl font-bold text-gray-200 block mb-4">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-gray-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-medium">
                  {step.description}
                </p>
              </div>
              {index < HOW_WE_WORK.length - 1 && (
                <div className="hidden lg:flex absolute top-12 right-0 translate-x-1/2 z-10">
                  <ChevronRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
