
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

import CursorGlow from './CursorGlow'

type SectionTheme = { a: string; b: string; c: string }

const sectionThemes: Record<string, SectionTheme> = {
  hero: { a: 'rgba(76,230,255,0.22)', b: 'rgba(95,84,255,0.22)', c: 'rgba(0,191,143,0.22)' },
  about: { a: 'rgba(255,140,76,0.22)', b: 'rgba(255,95,84,0.22)', c: 'rgba(191,143,0,0.22)' },
  projects: { a: 'rgba(84,255,188,0.22)', b: 'rgba(84,176,255,0.22)', c: 'rgba(255,84,243,0.22)' },
  experience: { a: 'rgba(240,255,84,0.22)', b: 'rgba(255,200,84,0.22)', c: 'rgba(84,122,255,0.22)' },
  skills: { a: 'rgba(255,84,122,0.22)', b: 'rgba(255,84,206,0.22)', c: 'rgba(84,240,255,0.22)' },
  testimonials: { a: 'rgba(255,245,84,0.22)', b: 'rgba(255,152,84,0.22)', c: 'rgba(152,84,255,0.22)' },
  contact: { a: 'rgba(255,84,84,0.22)', b: 'rgba(84,255,122,0.22)', c: 'rgba(84,176,255,0.22)' },
  default: { a: 'rgba(76,230,255,0.22)', b: 'rgba(95,84,255,0.22)', c: 'rgba(0,191,143,0.22)' },
}

export default function GlobalLayers({ showCursorGlow = true }: { showCursorGlow?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReduced = useReducedMotion()
  const [theme, setTheme] = useState<SectionTheme>(sectionThemes.default)

  // Listen for section-enter events to change theme
  useEffect(() => {
    const handleEnter = (e: Event) => {
      const id = (e as CustomEvent).detail?.id || 'default'
      setTheme(sectionThemes[id] || sectionThemes.default)
    }
    document.addEventListener('section-enter', handleEnter)
    return () => document.removeEventListener('section-enter', handleEnter)
  }, [])

  // Dust canvas (guarded for reduced motion and small screens)
  useEffect(() => {
    if (prefersReduced) return
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = Math.min(2, window.devicePixelRatio || 1)
    let w = 0, h = 0
    const N = 90 // lowered from 120
    const P = Array.from({ length: N }, () => ({ x: 0, y: 0, r: 0, vx: 0, vy: 0 }))

    const init = () => {
      w = Math.max(1, canvas.offsetWidth) * DPR
      h = Math.max(1, canvas.offsetHeight) * DPR
      canvas.width = w
      canvas.height = h
      for (let i = 0; i < N; i++) {
        P[i].x = Math.random() * w
        P[i].y = Math.random() * h
        P[i].r = (0.6 + Math.random() * 1.2) * DPR
        const s = 0.03 + Math.random() * 0.08
        P[i].vx = (Math.random() - 0.5) * s * w * 0.00035
        P[i].vy = (Math.random() - 0.5) * s * h * 0.00035
      }
    }

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = 'rgba(255,255,255,0.10)'
      for (let i = 0; i < N; i++) {
        const p = P[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    const onResize = () => init()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [prefersReduced])

  return (
    <>
      {/* Background planes that change color by active section */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div
          data-plane
          className="absolute -left-24 -top-16 w-[60rem] h-[28rem] rounded-[48px] opacity-[0.20]"
          style={{ background: `radial-gradient(closest-side, ${theme.a}, transparent 65%)`, filter: 'blur(24px)' }}
        />
        <div
          data-plane
          className="absolute right-[-18rem] top-[8rem] w-[56rem] h-[28rem] rounded-[48px] opacity-[0.20]"
          style={{ background: `radial-gradient(closest-side, ${theme.b}, transparent 65%)`, filter: 'blur(24px)' }}
        />
        <div
          data-plane
          className="absolute left-[10%] bottom-[8%] w-[36rem] h-[20rem] rounded-[48px] opacity-[0.20]"
          style={{ background: `radial-gradient(closest-side, ${theme.c}, transparent 65%)`, filter: 'blur(22px)' }}
        />

        {/* subtle bottom vignette */}
        <div
          className="absolute left-0 bottom-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 80%)' }}
        />

        {/* dust canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 -z-[4]"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Overlays / cursor */}
      {/* Removed <NoiseOverlay /> */}
      {showCursorGlow && <CursorGlow />}
    </>
  )
}
