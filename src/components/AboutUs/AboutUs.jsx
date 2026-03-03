import { useRef, useState } from 'react'
import { User, Users, TrendingUp, ShieldCheck, Play, Pause, Volume1, Volume2, VolumeX } from 'lucide-react'
import { SectionDivider } from '../ui/SectionDivider'

const features = [
  {
    icon: User,
    title: 'Качество',
    description: 'Мы работаем только с оригинальной продукцией Apple с полной гарантией качества'
  },
  {
    icon: Users,
    title: 'Команда',
    description: 'Профессиональные консультанты помогут подобрать идеальное устройство для ваших задач'
  },
  {
    icon: TrendingUp,
    title: 'Развитие',
    description: 'Постоянно расширяем ассортимент и улучшаем сервис для наших клиентов'
  },
  {
    icon: ShieldCheck,
    title: 'Надежность',
    description: 'Официальная гарантия на все товары и профессиональный сервисный центр'
  }
]

export function AboutUs({ showDivider = true }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(1)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    const video = videoRef.current
    if (!video) return
    video.volume = newVolume
    setVolume(newVolume)
    if (newVolume === 0) {
      video.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      video.muted = false
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    if (isMuted) {
      video.muted = false
      setIsMuted(false)
      if (volume === 0) {
        video.volume = 0.5
        setVolume(0.5)
      }
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <section className="pb-14 md:pb-20">
      {showDivider && <SectionDivider className="mb-14 md:mb-20" />}
      <div className="section-padding">
        {/* Верхняя часть - 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-16">
          {/* Левая колонка - текст */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-6">
              О нас
            </h2>
            <p className="text-gray-medium text-base lg:text-lg mb-4">
              AppGrade — это команда энтузиастов, которая с 2018 года помогает клиентам
              выбирать и приобретать технику Apple. Мы ценим доверие каждого покупателя
              и стремимся предоставить лучший сервис.
            </p>
            <p className="text-gray-medium text-base lg:text-lg">
              Наш магазин предлагает полный ассортимент оригинальной продукции Apple
              с официальной гарантией. Мы работаем напрямую с авторизованными
              дистрибьюторами, что гарантирует подлинность каждого устройства.
            </p>
          </div>

          {/* Правая колонка - видео */}
          <div className="lg:order-last relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/videos/about-poster.jpg"
              className="w-full h-64 lg:h-full object-cover rounded-card"
            >
              <source src="/videos/about.mp4" type="video/mp4" />
            </video>

            {/* Управление видео */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Поставить на паузу' : 'Воспроизвести'}
                className="liquid-glass-clear w-9 h-9 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/40 active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Volume group — slider appears on hover */}
              <div className="group/vol flex items-center">
                <div className="overflow-hidden w-0 group-hover/vol:w-[88px] transition-all duration-200">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider w-20 mr-2 opacity-0 group-hover/vol:opacity-100 transition-opacity duration-200"
                    aria-label="Громкость"
                  />
                </div>
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                  className="liquid-glass-clear w-9 h-9 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/40 active:scale-95"
                >
                  <VolumeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть - 4 карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="liquid-glass rounded-card p-5 lg:p-6 hover:shadow-liquid-hover hover:scale-[1.02] transition-all duration-liquid"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-medium text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
