import myPhoto from "../assets/myphoto.png";
import gfglogo from "../assets/gfglogo.svg";
"use client";

import { useMemo, useState, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

import type { Variants } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiTailwindcss,
  SiGit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

/* -------------------------
   Utilities / Motion
   ------------------------- */
const hexA = (hex: string, a: number): string => {
  const v = hex.replace("#", "");
  const b = parseInt(v.length === 3 ? v.split("").map((c) => c + c).join("") : v, 16);
  return `rgba(${(b >> 16) & 255}, ${(b >> 8) & 255}, ${b & 255}, ${a})`;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38 } },
};

const fadeUpDelayed = (d = 0.05): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, delay: d } },
});

const listContainer: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const barGrow = (w: string, d = 0): Variants => ({
  hidden: { width: 0 },
  show: { width: w, transition: { duration: 0.85, ease: "easeOut", delay: d } },
});

/* Reusable classes */
const cardBase =
  "rounded-2xl border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-xl max-w-full overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.06)]";
const tinyMuted =
  "text-xs text-gray-600 dark:text-neutral-300";
const sectionP = "px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12";

/* -------------------------
   Main Export
   ------------------------- */
export default function AboutHeroFull() {
  const accents = useMemo(() => ["#22d3ee", "#a78bfa", "#34d399"], []);
  const [activeTab, setActiveTab] = useState<"education" | "achievements">("education");

  return (
    <section
      className="relative w-full max-w-full overflow-x-hidden text-gray-900 dark:text-white"
      style={{ minHeight: "100svh" }}
      aria-labelledby="about-title"
    >
      <BackgroundBeams accents={accents} />

      <div className={`relative z-10 mx-auto w-full max-w-full lg:max-w-[1320px] ${sectionP}`}>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)]">
          {/* LEFT */}
          <div className="space-y-4 sm:space-y-5">
            <AnimatedProfile accents={accents} />

            <motion.div
              variants={fadeUpDelayed(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={cardBase}
            >
              <Tabs active={activeTab} onChange={setActiveTab} accents={accents} />
              <div className="p-4 sm:p-5 md:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "education" ? (
                    <EducationTimeline key="education" accents={accents} />
                  ) : (
                    <AchievementsGrid key="achievements" />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 sm:space-y-5">
            <div className="w-full max-w-full lg:max-w-[760px] mx-auto">
              <GeekforgeeksStats accents={accents} />
            </div>
            <div className="w-full max-w-full lg:max-w-[760px] mx-auto">
              <GitHubStats accents={accents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Animated Profile (with rotating icons + 3D tilt)
   ------------------------- */
const AnimatedProfile = memo(function AnimatedProfile({ accents }: { accents: string[] }) {
  const techIcons = [
    { Icon: SiReact, color: "#61DAFB" },
    { Icon: SiJavascript, color: "#F7DF1E" },
    { Icon: SiTypescript, color: "#3178C6" },
    { Icon: SiNodedotjs, color: "#339933" },
    { Icon: SiPython, color: "#3776AB" },
    { Icon: SiTailwindcss, color: "#06B6D4" },
    { Icon: FaJava, color: "#47A248" },
    { Icon: SiGit, color: "#F05032" },
  ];

  // responsive radius to avoid clipping on small screens
  const [radius, setRadius] = useState<number>(180);
  useEffect(() => {
    const compute = (): void => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      const r = Math.round(Math.max(110, Math.min(150, w * 0.12)));
      setRadius(r);
    };
    compute();

    const onResize = (): void => {
      if (typeof window === "undefined") return;
      if ("requestAnimationFrame" in window) {
        window.requestAnimationFrame(compute);
      } else {
        compute();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", onResize);
      }
    };
  }, []);

  const containerSize = radius * 2 + 80;

  // --- 3D tilt motion values
  const mvX = useMotionValue(0); // rotateY
  const mvY = useMotionValue(0); // rotateX
  // convert to degrees strings (framer accepts numbers too)
  const rotateY = useTransform(mvX, (v) => v);
  const rotateX = useTransform(mvY, (v) => v);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // mouse move handler to update mvX/mvY
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRotateY = 12; // degrees
    const maxRotateX = 8; // degrees

    const dx = (e.clientX - cx) / (rect.width / 2); // -1 .. 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 .. 1

    // invert Y so moving up tilts towards user
    const targetY = Math.max(Math.min(dx * maxRotateY, maxRotateY), -maxRotateY);
    const targetX = Math.max(Math.min(-dy * maxRotateX, maxRotateX), -maxRotateX);

    mvX.set(targetY);
    mvY.set(targetX);
  };

  const handlePointerLeave = () => {
    // reset to 0
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative flex items-center justify-center py-12 sm:py-16 md:py-20"
    >
      <div
        ref={wrapperRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative z-20"
        style={{
          paddingTop: 24,
          paddingBottom: 24,
          overflow: "visible",
          perspective: 1000, // important for 3D
          WebkitPerspective: 1000,
        }}
      >
        {/* 3D card wrapper */}
        <motion.div
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            rotateX, // motion value
            rotateY, // motion value
            // keep a tiny 3d feel when device has no pointer by default
          }}
        >
          {/* Outer gradient ring (back-most layer, small translateZ) */}
          <div
            className="absolute inset-0 rounded-full p-[3px] will-change-transform"
            style={{
              background: `linear-gradient(135deg, ${accents[0]}, ${accents[1]})`,
              transform: "translateZ(8px)",
            }}
            aria-hidden
          >
            {/* Avatar image (pops more via translateZ) */}
            <div
              className="w-full h-full rounded-full overflow-hidden bg-center bg-cover"
              style={{
                backgroundImage: `url(${myPhoto})`, // using next/image src for better optimization
                transform: "translateZ(28px) scale(1.02)",
              }}
            />
          </div>

          {/* Pulsing ring (in front, small translateZ) */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: `2px solid ${accents[0]}`,
              opacity: 0.45,
              transform: "translateZ(46px)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.0, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* subtle highlight layer */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.35), inset 0 6px 16px rgba(255,255,255,0.03)",
              transform: "translateZ(6px)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>

      {/* Circular path for icons (rotating) */}
      <motion.svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        width={containerSize}
        height={containerSize}
        style={{ zIndex: 10, transformStyle: "preserve-3d" }}
      >
        <motion.circle
          cx={containerSize / 2}
          cy={containerSize / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      </motion.svg>

      {/* rotating icons ring — each icon has its own translateZ for depth */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{
          width: containerSize,
          height: containerSize,
          marginLeft: -containerSize / 2,
          marginTop: -containerSize / 2,
          pointerEvents: "none",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {techIcons.map(({ Icon, color }, i) => {
          const angle = (i / techIcons.length) * 360;
          // set depth per icon (front icons pop more)
          const depth = 18 + (i % 3) * 8; // varied depth: 18,26,34
          const size = 48;
          const half = size / 2;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg) translateZ(${depth}px)`,
                width: size,
                height: size,
                marginLeft: -half,
                marginTop: -half,
                pointerEvents: "auto",
                willChange: "transform",
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-300 dark:border-white/20 shadow-lg"
                style={{
                  background: `${color}22`,
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.18, z: 60 }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.03, duration: 0.28 }}
              >
                <Icon size={20} color={color} />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* caption */}
      <motion.div
        className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 text-center w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-neutral-100/90 max-w-2xl mx-auto">

        </p>
      </motion.div>
    </motion.div>
  );
});

/* -------------------------
   Background beams
   ------------------------- */
const BackgroundBeams = memo(function BackgroundBeams({ accents }: { accents: string[] }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-x-hidden">
      <div
        className="absolute inset-0 max-w-full"
        style={{
          background: isLight
            ? `radial-gradient(60vw 60vw at 50% 35%, ${hexA(accents[0], 0.08)}, transparent 60%),
     radial-gradient(40vw 40vw at 85% 80%, ${hexA(accents[1], 0.06)}, transparent 65%),
     linear-gradient(180deg,#ffffff,#f3f4f6)`
            : `radial-gradient(60vw 60vw at 50% 35%, ${hexA(accents[0], 0.12)}, transparent 60%),
     radial-gradient(40vw 40vw at 85% 80%, ${hexA(accents[1], 0.10)}, transparent 65%),
     linear-gradient(180deg,#0d0e1a,#161728)`,
        }}
      />
      <div
        className="absolute inset-0 max-w-full"
        style={{
          opacity: isLight ? 0.03 : 0.08,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(60vw 60vw at 50% 45%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(60vw 60vw at 50% 45%, black, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute -left-[20%] top-[10%] h-[160vh] w-[60vw] bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent blur-3xl"
        initial={{ rotate: -18, opacity: 0 }}
        whileInView={{ rotate: -14, opacity: 0.12 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -right-[20%] bottom-[-10%] h-[160vh] w-[60vw] bg-gradient-to-t from-black/5 dark:from-white/4 to-transparent blur-[64px]"
        initial={{ rotate: 14, opacity: 0 }}
        whileInView={{ rotate: 10, opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.08, ease: "easeOut" }}
      />
    </div>
  );
});

/* -------------------------
   Tabs component
   ------------------------- */
function Tabs({
  active,
  onChange,
  accents,
}: {
  active: "education" | "achievements";
  onChange: (t: "education" | "achievements") => void;
  accents: string[];
}) {
  return (
    <div className="flex border-b border-gray-300 dark:border-white/20">
      <TabButton
        active={active === "education"}
        onClick={() => onChange("education")}
        icon="🎓"
        label="Education"
        accents={accents}
      />
      <TabButton
        active={active === "achievements"}
        onClick={() => onChange("achievements")}
        icon="🏆"
        label="Achievements"
        accents={accents}
      />
    </div>
  );
}

const TabButton = memo(function TabButton({
  active,
  onClick,
  icon,
  label,
  accents,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  accents: string[];
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 px-4 py-3 sm:px-5 sm:py-3.5 font-semibold text-sm transition-all duration-300"
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: `linear-gradient(90deg, ${accents[0]}, ${accents[1]})` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
        />
      )}
      <span className={`flex items-center justify-center gap-2 ${active ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-neutral-300"}`}>
        <span className="text-xl">{icon}</span>
        {label}
      </span>
    </button>
  );
});

/* -------------------------
   Education Timeline
   ------------------------- */
type EducationItem = {
  period: string;
  degree: string;
  institution: string;
  cgpa: string;
  color: string;
  icon?: string;
};

function EducationTimeline({ accents }: { accents: string[] }) {
  const education: EducationItem[] = [
    {
      period: "2024–2028",
      degree: "B.Tech, Electrical Engineering",
      institution: "Dr. B.C. Roy Engineering College",
      cgpa: "Current CGPA: 7.2 (4th semester)",
      color: accents[0],
      icon: "🎓",
    },
    {
      period: "2024",
      degree: "Higher Secondary Education",
      institution: "Raghunathpur G.D. Lang Institution",
      cgpa: "74.8%",
      color: accents[2],
      icon: "📘",
    },
    {
      period: "2022",
      degree: "Secondary Education",
      institution: "Raghunathpur G.D. Lang Institution",
      cgpa: "80%",
      color: "#f87171",
      icon: "🏫",
    },
  ];

  return (
    <motion.div variants={listContainer} initial="hidden" animate="show" className="relative max-w-full">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] hidden md:block z-0">
        <div
          className="h-full w-[2px]"
          style={{
            background: document.documentElement.classList.contains("light")
              ? "linear-gradient(180deg,#22d3ee 0%,#06b6d4 50%,#a855f7 100%)"
              : "linear-gradient(180deg,#a855f7 0%,#06b6d4 50%,#22d3ee 100%)"
          }}
        />
      </div>

      <div className="space-y-4 sm:space-y-5">
        {education.map((e, i) => {
          const leftSide = i % 2 === 0;
          return (
            <motion.div
              key={e.period}
              variants={listItem}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch max-w-full"
            >
              <div className={`${leftSide ? "md:col-start-1" : "md:col-start-2"} max-w-full`}>
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative z-20 rounded-xl border border-gray-300 dark:border-white/25 bg-white/80 dark:bg-white/10 backdrop-blur-xl px-4 sm:px-5 py-4 sm:py-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.06)] max-w-full overflow-hidden"
                >
                  <span
                    className="absolute top-1/2 -translate-y-1/2 hidden md:block w-2.5 h-2.5 rounded-full border border-cyan-300 dark:border-white/40"
                    style={{
                      backgroundColor: e.color,
                      left: leftSide ? ("calc(100% + 10px)" as string) : undefined,
                      right: !leftSide ? ("calc(100% + 10px)" as string) : undefined,
                    }}
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 hidden md:block h-[2px]"
                    style={{
                      width: "36px",
                      background: leftSide
                        ? `linear-gradient(90deg, ${e.color}, transparent)`
                        : `linear-gradient(90deg, transparent, ${e.color})`,
                      left: leftSide ? "calc(100% - 1px)" : undefined,
                      right: !leftSide ? "calc(100% - 1px)" : undefined,
                    }}
                  />
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div
                      className="shrink-0 rounded-lg p-2 text-lg"
                      style={{ background: `${e.color}1A`, border: "1px solid rgba(255,255,255,0.15)" }}
                      aria-hidden="true"
                    >
                      {e.icon ?? "🎯"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
                          style={{ color: e.color, background: `${e.color}26`, border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                          {e.period}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-neutral-300">•</span>
                        <span className="text-xs text-gray-600 dark:text-neutral-300">Secured {e.cgpa}</span>
                      </div>
                      <h4 className="mt-1 text-base sm:text-lg font-bold text-gray-900 dark:text-white">{e.degree}</h4>
                      <p className={tinyMuted.replace("100/80", "100/85")}>{e.institution}</p>
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/15">
                        <motion.div
                          variants={barGrow("100%")}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${accents[0]}, ${accents[1]})` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* -------------------------
   AchievementsGrid
   ------------------------- */
const AchievementsGrid = memo(function AchievementsGrid() {
  // for now all same image, later change per card
  const achievements: { title: string; subtitle: string; image: string }[] = [
    { title: "Complete The Specialized Workshop", subtitle: "Building Real-Time Surplus Engine With Gemini & AlloyDB", image: "/Building Real-Time Surplus Engine With Gemini & AlloyDB.jpg" },
    { title: "GDG On Campus BCREC", subtitle: "Place Among The Top 100 Performers", image: "/Rupak_Chatterjee_StudyJam_BCREC_page-0001.jpg" },
    { title: "Spoken Tutorial IIT Bombay", subtitle: "Certificate for the Completion of Java Training", image: "/RUPAK-CHATTERJEE-Arduino Training.jpg" },
    { title: "CareerVerse", subtitle: "Participated in the CareerVerse event & Achieve Gold Performance Award.", image: "/careerverse_2026_checklist_gold_certificate_page-0001.jpg" },
    { title: "GCSJ (SPEC)", subtitle: "Top Performer In GCSJ 2K25", image: "/GCSJ(SPEC)_page-0001.jpg" },
    { title: "Google Cloud Arcade", subtitle: "Achieve 3X Time Legend Milestone", image: "/IMG_20260422_094249.jpg" },
  ]

  const [isTouch, setIsTouch] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<{
    image: string
    title: string
  } | null>(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    setIsTouch(("ontouchstart" in window) || (navigator.maxTouchPoints ?? 0) > 0)
  }, [])

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // close on outside tap / click
  useEffect(() => {
    const handler = (e: TouchEvent | MouseEvent) => {
      if (!containerRef.current) return
      const target = e.target as Node | null
      if (target && !containerRef.current.contains(target)) {
        setOpenIndex(null)
      }
    }
    document.addEventListener("touchstart", handler, { passive: true })
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {achievements.map((item, idx) => {
        const isOpen = openIndex === idx

        return (
          <motion.div
            key={`${item.title}-${idx}`}
            initial={{ scale: 1, opacity: 1 }}
            whileHover={!isTouch ? { scale: 1.02 } : {}}
            transition={{ duration: 0.25 }}
            className="group relative rounded-xl border border-gray-300 dark:border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-xl overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.06)]"
            style={{ minHeight: 140 }}
            onClick={() =>
              setSelectedCertificate({
                image: item.image,
                title: item.title,
              })
            }
          >
            {/* Text content – always visible */}
            <div className="relative z-10 p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                <div className="text-xs text-gray-600 dark:text-neutral-200">🏅</div>
              </div>
              <p className="text-xs text-gray-600 dark:text-neutral-300">{item.subtitle}</p>
            </div>

            {/* DESKTOP: image slides up on hover */}
            <img
              src={item.image}
              alt={`${item.title} certificate`}
              loading="lazy"
              className="
                hidden md:block
                pointer-events-none
                absolute inset-0 w-full h-full object-cover
                translate-y-full opacity-0
                transition-all duration-300 ease-out
                group-hover:translate-y-0 group-hover:opacity-100
              "
            />

            {/* MOBILE/TABLET: tap to show image */}
            <AnimatePresence>
              {isTouch && isOpen && (
                <motion.div
                  key="mobile-overlay"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 z-20 flex items-end"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.5))" }}
                >
                  <div className="w-full">
                    <img
                      src={item.image}
                      alt={`${item.title} certificate`}
                      loading="lazy"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3 text-gray-900 dark:text-white bg-black/60 backdrop-blur-sm">
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-neutral-100/85 mt-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white/80 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-auto"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedCertificate(null)}
                className="fixed top-5 right-5 z-[10001] bg-red-500/40 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-red-400/30"
              >
                ✕
              </button>

              <a
                href={selectedCertificate.image}
                download
                className="fixed top-5 left-5 z-[10001] bg-white/20 dark:bg-cyan-500/20 backdrop-blur-xl border border-cyan-400/30 text-cyan-700 dark:text-cyan-100 px-4 py-2 rounded-xl shadow-lg hover:bg-cyan-500/30 transition-all duration-300"
              >
                Download
              </a>

              <img
                src={selectedCertificate.image}
                alt={selectedCertificate.title}
                className="max-w-full max-h-[65vh] object-contain rounded-xl mx-auto"
              />

              <div className="mt-3 text-center text-gray-900 dark:text-white font-semibold">
                {selectedCertificate.title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})



/* -------------------------
   GeekforgeeksStats
   ------------------------- */
const GeekforgeeksStats = memo(function GeekforgeeksStats({ accents }: { accents: string[] }) {
  const stats = {
    easy: { solved: 32, total: 1000, beats: 55 },
    medium: { solved: 76, total: 1000, beats: 62 },
    hard: { solved: 25, total: 1000, beats: 35 },
    rank: "120000",
    badges: "09",
    reputation: "N/A",
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={`${cardBase} p-5 sm:p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={gfglogo}
          alt="GeeksforGeeks"
          className="w-10 h-10 object-contain"
        />
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">Geekforgeeks</h3>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mb-4">
        <RadialStat
          primary={accents[0]}
          secondary={accents[1]}
          innerTop="133"
          innerBottom="Solved"
        />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1">
          <StatBox label="Rank" value={stats.rank} />
          <StatBox label="Badges" value={stats.badges} />
          <StatBox label="Reputation" value={stats.reputation} />
        </div>
      </div>

      <div className="space-y-3">
        <ProgressBar label="Easy" solved={stats.easy.solved} total={stats.easy.total} beats={stats.easy.beats} color="#22d3ee" delay={0.2} />
        <ProgressBar label="Medium" solved={stats.medium.solved} total={stats.medium.total} beats={stats.medium.beats} color="#34d399" delay={0.25} />
        <ProgressBar label="Hard" solved={stats.hard.solved} total={stats.hard.total} beats={stats.hard.beats} color="#f87171" delay={0.3} />
      </div>
    </motion.div>
  );
});

/* -------------------------
   Supporting small components
   ------------------------- */
const RadialStat = memo(function RadialStat({
  primary,
  secondary,
  innerTop,
  innerBottom,
}: {
  primary: string;
  secondary: string;
  innerTop: string;
  innerBottom: string;
}) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96" aria-hidden>
        <circle cx="48" cy="48" r="40" stroke="rgba(180,180,180,0.35)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          stroke="url(#gradient-Geekforgeeks)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 0.75 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
        <defs>
          <linearGradient id="gradient-Geekforgeeks" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900 dark:text-white">{innerTop}</span>
        <span className="text-[10px] text-gray-700 dark:text-neutral-300">{innerBottom}</span>
      </div>
    </div>
  );
});

const StatBox = memo(function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="text-center p-2 rounded-lg bg-white/80 dark:bg-white/10 border border-gray-300 dark:border-white/20 max-w-full"
    >
      <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{value}</div>
      <div className={tinyMuted}>{label}</div>
    </motion.div>
  );
});

function ProgressBar({
  label,
  solved,
  total,
  beats,
  color,
  delay,
}: {
  label: string;
  solved: number;
  total: number;
  beats: number;
  color: string;
  delay: number;
}) {
  const percentage = (solved / total) * 100;
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600 dark:text-neutral-300">
            {solved}/{total}
          </span>
          <span className="text-gray-600 dark:text-neutral-300">Beats: {beats}%</span>
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
        <motion.div
          variants={barGrow(`${percentage}%`, delay)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* -------------------------
   GitHubStats
   ------------------------- */
const GitHubStats = memo(function GitHubStats({
  accents,
}: {
  accents: string[];
}) {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const githubTheme = isLight ? "github_light" : "tokyonight"
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`${cardBase} p-5 sm:p-6`}
    >
      <div className="flex items-center gap-3 mb-6">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>

        <h3
          className="text-2xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${accents[0]}, ${accents[1]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          GitHub Stats
        </h3>
      </div>

      <div className="space-y-5">
        <img
          loading="lazy"
          decoding="async"
          src={`https://github-readme-stats-sigma-five.vercel.app/api?username=Rupakrc9776&show_icons=true&theme=${githubTheme}&hide_border=true`}
          alt="GitHub Stats"
          className="w-full rounded-xl"
        />

        <img
          src={`https://streak-stats.demolab.com?user=Rupakrc9776&theme=${githubTheme}&hide_border=true`}
          alt="GitHub Streak"
          className="w-full rounded-xl"
        />

        <img
          src={`https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=Rupakrc9776&layout=compact&theme=${githubTheme}&hide_border=true`}
          alt="Top Languages"
          className="w-full rounded-xl"
        />
      </div>
    </motion.div>
  );
});