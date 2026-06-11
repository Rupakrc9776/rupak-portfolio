import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

function MagneticIcon({ 
  children, 
  href, 
  label 
}: { 
  children: React.ReactNode
  href: string
  label: string 
}) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    setStyle({
      transform: `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`,
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
    <a
      ref={ref}
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
      style={style}
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="relative px-6 md:px-12 py-20 overflow-hidden border-t border-white/5">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% 0%, rgba(34,211,238,0.08), transparent 70%)'
        }}
      />
      
      {/* Additional glow orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Main content - centered and minimal */}
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Extra Large Brand name with animated gradient */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 animate-gradient">
              Rupak Chatterjee
            </span>
          </motion.div>

          {/* Social links with enhanced magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-5"
          >
            <MagneticIcon href="https://github.com/Rupakrc9776" label="GitHub">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-200" fill="currentColor">
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.9 3 1.3 3.8 1 .1-.8.5-1.3.8-1.6-2.7-.3-5.6-1.4-5.6-6.1 0-1.3.5-2.5 1.3-3.4-.1-.3-.6-1.6.1-3.4 0 0 1-.3 3.5 1.3a12.1 12.1 0 0 1 6.4 0C18 6.1 19 6.4 19 6.4c.7 1.8.2 3.1.1 3.4.8.9 1.3 2.1 1.3 3.4 0 4.7-2.9 5.7-5.6 6.1.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>
              </svg>
            </MagneticIcon>

            <MagneticIcon href="https://www.linkedin.com/in/rupak-chatterjee-293bba2a6/" label="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-200" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.8-2.2 4 0 4.8 2.6 4.8 5.9V24h-4v-6.7c0-1.6 0-3.8-2.3-3.8s-2.7 1.7-2.7 3.7V24h-4V8z"/>
              </svg>
            </MagneticIcon>

            <MagneticIcon href="https://x.com/RupakRC97" label="Twitter">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-200" fill="currentColor">
                <path d="M22 5.8c-.6.3-1.2.5-1.9.6.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.7-2 .8A3.3 3.3 0 0 0 12 7.6c0 .3 0 .6.1.9A9.4 9.4 0 0 1 3 5.3a3.3 3.3 0 0 0 1 4.4c-.5 0-1-.2-1.4-.4v.1c0 1.6 1.1 3 2.6 3.4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.4 1.9 2.4 3.5 2.4A6.7 6.7 0 0 1 2 17.6 9.4 9.4 0 0 0 7.1 19c6.3 0 9.8-5.2 9.8-9.8v-.4c.6-.4 1.2-1 1.6-1.6z"/>
              </svg>
            </MagneticIcon>

            <MagneticIcon href="mailto:helprupakrc@gmail.com" label="Email">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </MagneticIcon>
          </motion.div>

          {/* Elegant divider with glow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-md h-px"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm" />
          </motion.div>

          {/* Copyright - clean and simple */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-500 text-sm tracking-wide"
          >
            © {new Date().getFullYear()} Rupak Chatterjee. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </footer>
  )
}
