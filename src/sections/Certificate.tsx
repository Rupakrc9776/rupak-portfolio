"use client";
import cert from "../assets/cert.jpg";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Data */
const certificates = [
  {
    id: 1,
    title: "MicrosoftAzure Fundamentals",
    issuer: "Microsoft Azure",
    date: "June 2026",
    color: "#0000ff",
    link: "https://drive.google.com/file/d/1d-74udf_Bsqp5nMgxpLUYNqfTdlztS3J/view?usp=sharing",
    image: cert,
  },
  {
    id: 2,
    title: "TCS iON Career Edge - Young Professional",
    issuer: "TCS iON",
    date: "Apr 2026",
    color: "#61c0fb",
    link: "https://drive.google.com/file/d/1yDKfNGcTza_QTFVbRVCJ44clYyTU4BcC/view?usp=drive_link",
    image: cert,
  },
  {
    id: 3,
    title: "Certificate for the Completion of Python 3.4.3 Training",
    issuer: "Spoken tutorial Project IIT Bombay",
    date: "May 2025",
    color: "#f47a42",
    link: "https://drive.google.com/file/d/1Z1uUWWINToKSHo8BhrdITnd-K1iSxoGP/view?usp=drive_link",
    image: cert,
  },
  {
    id: 4,
    title: "3D Printing & Additive Manufacturing Technology",
    issuer: "Ministry Of Electronics & IT, Govt. of India",
    date: "Mar 2026",
    color: "#4da3ff",
    link: "https://drive.google.com/file/d/1sHaDgC-kptqzWxZlQQo-rQGaymDyBZNl/view?usp=drive_link",
    image: cert,
  },
  {
    id: 5,
    title: "Gen AI Course: Build Innovative Apps & Websites",
    issuer: "Intershala Training",
    date: "Feb 2026",
    color: "#1ea0f7",
    link: "https://drive.google.com/file/d/1iaqRGFh9K7q6wS8mLNVWNxYcKj086cdK/view?usp=drive_link",
    image: cert,
  },
  {
    id: 6,
    title: "Achieving Ultimate Milestone",
    issuer: "Google Cloud Arcade",
    date: "May 2025",
    color: "#d4d71b",
    link: "https://drive.google.com/file/d/1K5Q_ax7uZ825LHP_nVi8_dWu8_-y6YCz/view?usp=drive_link",
    image: cert,
  },
  {
    id: 7,
    title: "Programming Fundamentals using Python",
    issuer: "Infosys Springboard",
    date: "Mar 2026",
    color: "#3776AB",
    link: "https://drive.google.com/file/d/1wEX5L8bTkI4nWrUhZLbR3AJJc975Y3JF/view?usp=drive_link",
    image: cert,
  },
  {
    id: 8,
    title: "Certificate for the Completion of Java Training",
    issuer: "Spoken tutorial Project IIT Bombay",
    date: "Jun 2026",
    color: "#d66700",
    link: "https://drive.google.com/file/d/1DY4kNrR0z0Lw49EDWCqm6552n-S1JPVO/view?usp=drive_link",
    image: cert,
  },
];

type Certificate = typeof certificates[number];

/* shared motion config */
const spring = { type: "spring" as const, stiffness: 200, damping: 30 };
const cardSpring = { type: "spring" as const, stiffness: 150, damping: 16 };

export default function CertificatesPremium() {
  const [cardsPerSlide, setCardsPerSlide] = useState<number>(4);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const setByWidth = () => {
      const w = window.innerWidth;
      if (w < 640) setCardsPerSlide(1);
      else if (w < 1024) setCardsPerSlide(2);
      else setCardsPerSlide(4);
    };
    setByWidth();
    window.addEventListener("resize", setByWidth);
    return () => window.removeEventListener("resize", setByWidth);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(certificates.length / cardsPerSlide));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrentSlide((s) => (s - 1 < 0 ? totalSlides - 1 : s - 1));
      if (e.key === "ArrowRight") setCurrentSlide((s) => (s + 1 >= totalSlides ? 0 : s + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalSlides]);

  const next = useCallback(() => setCurrentSlide((s) => (s + 1 >= totalSlides ? 0 : s + 1)), [totalSlides]);
  const prev = useCallback(() => setCurrentSlide((s) => (s - 1 < 0 ? totalSlides - 1 : s - 1)), [totalSlides]);

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0d0e1a] via-[#161728] to-[#0d0e1a] py-8 sm:py-5 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute left-8 top-16 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/6 rounded-full blur-3xl" />
        <div className="absolute right-8 bottom-16 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 sm:mb-16">
          <span className="inline-block text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Credentials & Achievements
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mt-3 sm:mt-4">
            Premium{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              Certificates
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3">
            Each certificate presented in an elegant envelope design — hover to reveal the certificate.
          </p>
        </header>

        {/* slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div className="flex flex-nowrap" animate={{ x: `-${currentSlide * 100}%` }} transition={spring}>
              {Array.from({ length: totalSlides }).map((_, slideIdx) => {
                const start = slideIdx * cardsPerSlide;
                return (
                  <div key={slideIdx} className="min-w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-2">
                      {certificates.slice(start, start + cardsPerSlide).map((c, i) => (
                        <EnvelopeCard key={c.id} certificate={c} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* arrows */}
          <button
            aria-label="prev"
            onClick={prev}
            className="absolute left-0 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 transition"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
          <button
            aria-label="next"
            onClick={next}
            className="absolute right-0 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 transition"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-3 mt-10 sm:mt-12">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className="group">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? "w-10 sm:w-12 md:w-16 bg-gradient-to-r from-cyan-400 to-purple-500" : "w-2 bg-white/30 group-hover:w-4"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnvelopeCard({ certificate, index }: { certificate: Certificate; index: number }) {
  const [isHovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const delay = 0.1 * index;

  const openDrive = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.open(certificate.link, "_blank", "noopener,noreferrer");
  };

  // image source with fallback
  const imgSrc = certificate.image ?? cert;

  return (
    <>
      <motion.div className="w-full " initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ ...cardSpring, delay }}>
        <div
          className="relative w-full h-[420px] sm:h-[460px] lg:h-[480px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ perspective: "1400px" }}
        >
          {/* bottom envelope base */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-lg overflow-hidden"
            style={{
              height: "60%",
              background: `linear-gradient(135deg, ${certificate.color}40, #1a1a2e90)`,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            animate={isHovered ? { scale: 1.02, rotateX: 2 } : { scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: isHovered ? `linear-gradient(135deg, ${certificate.color}60, #2a2a4e)` : `linear-gradient(135deg, ${certificate.color}40, #1a1a2e)`,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Particle effects */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: certificate.color,
                    left: `${i * 12.5}%`,
                    bottom: "10%",
                    opacity: 0.3,
                  }}
                  animate={
                    isHovered
                      ? { y: [-20, -80], opacity: [0.3, 0, 0.3], scale: [1, 1.5, 1] }
                      : { y: 0, opacity: 0.3 }
                  }
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </div>

            {/* Glow effects */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{ border: `2px solid ${certificate.color}`, opacity: 0 }}
              animate={isHovered ? { opacity: [0, 0.6, 0], scale: [1, 1.05, 1] } : { opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0"
              style={{ background: `linear-gradient(90deg, transparent, ${certificate.color}40, transparent)` }}
              animate={isHovered ? { x: ["-100%", "100%"] } : { x: "-100%" }}
              transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
              style={{ background: `radial-gradient(circle, ${certificate.color}60, transparent 70%)` }}
              animate={isHovered ? { scale: [1, 2, 1], opacity: [0.3, 0, 0.3] } : { scale: 1, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, ${certificate.color} 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />
          </motion.div>

          {/* certificate image */}
          <motion.div
            className="absolute bottom-0 left-[7%] right-[7%] rounded-xl overflow-hidden shadow-2xl"
            style={{ height: "75%", transformStyle: "preserve-3d" }}
            animate={{ y: isHovered ? -60 : 0, rotateZ: isHovered ? -2 : 0, rotateX: isHovered ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <div className="relative w-full h-full">
              <img src={imgSrc} alt={certificate.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.7 }}
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                }}
              />
            </div>
            <motion.div
              className="absolute -inset-6 rounded-xl -z-10 blur-xl"
              animate={{ opacity: isHovered ? 0.7 : 0.15 }}
              transition={{ duration: 0.3 }}
              style={{ background: `radial-gradient(circle, ${certificate.color}70, transparent 70%)` }}
            />
          </motion.div>

          {/* top envelope flap - FIXED WITH RESPONSIVE SVG */}
          <div className="absolute bottom-0 left-[2%] right-[2%]" style={{ height: "50%" }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id={`grad-${certificate.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: certificate.color, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#1a1a2e", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M 0,10 Q 50,-15 100,10 L 100,100 L 0,100 Z" fill={`url(#grad-${certificate.id})`} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            </svg>

            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 lg:p-6 pt-10 sm:pt-12">
              <h3 className="text-white text-sm sm:text-base lg:text-lg font-bold leading-tight text-center px-2">{certificate.title}</h3>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-white/90 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span className="text-xs">{certificate.issuer}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">{certificate.date}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={openDrive}
                  className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-sm flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))`,
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <span>View</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>{modalOpen && <Modal certificate={certificate} onClose={() => setModalOpen(false)} />}</AnimatePresence>
    </>
  );
}

function Modal({ onClose, certificate }: { onClose: () => void; certificate: Certificate }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const imgSrc = certificate.image ?? cert;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
        <div className="relative" style={{ background: `linear-gradient(135deg, ${certificate.color}15, #0f1020)` }}>
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            ✕
          </button>
          <div className="relative">
            <img src={imgSrc} alt={certificate.title} className="w-full h-[70vh] object-contain bg-gradient-to-b from-black/50 to-black/80" />
          </div>
          <div className="p-8 text-center">
            <a
              href={certificate.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${certificate.color}, #a78bfa)` }}
            >
              Open in Google Drive
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ArrowLeft({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function ArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
