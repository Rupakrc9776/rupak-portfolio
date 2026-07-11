import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type LinkItem = { id: string; label: string }

const LINKS: LinkItem[] = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' }
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0 && visible[0].target.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0.15, 0.3, 0.6] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])

  return active
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    setStyle({
      transform: `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.02)`,
      transition: 'transform 100ms cubic-bezier(.2,.9,.2,1)'
    })
  }

  const onLeave = () => {
    setStyle({
      transform: 'translate(0,0) scale(1)',
      transition: 'transform 250ms cubic-bezier(.2,.9,.2,1)'
    })
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>
      {children}
    </div>
  )
}

export default function Navbar() {
  const active = useActiveSection(LINKS.map((l) => l.id))
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"

    setTheme(nextTheme)

    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(nextTheme)

    localStorage.setItem("theme", nextTheme)
  }

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "dark" | "light") || "dark"

    setTheme(savedTheme)

    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(savedTheme)
  }, [])

  const brand = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <div className="text-lg md:text-xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Rupak Chatterjee
          </span>
        </div>
      </div>
    ),
    []
  )

  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`mx-4 mt-4 rounded-2xl border transition-all duration-300 ${scrolled
            ? 'border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/55 backdrop-blur-2xl shadow-lg'
            : 'border-gray-200 dark:border-white/5 bg-white/70 dark:bg-black/25 backdrop-blur-sm'
            }`}
        >
          <nav className="flex items-center justify-between px-5 md:px-7 h-16 md:h-[72px]">
            {/* Left: Brand with gradient */}
            <a href="#top" className="select-none relative z-10">
              {brand}
            </a>

            {/* Center: Links (desktop) - Enhanced styling */}
            <div className="hidden md:flex items-center gap-1">
              {LINKS.map((l) => {
                const isActive = active === l.id
                return (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    className={`relative px-4 py-2.5 text-[15px] font-medium rounded-xl transition-all duration-200 ${isActive
                      ? 'text-black dark:text-white'
                      : 'text-gray-800 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-300'
                      }`}
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-xl border border-white/10"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.08))',
                          boxShadow: '0 0 20px rgba(34,211,238,0.1)'
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                )
              })}
            </div>

            {/* Right: Enhanced CTA button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="h-11 w-11 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <Magnetic>
                <a
                  href="#contact"
                  className="relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[15px] font-semibold overflow-hidden group"
                  style={{
                    background:
                      theme === "light"
                        ? "linear-gradient(135deg,#06b6d4,#3b82f6)"
                        : "linear-gradient(135deg,rgba(34,211,238,.15),rgba(168,85,247,.15))",

                    border:
                      theme === "light"
                        ? "1px solid rgba(59,130,246,.25)"
                        : "1px solid rgba(255,255,255,.1)"
                  }}
                >
                  {/* Animated gradient background on hover */}
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`relative z-10 ${theme === "light" ? "text-white" : "text-cyan-300"
                      }`}
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`relative z-10 ${theme === "light"
                      ? "text-white"
                      : "text-white"
                      }`}
                  >Let's Talk</span>
                </a>
              </Magnetic>
            </div>

            {/* Mobile toggle - Enhanced */}
            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">

              <button
                onClick={toggleTheme}
                className="h-11 w-11 grid place-items-center rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                className="h-11 w-11 grid place-items-center rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={theme === "light" ? "text-gray-800" : "text-white"}
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer - Enhanced */}
      <motion.aside
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, pointerEvents: 'auto' },
          closed: { opacity: 0, pointerEvents: 'none' }
        }}
        className="fixed inset-0 z-40 md:hidden"
      >
        {/* Backdrop with blur */}
        <motion.div
          variants={{
            open: { opacity: 1 },
            closed: { opacity: 0 }
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel */}
        <motion.div
          variants={{
            open: { x: 0 },
            closed: { x: '100%' }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm backdrop-blur-2xl p-6 ${theme === "light"
            ? "bg-white/95 border-l border-gray-200"
            : "bg-black/90 border-l border-white/10"
            }`}
        >
          {/* Header */}
          <div className="relative z-50 flex items-center justify-between pb-6 border-b border-white/10">
            {brand}

            <div className="flex items-center gap-2">

              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className={`relative z-50 h-11 w-11 grid place-items-center rounded-xl transition-colors ${theme === "light"
                    ? "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={theme === "light"
                    ? "text-gray-800"
                    : "text-white"}
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>


          {/* Navigation links */}
          <div className="mt-8 flex flex-col gap-2">
            {LINKS.map((l, index) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 py-3.5 rounded-xl text-base font-medium transition-all ${theme === "light"
                  ? "text-gray-700 hover:text-cyan-600 hover:bg-gray-100"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
              >
                {l.label}
              </motion.a>
            ))}
          </div>

          {/* CTA button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold ${theme === "light"
                ? "text-white"
                : "text-white"
                }`}
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(168,85,247,0.2))',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              Let's Talk
            </a>
          </div>
        </motion.div>
      </motion.aside>
    </div >
  )
}
