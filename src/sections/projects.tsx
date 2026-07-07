"use client";

import { useState, useEffect, useRef } from "react";

import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  features: string[];
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  gradientFrom: string;
  gradientTo: string;
};

const projects: Project[] = [
  { id: 1, title: "Smart Energy Monitoring & Theft Detection System Using ESP32", category: "IoT & Embedded Systems", description: "An ESP32-based Smart Energy Monitoring and Theft Detection System designed to monitor real-time voltage, current, power consumption, and detect abnormal energy usage patterns. The system integrates IoT technology using Blynk for remote monitoring and instant alerts, helping users improve energy efficiency and identify potential electricity theft.", features: ["Real-time Voltage, Current & Power Monitoring", "Energy Theft Detection using Abnormal Usage Analysis", "IoT Dashboard with Blynk Integration", "Remote Monitoring via Smartphone", "Instant Alert Notifications", "Low-Cost Smart Energy Management Solution"], technologies: ["ESP32", "Arduino IDE", "Blynk IoT", "Embedded C", "IoT", "Energy Monitoring"], image: p1, githubUrl: "https://github.com/Rupakrc9776/Smart-Energy-Monitoring-Theft-Detection-System-Using-ESP-32", liveUrl: "", gradientFrom: "#06b6d4", gradientTo: "#3b82f6" },
  { id: 2, title: "Power Consumption Analyzer", category: "Electrical Engineering + Python", description: "A Python-based energy analytics tool that analyzes appliance power consumption, estimates electricity costs, identifies peak load usage, and generates optimized schedules for efficient energy management.", features: ["Energy Consumption Analysis", "Electricity Cost Estimation", "Peak Load Detection", "Load Scheduling Optimization", "CSV Data Processing"], technologies: ["Python", "Pandas", "Matplotlib", "Numpy", "CSV"], image: p2, githubUrl: "https://github.com/Rupakrc9776/power-consumption-analyzer", liveUrl: "", gradientFrom: "#06d47b", gradientTo: "#8b5cf6" },
  { id: 3, title: "Career & Skills Advisor", category: "AI / Career Guidance", description: "An intelligent career recommendation platform built using Python and Streamlit. It analyzes user interests and skills to suggest suitable career paths, learning resources, and growth opportunities.", features: ["Career Recommendation Engine", "Skills Assessment", "Personalized Suggestions", "Interactive Dashboard", "User-Friendly Interface"], technologies: ["Python", "Streamlit", "JSON", "Data Analysis"], image: p3, githubUrl: "https://github.com/Rupakrc9776/career-advisor-neurovolt", liveUrl: "https://career-advisor-neurovolt.streamlit.app/", gradientFrom: "#f59e0b", gradientTo: "#ef4444" },
];

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const currentProject = projects[activeIndex];
  const isLight =
    document.documentElement.classList.contains("light");
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      forceUpdate((v) => v + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const nextProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnimating]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center py-10 transition-colors duration-300 ${isLight ? "bg-[#f8fafc]" : "bg-[#0a0a0a]"}`}
      id="projects"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute rounded-full opacity: isLight ? 0.18 : 0.22 transition-all duration-1000"
          style={{
            // fluid size using clamp, and container-based transform
            width: "clamp(12rem, 25vw, 24rem)",
            height: "clamp(12rem, 25vw, 24rem)",
            top: "15%",
            left: "12%",
            background: `radial-gradient(circle, ${currentProject.gradientFrom}99 0%, ${currentProject.gradientFrom}55 20%, transparent 75%)`,
            filter: isLight ? "blur(80px)" : "blur(65px)",
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          }}
        />
        <div
          className="absolute rounded-full opacity: isLight ? 0.18 : 0.22 transition-all duration-1000"
          style={{
            width: "clamp(12rem, 25vw, 24rem)",
            height: "clamp(12rem, 25vw, 24rem)",
            bottom: "15%",
            right: "12%",
            background: `radial-gradient(circle, ${currentProject.gradientTo}99 0%, ${currentProject.gradientTo}55 20%, transparent 75%)`,
            filter: isLight ? "blur(80px)" : "blur(65px)",
            transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px)`,
          }}
        />
        <div
          className={`absolute inset-0 ${isLight ? "opacity-[0.12]" : "opacity-[0.06]"
            }`}
          style={{
            backgroundImage: isLight
              ? "linear-gradient(rgba(0,0,0,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(0,0,0,.08) 1px, transparent 1px)"
              : "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.10) 1px, transparent 1px)"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm md:text-base font-semibold tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </div>
          <h2
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}
          >
            Featured{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Explore my latest work showcasing modern web technologies and creative solutions
          </p>
        </div>

        {/* Project Card */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left: Image (3 columns) */}
            <div className="relative order-2 lg:order-1 lg:col-span-3">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                }}
              >
                {/* Gradient Border */}
                <div
                  className="absolute inset-0 rounded-3xl p-[1px] opacity-60 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${currentProject.gradientFrom}, ${currentProject.gradientTo})`,
                  }}
                >
                  <div
                    className={`w-full h-full rounded-3xl ${isLight ? "bg-white shadow-xl" : "bg-[#0a0a0a]"}`}
                  />
                </div>

                {/* Image container with aspect-ratio for fluid height */}
                <div
                  className="relative z-10 rounded-3xl overflow-hidden w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-video lg:aspect-[16/10]"
                  style={{
                    boxShadow: isLight
                      ? `0 0 120px ${currentProject.gradientFrom}40`
                      : `0 0 80px ${currentProject.gradientFrom}30`,
                  }}
                >
                  <img
                    key={currentProject.id}
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay Glow */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay rounded-3xl transition-opacity duration-700 pointer-events-none"
                  style={{
                    opacity: isLight ? 0.20 : 0.35,
                    background: `linear-gradient(135deg, ${currentProject.gradientFrom}40, ${currentProject.gradientTo}40)`,
                  }}
                />
              </div>
            </div>

            {/* Right: Details (2 columns) */}
            <div className="space-y-6 order-1 lg:order-2 lg:col-span-2">
              <div key={`category-${currentProject.id}`} className="inline-block animate-slideInRight">
                <span
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border ${isLight ? "text-cyan-700" : "text-white"}`}
                  style={{
                    borderColor: currentProject.gradientFrom,
                    background: `${currentProject.gradientFrom}15`,
                  }}
                >
                  {currentProject.category}
                </span>
              </div>

              <h3
                key={`title-${currentProject.id}`}
                className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isLight ? "text-gray-900" : "text-white"} leading-tight animate-slideInRight`}
                style={{ animationDelay: "0.1s" }}
              >
                {currentProject.title}
              </h3>

              <p
                key={`desc-${currentProject.id}`}
                className={`${isLight ? "text-gray-700" : "text-gray-300"} text-base md:text-lg leading-relaxed animate-slideInRight`}
                style={{ animationDelay: "0.2s" }}
              >
                {currentProject.description}
              </p>

              <div key={`features-${currentProject.id}`} className="space-y-2 animate-slideInRight" style={{ animationDelay: "0.25s" }}>
                <h4 className={`text-sm font-semibold ${isLight ? "text-gray-600" : "text-gray-400"} uppercase tracking-wider`}>Key Features</h4>
                <ul className="space-y-2">
                  {currentProject.features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-2 ${isLight ? "text-gray-700" : "text-gray-300"}`} style={{ animationDelay: "0.3s" }}>
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: currentProject.gradientFrom }} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div key={`tech-${currentProject.id}`} className="space-y-2 animate-slideInRight" style={{ animationDelay: "0.3s" }}>
                <h4 className={`text-sm font-semibold ${isLight ? "text-gray-600" : "text-gray-400"} uppercase tracking-wider`}>Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm ${isLight
                        ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div key={`buttons-${currentProject.id}`} className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4 animate-slideInRight" style={{ animationDelay: "0.4s" }}>
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${currentProject.gradientFrom}, ${currentProject.gradientTo})` }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Live Preview</span>
                  </a>
                )}

                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm ${isLight
                    ? "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.69-.63.69-.63 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Arrows (container-anchored, no hardcoded push) */}
          <button
            onClick={prevProject}
            disabled={isAnimating}
            className={`absolute inset-y-0 left-0 my-auto w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group z-20 ${isLight
              ? "bg-white border border-gray-300 text-gray-900"
              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            aria-label="Previous project"
            style={{
              // keep arrow inside container using clamp() based padding
              transform: "translateY(0)",
              marginLeft: "clamp(0.25rem, 1vw, 0.75rem)",
            }}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextProject}
            disabled={isAnimating}
            className={`absolute inset-y-0 right-0 my-auto w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group z-20 ${isLight
              ? "bg-white border border-gray-300 text-gray-900"
              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            aria-label="Next project"
            style={{
              transform: "translateY(0)",
              marginRight: "clamp(0.25rem, 1vw, 0.75rem)",
            }}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-3 mt-10 md:mt-14">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => {
                if (!isAnimating && index !== activeIndex) {
                  setIsAnimating(true);
                  setActiveIndex(index);
                  setTimeout(() => setIsAnimating(false), 600);
                }
              }}
              className="group relative"
              aria-label={`Go to project ${index + 1}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-500 ${index === activeIndex ? "w-10 sm:w-12 md:w-16" : "w-2 hover:w-4"}`}
                style={{
                  background:
                    index === activeIndex
                      ? `linear-gradient(90deg, ${project.gradientFrom}, ${project.gradientTo})`
                      : isLight
                        ? "rgba(0,0,0,0.25)"
                        : "rgba(255,255,255,0.2)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Project Counter */}
        <div className="text-center mt-6 md:mt-8 text-sm md:text-base text-gray-500 font-medium">
          <span className={`${isLight ? "text-gray-900" : "text-white"}`}>{String(activeIndex + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-in-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out backwards; }
      `}</style>
    </section>
  );
}
