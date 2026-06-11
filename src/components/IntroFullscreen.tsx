
import  { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from 'framer-motion'

type IntroFullscreenProps = {
  onComplete: () => void
  minDurationMs?: number
  playEvenIfSeen?: boolean
}

export default function IntroFullscreen({
  onComplete,
  minDurationMs = 8500, 
  playEvenIfSeen = false,
}: IntroFullscreenProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const vignetteRef = useRef<HTMLDivElement | null>(null)
  const scanlinesRef = useRef<HTMLDivElement | null>(null)
  const rainWrapRef = useRef<HTMLDivElement | null>(null)
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const caretRef = useRef<HTMLSpanElement | null>(null)
  const syntaxRef = useRef<HTMLDivElement | null>(null)
  const sweepRef = useRef<HTMLDivElement | null>(null)
  const prefersReduced = useReducedMotion()

  useLayoutEffect(() => {
    if (!playEvenIfSeen && localStorage.getItem('intro_seen') === '1') {
      onComplete()
      return
    }
    const root = rootRef.current
    if (!root) return

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        try { localStorage.setItem('intro_seen', '1') } catch {
          // Ignore errors (e.g., private browsing/localStorage unavailable)
        }
        onComplete()
      },
    })

    if (prefersReduced) {
      tl.set(root, { opacity: 1 })
        .to(root, { opacity: 0, duration: 0.25 })
        .to(root, { yPercent: -100, duration: 0.35 }, '<')
      return () => { tl.kill() }
    }

    const vignette = vignetteRef.current
    const scan = scanlinesRef.current
    const rain = rainWrapRef.current
    const term = terminalRef.current
    const caret = caretRef.current
    const syntax = syntaxRef.current
    const sweep = sweepRef.current

    // Build ASCII rain (columns with consistent cadence)
    if (rain) {
      const cols = 20
      const linesMin = 28, linesMax = 40
      const charset = '{}[]()<>=+-*/&|^~#;:.,_'.split('')
      const frag = document.createDocumentFragment()
      for (let i = 0; i < cols; i++) {
        const col = document.createElement('div')
        col.className = 'rain-col'
        col.style.cssText = 'position:absolute;top:-120%;left:0;white-space:pre;opacity:0.9;'
        const span = document.createElement('span')
        span.style.cssText = 'display:inline-block;line-height:1.15;letter-spacing:0.02em;'
        const len = linesMin + Math.floor(Math.random() * (linesMax - linesMin + 1))
        let s = ''
        for (let k = 0; k < len; k++) {
          const pick = Math.random()
          if (pick < 0.18) s += charset[(Math.random() * charset.length) | 0]
          else s += '01'[(Math.random() * 2) | 0]
          s += '\n'
        }
        span.textContent = s
        col.appendChild(span)
        col.style.left = `calc(${(i / cols) * 100}% - 0.5ch)`
        frag.appendChild(col)
      }
      rain.innerHTML = ''
      rain.appendChild(frag)
    }

    // Base states
    tl.set(root, { opacity: 1 })
    if (vignette) tl.set(vignette, { opacity: 0 })
    if (scan) tl.set(scan, { opacity: 0 })
    if (rain) tl.set(rain.querySelectorAll('.rain-col'), { yPercent: -120, opacity: 0.0 })
    if (term) tl.set(term, { opacity: 0, y: 6 })
    if (caret) tl.set(caret, { opacity: 0 })
    if (syntax) tl.set(syntax, { opacity: 0, y: 6 })
    if (sweep) tl.set(sweep, { xPercent: -115 })

    // 1) Warm-up: vignette and scanlines fade in subtly
    tl.to(vignette, { opacity: 1, duration: 0.6 }, 0.05)
      .to(scan, { opacity: 0.28, duration: 0.6 }, 0.15)

    // 2) Code rain: smooth, even stagger for elegance
    if (rain) {
      const cols = rain.querySelectorAll<HTMLElement>('.rain-col')
      tl.to(cols, {
        yPercent: 220,
        opacity: 0.85,
        duration: 2.2,
        ease: 'none',
        stagger: { each: 0.08, from: 'start' },
      }, 0.3)
      tl.to(cols, { opacity: 0.22, duration: 0.6, ease: 'sine.out' }, 1.8)
    }

    // Helper to type lines in terminal with steady pacing
    const type = (selector: string, text: string, startAt = 0, char = 0.028) => {
      if (!term) return
      const line = term.querySelector<HTMLElement>(selector)
      if (!line) return
      tl.set(line, { textContent: '' }, startAt)
      text.split('').forEach((_, i) => {
        tl.to(line, {
          duration: char,
          onUpdate: () => { line.textContent = text.slice(0, i + 1) },
          ease: 'none',
        }, startAt + i * char)
      })
    }

    // 3) Minimal terminal sequence, more lines, clean rhythm
    tl.to(term, { opacity: 1, y: 0, duration: 0.45 }, 0.95)
    if (caret) {
      tl.to(caret, { opacity: 1, duration: 0.1 }, 1.0)
      gsap.to(caret, { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: 'none' })
    }

    type('.l1', 'git init && git add .', 1.05)
    type('.l2', 'git commit -m "chore: bootstrap"', 1.85)
    type('.l3', 'pnpm i && pnpm dev', 2.75)
    type('.l4', '⏳ compiling...', 3.45, 0.022)
    type('.l5', '✓ types ok · ✓ lint ok · ✓ built in 1.23s', 4.15, 0.024)
    type('.l6', 'localhost:5173 — ready', 4.95)

    // 4) Syntax highlight sweep (single elegant pass)
    tl.to(syntax, { opacity: 1, y: 0, duration: 0.4 }, 5.4)
      .to(sweep, { xPercent: 120, duration: 1.0, ease: 'power2.inOut' }, 5.55)

    // 5) Pull-up reveal: concise and crisp
    tl.to(root, { yPercent: -100, duration: 1.0, ease: 'power4.inOut' }, 6.9)

    // Ensure minimum duration overall
    const total = Math.max(minDurationMs / 1000, tl.duration())
    tl.duration(total)

    return () => { tl.kill() }
  }, [onComplete, playEvenIfSeen, prefersReduced, minDurationMs])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z- bg-black text-white overflow-hidden"
      aria-label="Intro"
      role="dialog"
      aria-modal="true"
    >
      {/* Vignette + scanlines */}
      <div ref={vignetteRef} className="absolute inset-0 pointer-events-none" aria-hidden="true"
           style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0) 62%, rgba(0,0,0,0.72) 100%)' }} />
      <div ref={scanlinesRef} className="absolute inset-0 pointer-events-none mix-blend-screen" aria-hidden="true"
           style={{ background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 3px)' }} />

      {/* Code rain */}
      <div ref={rainWrapRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Terminal */}
      <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <div
          ref={terminalRef}
          className="w-[min(720px,90vw)] bg-black/40 border border-white/10 rounded-lg p-5 font-mono text-[13px] leading-6 shadow-[0_0_60px_rgba(76,230,255,0.12)]"
        >
          <div className="text-cyan-300/90">~/workspace</div>
          <div><span className="text-green-400">$</span> <span className="l1"></span><span ref={caretRef} className="opacity-0">▍</span></div>
          <div><span className="text-green-400">$</span> <span className="l2"></span></div>
          <div><span className="text-green-400">$</span> <span className="l3"></span></div>
          <div className="l4 text-gray-300/90"></div>
          <div className="l5 text-gray-200/90"></div>
          <div className="l6 text-cyan-300/90"></div>
        </div>
      </div>

      {/* Syntax line */}
      <div ref={syntaxRef} className="absolute bottom-[16%] left-1/2 -translate-x-1/2 text-[clamp(14px,2.2vw,18px)] font-mono">
        <code className="text-gray-200/90">
          <span style={{ color: 'rgb(76,230,255)' }}>const</span> app <span style={{ color: 'rgb(255,255,255,0.8)' }}>=</span> <span style={{ color: 'rgb(76,230,255)' }}>init</span><span style={{ opacity: 0.9 }}>(</span><span style={{ color: 'rgb(255,255,255,0.85)' }}>skills</span><span style={{ opacity: 0.9 }}>)</span><span style={{ opacity: 0.9 }}>=&gt;</span><span style={{ opacity: 0.9 }}>{'{'}</span> <span style={{ color: 'rgb(76,230,255)' }}>return</span> skills.map<span style={{ opacity: 0.9 }}>(</span>s<span style={{ opacity: 0.9 }}>)</span> <span style={{ color: 'rgb(76,230,255)' }}>&&</span> deploy<span style={{ opacity: 0.9 }}>(</span>s<span style={{ opacity: 0.9 }}>)</span> <span style={{ opacity: 0.9 }}>{'}'}</span>
        </code>
        <div
          ref={sweepRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-48 h-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }}
        />
      </div>
    </div>
  )
}
