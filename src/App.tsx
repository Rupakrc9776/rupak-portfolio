import { useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalLayers from "./components/GlobalLayers";
import IntroFullscreen from "./components/IntroFullscreen";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/projects"; // ✅ fixed: capitalized import
import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Certificate from "./sections/Certificate";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-300/20 selection:text-white">
      {/* Intro Animation */}
      {!introDone ? (
        <IntroFullscreen
          onComplete={() => setIntroDone(true)}
          minDurationMs={3500} // ⏱ shorter & smoother for production
          playEvenIfSeen // remove later if you only want to play once
        />
      ) : (
        <>
          {/* Background Glow Layers */}
          <GlobalLayers />

          {/* Main Site Sections */}
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects /> {/* ✅ View Project button now works correctly */}
          <Experience />
          <Certificate/>
          <Testimonials />
          <Contact />
          <Footer />
        </>
      )}
    </main>
  );
}
