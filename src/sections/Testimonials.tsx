"use client"
import { useEffect, useRef, memo, useCallback, useState } from "react"

/* ------------------------------------------------------
   Testimonials Data
------------------------------------------------------ */
const testimonials = [
  {
    name: "Ankita Acharjee",
    role: "My Biggest Motivator",
    quote:
      "He is a person with fresh ideas and a highly creative mindset who approaches every task with passion and dedication. He genuinely enjoys his work and is always eager to explore new opportunities and challenges. Rather than fearing failure, he sees every obstacle as a valuable chance to learn, improve, and grow.His unique way of thinking enables him to discover innovative solutions to everyday problems, making his approach both effective and distinctive. By continuously pushing his limits and stepping beyond his comfort zone, he keeps evolving as an individual while inspiring others to think creatively and embrace new possibilities.",
    color: "#d406b2",
  },
  {
    name: "Subha Sarkar",
    role: "My Batchmate",
    quote:
      "Rupak has a unique ability to turn ideas into reality. His commitment to excellence and innovative thinking always stand out.",
    color: "#a855f7",
  },
  {
    name: "Surjendu Mukherjee",
    role: "My Batchmate",
    quote:
      "An incredibly talented buddy who consistently goes above and beyond. Creative, dependable, and always willing to help, he makes every project both productive and enjoyable. The quality of his work speaks for itself.",
    color: "#f59e0b",
  },
  {
    name: "Debayan Laha",
    role: "My Batchmate",
    quote:
      "An exceptionally talented buddy who never settles for good enough. Dependable, creative, and always ready to support others, he brings passion and excellence into everything he does.",
    color: "#ef4444",
  },
  {
    name: "Tirtha Mondal",
    role: "My Batchmate",
    quote:
      "Many people come and go in life, but only a few become truly unforgettable. You are one of those special people for me. Your support, understanding, and genuine care have made a difference in my life in ways I can never fully explain. No matter where life takes us, I will always be grateful for you and the beautiful place you hold in my heart. ❤️",
    color: "#22c55e",
  },
]

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Avatar Placeholder Component
const AvatarPlaceholder = memo(({
  name,
  color,
  size = "md",
  isLight,
}: {
  name: string
  color: string
  size?: "sm" | "md"
  isLight: boolean
}) => {
  const initials = getInitials(name)
  const sizeClasses = size === "sm" ? "w-12 h-12 text-sm" : "w-14 h-14 text-base"

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold backdrop-blur-sm shadow-lg border ${isLight
        ? "text-gray-900 border-gray-300"
        : "text-white border-white/20"
        }`}
      style={{
        background: `linear-gradient(135deg, ${color}E6, ${color}80)`,
      }}
    >
      {initials}
    </div>
  )
})
AvatarPlaceholder.displayName = 'AvatarPlaceholder'

/* ------------------------------------------------------
   Testimonials Component
------------------------------------------------------ */
export default function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      forceUpdate(v => v + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isLight = document.documentElement.classList.contains("light");

  useEffect(() => {
    setHeaderVisible(true)
  }, [])

  return (
    <section
      id="testimonials"
      className={`relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-12 py-20 overflow-hidden transition-colors duration-500 ${isLight
        ? "bg-gradient-to-b from-white via-slate-50 to-white text-gray-900"
        : "bg-black text-white"
        }`}
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(6,182,212,.22), transparent 70%)'
              : 'radial-gradient(circle, rgba(6,182,212,.15), transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(168,85,247,.22), transparent 70%)'
              : 'radial-gradient(circle, rgba(168,85,247,.15), transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Section Heading */}
      <h2
        className={`text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-12 md:mb-20 tracking-tight transition-all duration-1000 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
      >
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          What People Say
        </span>
      </h2>

      {/* Infinite Carousel */}
      <InfiniteCarousel
        testimonials={testimonials}
        isLight={isLight}
      />

      {/* Testimonial Cards Grid */}
      <div className="mt-20 md:mt-32 w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={i}
            {...t}
            index={i}
            isLight={isLight}
          />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------
   Infinite Carousel
------------------------------------------------------ */
type Testimonial = {
  name: string
  role: string
  quote: string
  color: string
}

// Memoized carousel item
const CarouselItem = memo(({
  testimonial,
  isLight,
}: {
  testimonial: Testimonial
  isLight: boolean
}) => {
  return (
    <div
      className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg backdrop-blur-lg min-w-[280px] hover:scale-105 transition-transform duration-300 ${isLight
        ? "bg-white border border-gray-200"
        : "bg-white/5 border border-white/10"
        }`}
    >
      <AvatarPlaceholder
        name={testimonial.name}
        color={testimonial.color}
        size="sm"
        isLight={isLight}
      />
      <div>
        <p className={`${isLight ? "text-gray-900" : "text-white"} font-medium`}>{testimonial.name}</p>
        <p className={`${isLight ? "text-gray-600" : "text-neutral-400"} text-sm`}>{testimonial.role}</p>
      </div>
    </div>
  )
})
CarouselItem.displayName = 'CarouselItem'

function InfiniteCarousel({
  testimonials,
  isLight,
}: {
  testimonials: Testimonial[]
  isLight: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div
      className="overflow-hidden w-full py-8 md:py-12 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className={`flex gap-8 md:gap-12 ${isPaused ? 'animate-none' : 'animate-scroll'}`}
        style={{
          width: 'max-content',
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <CarouselItem
            key={i}
            testimonial={t}
            isLight={isLight}
          />
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------
   Testimonial Card with 3D Tilt Effect
------------------------------------------------------ */
const TestimonialCard = memo(({
  name,
  role,
  quote,
  color,
  index,
  isLight,
}: {
  name: string
  role: string
  quote: string
  color: string
  index: number
  isLight: boolean
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })


  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 3D Tilt effect on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * 8
    const rotateY = ((x - centerX) / centerX) * -8

    setTransform({ rotateX, rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`testimonial-card relative rounded-3xl backdrop-blur-lg p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-700 ${isLight
        ? "bg-white border border-gray-200"
        : "bg-white/5 border border-white/10"
        } ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
        }`}
      style={{
        boxShadow: isLight
          ? `0 0 35px ${color}25`
          : `0 0 40px ${color}40`,
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transitionDelay: `${index * 100}ms`,
        willChange: 'transform',
      }}
    >
      {/* Quote Icon */}
      <div
        className="text-4xl md:text-5xl mb-6 opacity-80"
        style={{ color }}
      >
        ❝
      </div>

      {/* Quote */}
      <p className={`text-base md:text-lg ${isLight ? "text-gray-700" : "text-neutral-200"} leading-relaxed mb-6 md:mb-8`}>
        {quote}
      </p>

      {/* Author */}
      <div className={`flex items-center gap-4 pt-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <AvatarPlaceholder name={name} color={color} size="md" isLight={isLight} />
        <div>
          <p className={`${isLight ? "text-gray-900" : "text-white"} font-semibold text-base md:text-lg`}>{name}</p>
          <p className={`${isLight ? "text-gray-600" : "text-neutral-400"} text-sm`}>{role}</p>
        </div>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 ${isLight
          ? "opacity-0 hover:opacity-20"
          : "opacity-0 hover:opacity-10"
          }`}
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />
    </div>
  )
})
TestimonialCard.displayName = 'TestimonialCard'