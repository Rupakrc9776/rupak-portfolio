import React, { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'


type Options = {
  followEase?: number            
  dotSize?: number               
  dotSizeHover?: number        
  glowSize?: number            
  glowSizeHover?: number        
  enableSparks?: boolean         
  sparkCount?: number
}

export default function CursorGlow({
  followEase = 0.18,
  dotSize = 10,
  dotSizeHover = 16,
  glowSize = 120,
  glowSizeHover = 180,
  enableSparks = true,
  sparkCount = 6
}: Options) {
  const prefersReduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const sparksRef = useRef<HTMLDivElement[]>([])
  const enabledRef = useRef(true)

 
  useEffect(() => {
    const onTouch = () => { enabledRef.current = false; hide() }
    const onMouse = () => { enabledRef.current = true; show() }
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])


  useEffect(() => {
    if (prefersReduced) hide()
    else show()
   
  }, [prefersReduced])

 
  useEffect(() => {
    const dot = dotRef.current
    const glow = glowRef.current
    if (!dot || !glow) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let vx = x
    let vy = y
    let lastX = x
    let lastY = y
    let lastT = performance.now()

    const onMove = (e: MouseEvent) => {
      if (!enabledRef.current) return
      x = Math.max(0, Math.min(window.innerWidth, e.clientX))
      y = Math.max(0, Math.min(window.innerHeight, e.clientY))
    }

    const loop = () => {
      const now = performance.now()
      const dt = Math.max(1, now - lastT)
      lastT = now

      // velocity magnitude (px/ms)
      const vxInst = Math.abs(x - lastX) / dt
      const vyInst = Math.abs(y - lastY) / dt
      const vel = Math.min(1, Math.sqrt(vxInst * vxInst + vyInst * vyInst) * 20)

      lastX = x
      lastY = y

      // ease toward target
      vx += (x - vx) * followEase
      vy += (y - vy) * followEase

      // transform
      dot.style.transform = `translate3d(${vx}px, ${vy}px, 0)`
      glow.style.transform = `translate3d(${vx}px, ${vy}px, 0)`

      // dynamic glow intensity with velocity
      glow.style.opacity = String(0.75 + vel * 0.25)

      // sparks
      if (enableSparks && sparksRef.current.length) {
        // trail positions with slight spread
        sparksRef.current.forEach((s, i) => {
          const t = (i + 1) / sparksRef.current.length
          const sx = vx - (x - vx) * t * 4
          const sy = vy - (y - vy) * t * 4
          const o = Math.max(0, 0.35 - t * 0.35) + vel * 0.2
          s.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${1 - t * 0.6})`
          s.style.opacity = String(o)
        })
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(loop)

    // interactive grow/shrink
    const onEnter = () => {
      if (!enabledRef.current) return
      dot.style.width = `${dotSizeHover}px`
      dot.style.height = `${dotSizeHover}px`
      glow.style.width = `${glowSizeHover}px`
      glow.style.height = `${glowSizeHover}px`
      glow.style.opacity = '0.98'
    }
    const onLeave = () => {
      dot.style.width = `${dotSize}px`
      dot.style.height = `${dotSize}px`
      glow.style.width = `${glowSize}px`
      glow.style.height = `${glowSize}px`
      glow.style.opacity = '0.9'
    }

    const interactive = () => document.querySelectorAll('a, button, .cta-hover')
    const bind = () => interactive().forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    const unbind = () => interactive().forEach((el) => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    })

    bind()

    // cleanup
    return () => {
      document.removeEventListener('mousemove', onMove)
      unbind()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [dotSize, dotSizeHover, glowSize, glowSizeHover, followEase, enableSparks])

  // helpers to show/hide all elements
  function hide() {
    const dot = dotRef.current
    const glow = glowRef.current
    if (dot) dot.style.display = 'none'
    if (glow) glow.style.display = 'none'
    sparksRef.current.forEach((s) => (s.style.display = 'none'))
  }
  function show() {
    const dot = dotRef.current
    const glow = glowRef.current
    if (dot) dot.style.display = 'block'
    if (glow) glow.style.display = 'block'
    sparksRef.current.forEach((s) => (s.style.display = 'block'))
  }

  // create spark elements once
  const sparkEls = useMemo(() => {
    if (!enableSparks || prefersReduced) return null
    const arr: React.JSX.Element[] = []
    sparksRef.current = []
    for (let i = 0; i < sparkCount; i++) {
      const setRef = (el: HTMLDivElement | null) => {
        if (!el) return
        sparksRef.current[i] = el
      }
      arr.push(
        <div
          key={i}
          ref={setRef}
          className="pointer-events-none fixed top-0 left-0 z-[9998]"
          style={{
            width: 6,
            height: 6,
            borderRadius: 9999,
            background:
              'linear-gradient(180deg, rgba(var(--accent-1),1), rgba(var(--accent-2),1))',
            boxShadow: '0 0 20px rgba(76,230,255,0.3), 0 0 24px rgba(95,84,255,0.25)',
            opacity: 0
          }}
        />
      )
    }
    return arr
  }, [enableSparks, sparkCount, prefersReduced])

  // render
  return (
    <>
      {sparkEls}
      <div
        ref={glowRef}
        className="cursor-glow"
        style={{
          width: glowSize,
          height: glowSize,
          background:
            'radial-gradient(circle at 30% 30%, rgba(var(--accent-1),0.18), rgba(var(--accent-2),0.12) 40%, transparent 60%)',
          opacity: 0.9,
          pointerEvents: 'none'
        }}
      />
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          width: dotSize,
          height: dotSize,
          background: 'linear-gradient(180deg, rgba(var(--accent-1),1), rgba(var(--accent-2),1))',
          boxShadow: '0 0 18px rgba(76,230,255,0.35), 0 0 22px rgba(95,84,255,0.25)'
        }}
      />
    </>
  )
}
