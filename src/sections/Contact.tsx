
import React, { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import SplitType from "split-type"
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa"
import emailjs from "@emailjs/browser"

// we are importing these values from .env file so change the values there after signing up on Email js 
const EMAILJS_SERVICE_ID = import.meta.env.VITE_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY

const CONTACT_EMAIL = "helprupakrc@gmail.com"
const PHONE_NUMBER = "+91 9732262005"

type SubmitStatus = "idle" | "sending" | "success" | "error"

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const particlesRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const socialIconsRef = useRef<HTMLDivElement | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>("idle")

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

  // particle bg
  useEffect(() => {
    if (!particlesRef.current || typeof window === "undefined") return

    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.position = "absolute"
      particle.style.borderRadius = "50%"
      particle.style.pointerEvents = "none"
      particle.style.zIndex = "1"
      particle.style.opacity = "0.6"
      particle.style.background =
        "radial-gradient(circle at 30% 30%, #22d3ee, #a855f7)"

      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      const duration = Math.random() * 3 + 2

      particle.style.left = `${x}px`
      particle.style.top = `${y}px`

      particlesRef.current?.appendChild(particle)

      gsap.to(particle, {
        y: "-120vh",
        x: "+=20",
        duration,
        ease: "power2.inOut",
        onComplete: () => {
          particle.remove()
        },
      })
    }

    const interval = window.setInterval(createParticle, 300)
    return () => window.clearInterval(interval)
  }, [])

  // emailjs init
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (EMAILJS_PUBLIC_KEY) {
        emailjs.init(EMAILJS_PUBLIC_KEY)
      } else {
        console.warn("[EmailJS] VITE_PUBLIC_KEY missing.")
      }
    } catch (err) {
      console.warn("[EmailJS] init error:", err)
    }
  }, [])

  // heading animation (white text)
  useEffect(() => {
    if (!headingRef.current) return
    try {
      const split = new SplitType(headingRef.current, {
        types: "chars,words",
      })

      gsap.from(split.chars, {
        opacity: 0,
        y: 40,
        stagger: 0.03,
        duration: 0.7,
        ease: "power4.out",
      })
    } catch (err) {
      console.warn("Heading animation failed:", err)
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // subtle float for socials
  useEffect(() => {
    if (!socialIconsRef.current) return
    const items = Array.from(socialIconsRef.current.children)
    gsap.to(items, {
      y: -6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    })
  }, [])

  const resetStatus = (ms = 4000) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle")
      timeoutRef.current = null
    }, ms)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formRef.current) return

    const form = formRef.current

    const name = (
      form.elements.namedItem("user_name") as HTMLInputElement
    ).value.trim()

    const email = (
      form.elements.namedItem("user_email") as HTMLInputElement
    ).value.trim()

    const message = (
      form.elements.namedItem("message") as HTMLTextAreaElement
    ).value.trim()

    // Required validation
    if (!name || !email || !message) {
      alert("Please fill all fields.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.")
      return
    }

    // EmailJS config validation
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error("EmailJS config missing.")
      setStatus("error")
      resetStatus()
      return
    }

    setIsSubmitting(true)
    setStatus("sending")

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form,
        EMAILJS_PUBLIC_KEY
      )

      setStatus("success")
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus("error")
    } finally {
      setIsSubmitting(false)
      resetStatus()
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      const notification = document.createElement("div")
      notification.textContent = "Email copied! ✨"
      notification.className = "floating-notification"
      document.body.appendChild(notification)

      gsap.fromTo(
        notification,
        { y: 0, opacity: 0 },
        { y: -40, opacity: 1, duration: 0.3, ease: "power2.out" }
      )
      gsap.to(notification, {
        y: -80,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        delay: 0.9,
        onComplete: () => notification.remove(),
      })
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`
    }
  }

  return (
    <section
      id="contact"
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-16 overflow-hidden transition-colors duration-500 ${isLight ? "bg-gradient-to-b from-white via-slate-50 to-white text-gray-900" : "bg-black text-white"}`}
    >
      {/* soft color glows, bg still black */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div
          className={`absolute -top-40 -left-32 h-80 w-80 rounded-full blur-3xl ${isLight ? "bg-cyan-400/25" : "bg-cyan-500/20"
            }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 h-80 w-80 rounded-full blur-3xl ${isLight ? "bg-purple-400/25" : "bg-purple-500/25"
            }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${isLight ? "bg-pink-400/15" : "bg-pink-500/10"
            }`}
        />
      </div>

      {/* particles */}
      <div
        ref={particlesRef}
        className="pointer-events-none absolute inset-0 -z-10"
      />

      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/80">
          Contact
        </p>
        <h2
          ref={headingRef}
          className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight ${isLight ? "text-gray-900" : "text-white"
            }`}
        >
          Let&apos;s Build Something Epic
        </h2>
        <p
          className={`mt-4 max-w-2xl text-sm sm:text-base mx-auto ${isLight ? "text-gray-600" : "text-neutral-400"
            }`}
        >
          Drop a message about your idea, collaboration, or project. Replies
          usually land within 24 hours.
        </p>
      </motion.div>

      {/* content grid */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
        {/* left: cards + socials */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <InfoCard
            icon={<FaEnvelope className="h-4 w-4" />} isLight={isLight}
            label="Email"
            pillColor="from-cyan-500 to-sky-500"
          >
            <button
              type="button"
              onClick={handleCopyEmail}
              className="mt-1 font-mono text-sm text-cyan-400 hover:text-cyan-300 hover:underline break-all"
            >
              {CONTACT_EMAIL}
            </button>
          </InfoCard>

          <InfoCard
            icon={<FaPhone className="h-4 w-4" />}
            isLight={isLight}
            label="Phone"
            pillColor="from-emerald-500 to-lime-500"
          >
            <a
              href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
              className="mt-1 inline-block font-mono text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              {PHONE_NUMBER}
            </a>
          </InfoCard>

          <InfoCard
            icon={<FaMapMarkerAlt className="h-4 w-4" />}
            isLight={isLight}
            label="Location"
            pillColor="from-purple-500 to-pink-500"
          >
            <p
              className={`mt-1 text-sm ${isLight ? "text-gray-700" : "text-neutral-300"
                }`}
            >
              Remote • Available worldwide
            </p>
          </InfoCard>

          <div
            className={`mt-8 pt-6 ${isLight ? "border-t border-gray-200" : "border-t border-white/10"
              }`}
          >
            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-[0.25em] ${isLight ? "text-gray-600" : "text-neutral-400"
                }`}
            >
              Social
            </p>
            <div
              ref={socialIconsRef}
              className="flex flex-wrap gap-4 text-lg text-white"
            >
              <SocialIcon href="https://github.com/Rupakrc9776" isLight={isLight}>
                <FaGithub />
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/in/rupak-chatterjee-293bba2a6/" isLight={isLight}>
                <FaLinkedin />
              </SocialIcon>
              <SocialIcon href="https://x.com/RupakRC97" isLight={isLight}>
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href={`mailto:${CONTACT_EMAIL}`} isLight={isLight}>
                <FaEnvelope />
              </SocialIcon>
            </div>
          </div>
        </motion.div>

        {/* right: brighter, static bordered form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* static gradient border, no rotation */}
          <div className="pointer-events-none absolute -inset-[2px] rounded-[22px] bg-[linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)] opacity-80" />
          {/* inner card – much lighter for readability */}
          <div
            className={`relative rounded-[18px] p-6 sm:p-8 backdrop-blur-2xl ${isLight
              ? "bg-white border border-gray-200 shadow-2xl"
              : "border border-white/20 bg-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.75)]"
              }`}
          >
            <h3
              className={`text-2xl font-semibold ${isLight ? "text-gray-900" : "text-white"
                }`}
            >
              Send a message
            </h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <InputField
                label="Name"
                name="user_name"
                type="text"
                placeholder="Your name"
                isLight={isLight}
              />
              <InputField
                label="Email"
                name="user_email"
                type="email"
                placeholder="you@example.com"
                isLight={isLight}
              />
              <TextareaField
                label="Message"
                name="message"
                placeholder="Tell me about your idea..."
                isLight={isLight}
              />

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                  >
                    Message sent! You&apos;ll hear back soon.
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    Something went wrong. Please try again or email directly.
                  </motion.div>
                )}
                {status === "sending" && (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200"
                  >
                    Sending your message...
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${isSubmitting
                  ? "cursor-not-allowed bg-neutral-300 text-neutral-800"
                  : "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-purple-500/40"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending
                  </>
                ) : (
                  <>
                    Send
                    <span>↗</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* local styles for particles + toast */}
      <style>{`
        .floating-notification {
          position: fixed;
          top: 16px;
          right: 16px;
          padding: 10px 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #22d3ee, #a855f7);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 9999;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .particle {
          box-shadow: 0 0 8px rgba(34,211,238,0.8);
        }
        @media (max-width: 640px) {
          .floating-notification {
            left: 12px;
            right: 12px;
            text-align: center;
          }
        }
      `}</style>
    </section>
  )
}

/* sub components */

function InfoCard(props: {
  icon: React.ReactNode
  label: string
  pillColor: string
  children: React.ReactNode
  isLight: boolean
}) {
  const { icon, label, pillColor, children, isLight } = props
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl p-4 backdrop-blur-xl ${isLight
        ? "bg-white border border-gray-200"
        : "bg-white/5 border border-white/10"
        }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${pillColor} text-white shadow-lg shadow-black/40`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`text-xs uppercase tracking-[0.25em] ${isLight
              ? "text-gray-600"
              : "text-neutral-400"
              }`}
          >
            {label}
          </p>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function SocialIcon({
  href,
  children,
  isLight,
}: {
  href: string
  children: React.ReactNode
  isLight: boolean
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm transition-all ${isLight
        ? "bg-white border border-gray-300 text-gray-800 hover:border-cyan-500 hover:text-cyan-600"
        : "bg-white/5 border border-white/10 text-white hover:border-cyan-400/60 hover:text-cyan-300"
        }`}
    >
      {children}
    </motion.a>
  )
}

function InputField(props: {
  label: string
  name: string
  type: string
  placeholder: string
  isLight?: boolean
}) {
  const { label, name, type, placeholder, isLight = false } = props
  const localIsLight = isLight
  const id = `field-${name}`

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={`text-xs font-medium uppercase tracking-[0.2em] ${localIsLight ? "text-gray-600" : "text-neutral-300"}`}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className={`w-full rounded-xl px-3 py-3 text-sm outline-none transition ${localIsLight
          ? "border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          : "border border-white/20 bg-white/20 text-white placeholder-neutral-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          }`}
      />
    </div>
  )
}

function TextareaField(props: {
  label: string
  name: string
  placeholder: string
  isLight?: boolean
}) {
  const { label, name, placeholder, isLight = false } = props
  const localIsLight = isLight
  const id = `field-${name}`

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={`text-xs font-medium uppercase tracking-[0.2em] ${localIsLight ? "text-gray-600" : "text-neutral-300"}`}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        required
        placeholder={placeholder}
        rows={5}
        className={`w-full resize-none rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 ${localIsLight ? "border-gray-200 bg-white text-gray-900 placeholder-gray-500" : "border-white/20 bg-white/20 text-white placeholder-neutral-300"}`}
      />
    </div>
  )
}
