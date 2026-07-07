import { useEffect, useRef, memo, useState } from "react"
import { FaIndustry, FaCloud, FaGithub } from "react-icons/fa"
import { BsStars } from "react-icons/bs"

interface ExperienceItem {
  year: string
  role: string
  company: string
  description: string
  tech: string[]
  icon: React.ReactNode
}

const experiences: ExperienceItem[] = [
  {
    year: "2024 - Present",
    role: "Google Cloud Arcade",
    company: "Google Cloud Skills Boost",
    description:
      "Actively participating in Google Cloud Arcade program since 2024. Achieved Arcade Legend status three times by completing cloud computing, AI/ML, DevOps, Kubernetes and hands-on Google Cloud labs. Continuously building expertise in modern cloud technologies through real-world challenges and quests.",
    tech: [
      "Google Cloud",
      "Cloud Computing",
      "Generative AI",
      "Vertex AI",
      "Kubernetes",
      "DevOps",
      "BigQuery",
      "Cloud Storage"
    ],
    icon: <FaCloud />,
  },
  {
    year: "2026",
    role: "Trainee - 3D Printing & Additive Manufacturing",
    company: "C-DAC Kolkata",
    description:
      "Completed a 160-hour training program on 3D Printing & Additive Manufacturing Technology under the Ministry of Electronics and Information Technology (MeitY), Government of India. Gained practical exposure to CAD design, additive manufacturing processes, prototyping and FDM-based 3D printing systems.",
    tech: ["3D Printing", "Additive Manufacturing", "CAD", "CATIA V5", "FDM Technology"],
    icon: <FaIndustry />,
  },
  {
    year: "2026",
    role: "Generative AI Trainee",
    company: "Internshala Trainings",
    description:
      "Successfully completed a 6-week Generative AI training program. Learned Python fundamentals, AI development, web technologies, AI integration, prompt engineering, DALL·E image generation, and developed AI-powered applications including Telegram chatbots.",
    tech: ["Python", "Generative AI", "Prompt Engineering", "DALL·E", "AI Integration", "Telegram Bot"],
    icon: <BsStars />,
  },
  {
    year: "2025 - Present",
    role: "Open Source Contributor",
    company: "Global Open Source Programs",
    description:
      "Actively contributing to open-source projects through programs such as Social Summer of Code (SSOC), GirlScript Summer of Code (GSSOC), and Hacktoberfest. Worked on bug fixes, feature enhancements, documentation improvements, pull requests, issue resolution, and collaborative software development using Git and GitHub.",
    tech: [
      "Git",
      "GitHub",
      "Open Source",
      "Java",
      "Python",
      "React",
      "Documentation",
      "Collaboration"
    ],
    icon: <FaGithub />,
  }
]

const TechTag = memo(({
  tech,
  isLight,
}: {
  tech: string;
  isLight: boolean;
}) => (
  <span
    className={`px-2.5 py-1 text-xs sm:text-sm rounded-full whitespace-nowrap ${isLight
      ? "bg-cyan-50 border border-cyan-200 text-gray-800"
      : "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-neutral-200"
      }`}
  >
    {tech}
  </span>
));
TechTag.displayName = 'TechTag'

const ExperienceCard = memo(({
  exp,
  index,
  isLight
}: {
  exp: ExperienceItem
  index: number
  isLight: boolean
}) => {
  const isEven = index % 2 === 0
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`exp-card relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8 pl-12 sm:pl-14 lg:pl-0 ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"
        } transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      data-index={index}
    >
      {/* Timeline Dot - With React Icon */}
      <div
        className={`absolute left-0 top-0 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full backdrop-blur-sm border-2 shadow-lg z-10 ${isLight
          ? "bg-gray-100 border-gray-300 shadow-cyan-300/30"
          : "bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-cyan-500/20"
          }`}
      >
        <div
          className={`text-base sm:text-lg lg:text-xl ${isLight ? "text-gray-900" : "text-white"
            }`}
        >
          {exp.icon}
        </div>
      </div>

      {/* Card - Fixed width to prevent overflow */}
      <div
        className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-7 backdrop-blur-md w-full lg:w-[calc(50%-2rem)] transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${isLight
          ? "bg-white border border-gray-200 shadow-lg hover:shadow-cyan-300/30"
          : "bg-white/10 border border-white/20 hover:shadow-cyan-500/20"
          }`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm text-cyan-400 font-semibold">{exp.year}</span>
          <h3 className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold ${isLight ? "text-gray-900" : "text-white"} leading-tight`}>{exp.role}</h3>
          <h4 className={`text-sm sm:text-base lg:text-lg ${isLight ? "text-violet-600" : "text-purple-400"}`}>{exp.company}</h4>
        </div>

        <p
          className={`mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base leading-relaxed ${isLight ? "text-gray-600" : "text-neutral-300"
            }`}
        >
          {exp.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {exp.tech.map((t) => (
            <TechTag
              key={t}
              tech={t}
              isLight={isLight}
            />
          ))}
        </div>
      </div>
    </div>
  )
})
ExperienceCard.displayName = 'ExperienceCard'

export default function Experience() {
  const [headerVisible, setHeaderVisible] = useState(false)

  const isLight =
    document.documentElement.classList.contains("light");

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

  useEffect(() => {
    setHeaderVisible(true)
  }, [])

  return (
    <section
      id="experience"
      className={`relative w-full min-h-screen overflow-hidden transition-colors duration-500 ${isLight
        ? "bg-gradient-to-b from-white via-slate-50 to-white text-gray-900"
        : "bg-gradient-to-b from-black via-[#0f0f1a] to-black text-white"
        }`}
    >
      {/* Background Glow - Responsive sizing */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[5%] sm:top-[10%] left-[2%] sm:left-[5%] w-[60vw] sm:w-[40vw] lg:w-[30vw] h-[60vw] sm:h-[40vw] lg:h-[30vw] rounded-full"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(6,182,212,.16) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(6,182,212,.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[5%] sm:bottom-[10%] right-[2%] sm:right-[5%] w-[60vw] sm:w-[40vw] lg:w-[30vw] h-[60vw] sm:h-[40vw] lg:h-[30vw] rounded-full"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(168,85,247,.16) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168,85,247,.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Content Container with proper padding */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 lg:py-24">
        {/* Section Heading - Fully responsive */}
        <div
          className={`text-center mb-8 sm:mb-12 lg:mb-20 transition-all duration-1000 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
            }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <p className={`mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg ${isLight ? "text-gray-600" : "text-neutral-400"
            }`}>
            A journey through my career — building, breaking, and learning with passion.
          </p>
        </div>

        {/* Timeline - Responsive container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line - Responsive positioning */}
          <div
            className={`timeline-line absolute top-0 left-4 lg:left-1/2 lg:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-500 ${isLight ? "opacity-70" : "opacity-100"}`}
            style={{ zIndex: 1 }}
          />

          {/* Cards Container - Responsive gaps */}
          <div className="flex flex-col gap-10 sm:gap-12 lg:gap-20 xl:gap-24 w-full relative z-[2]">
            {experiences.map((exp, i) => (
              <ExperienceCard
                key={`${exp.company}-${i}`}
                exp={exp}
                index={i}
                isLight={isLight}
              />
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12 lg:h-16" />
      </div>
    </section>
  )
}
