
import { useEffect, useMemo, useRef, useState, memo } from "react";
import Matter, { Bodies, Body, Constraint, Engine, Events, Runner, World } from "matter-js";
import interact from "interactjs";

// Import React Icons
import {
  SiOpenjdk,
  SiPython,
  SiC,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiVite,
  SiGithub,
  SiLinux,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiArduino,
  SiNpm,
  SiVsco,
} from "react-icons/si";

import { FaGitAlt } from "react-icons/fa";

// Tech list with React icon components
type Item = { 
  key: string; 
  label: string; 
  color: string; 
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
};

const SKILLS: Item[] = [
  { key: "java", label: "Java", color: "#f89820", icon: SiOpenjdk },
  { key: "python", label: "Python", color: "#3776AB", icon: SiPython },
  { key: "c", label: "C", color: "#A8B9CC", icon: SiC },
  { key: "javascript", label: "JavaScript", color: "#F7DF1E", icon: SiJavascript },
  { key: "typescript", label: "TypeScript", color: "#3178C6", icon: SiTypescript },
  { key: "react", label: "React", color: "#61DAFB", icon: SiReact },
  { key: "html", label: "HTML5", color: "#E34F26", icon: SiHtml5 },
  { key: "css", label: "CSS3", color: "#1572B6", icon: SiCss },
  { key: "tailwind", label: "Tailwind CSS", color: "#38BDF8", icon: SiTailwindcss },
  { key: "vite", label: "Vite", color: "#646CFF", icon: SiVite },
  { key: "git", label: "Git", color: "#F05032", icon: FaGitAlt },
  { key: "github", label: "GitHub", color: "#ffffff", icon: SiGithub },
  { key: "linux", label: "Linux", color: "#FCC624", icon: SiLinux },
  { key: "firebase", label: "Firebase", color: "#FFCA28", icon: SiFirebase },
  { key: "vercel", label: "Vercel", color: "#ffffff", icon: SiVercel },
  { key: "netlify", label: "Netlify", color: "#00C7B7", icon: SiNetlify },
  { key: "arduino", label: "Arduino", color: "#00979D", icon: SiArduino },
  { key: "npm", label: "NPM", color: "#CB3837", icon: SiNpm },
  { key: "vscode", label: "VS Code", color: "#007ACC", icon: SiVsco },
]

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function useOnceInView(id: string, threshold = 0.15) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(true)), 
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, threshold]);
  return active;
}

// Memoized Skill Tile Component
const SkillTile = memo(({ item, boxSize }: { item: Item; boxSize: number }) => {
  const IconComponent = item.icon;
  const iconSize = boxSize > 100 ? 40 : boxSize > 85 ? 34 : 28;
  
  return (
    <div
      data-key={item.key}
      className="ps2d-tile"
      style={{
        background: item.color,
        borderColor: shade(item.color, -18),
      }}
    >
      <div className="ps2d-row">
        <div className="ps2d-logo-wrap">
          <IconComponent 
            size={iconSize}
            color="#1a1a1a"
            className="ps2d-logo"
          />
        </div>
        <span className="ps2d-text">{item.label}</span>
      </div>
    </div>
  );
});
SkillTile.displayName = 'SkillTile';

export default function Skills() {
  const rootId = "project-skills-2d";
  const activated = useOnceInView(rootId);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const constraintsRef = useRef<Map<string, Constraint>>(new Map());
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const lockRef = useRef({ locked: false, releaseAt: 220 });
  const lastUpdateRef = useRef<Map<string, { x: number; y: number; angle: number }>>(new Map());

  // Smaller responsive box sizes for mobile
  const BOX = useMemo(() => {
    if (typeof window === 'undefined') return { size: 140 };
    const width = window.innerWidth;
    if (width < 480) return { size: 75 };
    if (width < 640) return { size: 85 };
    if (width < 768) return { size: 105 };
    return { size: 140 };
  }, []);

  // Grid-based spawn to prevent initial overlap
  const positions = useMemo(() => {
    const r = mulberry32(13579);
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const isMobile = width < 640;
    const boxSize = isMobile ? (width < 480 ? 75 : 85) : (width < 768 ? 105 : 140);
    
    const cols = width < 480 ? 3 : width < 640 ? 3 : width < 768 ? 4 : 5;
    const spacing = boxSize + (isMobile ? 15 : 25);
    
    return SKILLS.map((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const centerOffset = width < 640 ? 40 : 80;
      return {
        x: centerOffset + col * spacing + r() * 30,
        y: -350 - row * spacing - r() * 25
      };
    });
  }, []);

  // Scroll lock
  useEffect(() => {
    const scene = sceneRef.current!;
    const checkLock = () => {
      const rect = scene.getBoundingClientRect();
      const reachedBottom = Math.abs(rect.bottom - window.innerHeight) < 1;
      lockRef.current.locked = reachedBottom;
      lockRef.current.releaseAt = 220;
    };
    checkLock();
    const io = new IntersectionObserver(() => checkLock(), { threshold: [0, 1] });
    io.observe(scene);
    const onWheel = (e: WheelEvent) => {
      if (!lockRef.current.locked) return;
      const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 60);
      lockRef.current.releaseAt -= Math.abs(delta);
      e.preventDefault();
      e.stopPropagation();
      if (lockRef.current.releaseAt <= 0) {
        lockRef.current.locked = false;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    if (!activated) return;
    const scene = sceneRef.current!;
    const width = scene.clientWidth;
    const height = scene.clientHeight;

    // ✨ OPTIMIZED ENGINE with smooth physics
    const engine = Engine.create({ 
      gravity: { x: 0, y: 0.98, scale: 0.001 },
      enableSleeping: true,
      timing: {
        timeScale: 1
      }
    });
    
    // ✨ BALANCED iterations for smooth + performant physics
    engine.positionIterations = 8;
    engine.velocityIterations = 6;
    engineRef.current = engine;

    const runner = Runner.create({ 
      delta: 1000 / 60,
      enabled: true
    });
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const wall = 120;
    
    // ✨ IMPROVED WALL PHYSICS - Better bounce and friction
    const ceiling = Bodies.rectangle(width / 2, -wall / 2, width + 200, wall, {
      isStatic: true,
      restitution: 0.4,
      friction: 0.05,
      frictionStatic: 0.05,
      label: 'ceiling'
    });
    
    const floor = Bodies.rectangle(width / 2, height + wall / 2, width + 200, wall, {
      isStatic: true,
      restitution: 0.65,
      friction: 0.06,
      frictionStatic: 0.08,
      label: 'floor'
    });
    
    const left = Bodies.rectangle(-wall / 2, height / 2, wall, height * 3, { 
      isStatic: true, 
      restitution: 0.55,
      friction: 0.05,
      label: 'left'
    });
    
    const right = Bodies.rectangle(width + wall / 2, height / 2, wall, height * 3, { 
      isStatic: true, 
      restitution: 0.55,
      friction: 0.05,
      label: 'right'
    });
    
    World.add(engine.world, [ceiling, floor, left, right]);

    // ✨ IMPROVED BODY PHYSICS - Smooth, realistic movement
    SKILLS.forEach((item, i) => {
      const s = BOX.size;
      const pos = positions[i];
      const body = Bodies.rectangle(pos.x, pos.y, s, s, {
        restitution: 0.5,
        friction: 0.08,
        frictionStatic: 0.12,
        frictionAir: 0.018,
        density: 0.0035,
        inertia: Infinity,
        slop: 0.05,
        label: item.key,
        sleepThreshold: 60,
        collisionFilter: {
          group: 0,
          category: 0x0001,
          mask: 0xFFFF
        },
        chamfer: { radius: s * 0.08 }
      });
      
      Body.setAngle(body, (Math.random() - 0.5) * 0.08);
      bodiesRef.current.set(item.key, body);
      World.add(engine.world, body);
    });

    // ✨ SMOOTH COLLISION HANDLING - No jitters
    Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;
      for (const pair of pairs) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        if (bodyA.isStatic || bodyB.isStatic) continue;
        
        // Wake up bodies on collision
        bodyA.isSleeping = false;
        bodyB.isSleeping = false;
      }
    });

    // ✨ ROTATION DAMPING for natural spin
    Events.on(engine, "beforeUpdate", () => {
      bodiesRef.current.forEach((body) => {
        if (body.isSleeping) return;
        
        // Gradual rotation damping
        const angularDamping = 0.92;
        Body.setAngularVelocity(body, body.angularVelocity * angularDamping);
        
        // Limit maximum angular velocity
        const maxAngularVelocity = 0.25;
        if (Math.abs(body.angularVelocity) > maxAngularVelocity) {
          Body.setAngularVelocity(
            body, 
            Math.sign(body.angularVelocity) * maxAngularVelocity
          );
        }
        
        // Limit maximum velocity for stability
        const maxVelocity = 15;
        const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        if (speed > maxVelocity) {
          const scale = maxVelocity / speed;
          Body.setVelocity(body, {
            x: body.velocity.x * scale,
            y: body.velocity.y * scale
          });
        }
      });
    });

    // ✨ SMOOTH BOUNDARY CORRECTION
    Events.on(engine, "afterUpdate", () => {
      bodiesRef.current.forEach((body) => {
        const { x, y } = body.position;
        const margin = BOX.size / 2 + 15;
        
        let needsCorrection = false;
        let newX = x;
        let newY = y;
        
        if (x < margin) {
          newX = margin;
          needsCorrection = true;
        } else if (x > width - margin) {
          newX = width - margin;
          needsCorrection = true;
        }
        
        if (y < margin) {
          newY = margin;
          needsCorrection = true;
        } else if (y > height - margin) {
          newY = height - margin;
          needsCorrection = true;
        }
        
        if (needsCorrection) {
          Body.setPosition(body, { x: newX, y: newY });
          Body.setVelocity(body, { 
            x: body.velocity.x * 0.3, 
            y: body.velocity.y * 0.3 
          });
        }
      });
    });

    const tiles = Array.from(scene.querySelectorAll<HTMLDivElement>(".ps2d-tile"));
    let animationFrameId: number;
    
    // ✨ OPTIMIZED DOM SYNC with transform caching
    const POSITION_THRESHOLD = 0.3;
    const ANGLE_THRESHOLD = 0.008;
    
    const syncDOM = () => {
      for (const el of tiles) {
        const key = el.dataset.key!;
        const body = bodiesRef.current.get(key);
        if (!body) continue;
        
        const { x, y } = body.position;
        const angle = body.angle;
        const last = lastUpdateRef.current.get(key);
        
        if (!last || 
            Math.abs(x - last.x) > POSITION_THRESHOLD ||
            Math.abs(y - last.y) > POSITION_THRESHOLD ||
            Math.abs(angle - last.angle) > ANGLE_THRESHOLD) {
          
          const translateX = Math.round((x - el.offsetWidth / 2) * 100) / 100;
          const translateY = Math.round((y - el.offsetHeight / 2) * 100) / 100;
          const rotation = Math.round(angle * 1000) / 1000;
          
          el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}rad)`;
          lastUpdateRef.current.set(key, { x, y, angle });
        }
      }
      animationFrameId = requestAnimationFrame(syncDOM);
    };
    syncDOM();

    // ✨ IMPROVED DRAG INTERACTION with smooth spring physics
    interact(".ps2d-tile").draggable({
      inertia: {
        resistance: 8,
        minSpeed: 150,
        endSpeed: 20
      },
      modifiers: [],
      autoScroll: false,
      listeners: {
        start(event) {
          const key = (event.target as HTMLElement).dataset.key!;
          const body = bodiesRef.current.get(key);
          if (!body) return;
          
          Body.setStatic(body, false);
          body.isSleeping = false;
          Body.setAngularVelocity(body, 0);
          Body.setVelocity(body, { x: 0, y: 0 });
          
          const rect = scene.getBoundingClientRect();
          const clientX = event.clientX || event.touches?.[0]?.clientX || 0;
          const clientY = event.clientY || event.touches?.[0]?.clientY || 0;
          const mouse = { 
            x: clientX - rect.left, 
            y: clientY - rect.top 
          };
          
          const spring = Constraint.create({
            pointA: mouse,
            bodyB: body,
            stiffness: 0.055,
            damping: 0.12,
            length: 0,
          });
          constraintsRef.current.set(key, spring);
          World.add(engine.world, spring);
        },
        move(event) {
          const key = (event.target as HTMLElement).dataset.key!;
          const spring = constraintsRef.current.get(key);
          if (!spring) return;
          
          const rect = scene.getBoundingClientRect();
          const clientX = event.clientX || event.touches?.[0]?.clientX || 0;
          const clientY = event.clientY || event.touches?.[0]?.clientY || 0;
          
          spring.pointA = { 
            x: clientX - rect.left, 
            y: clientY - rect.top 
          };
        },
        end(event) {
          const key = (event.target as HTMLElement).dataset.key!;
          const spring = constraintsRef.current.get(key);
          if (!spring) return;
          const body = bodiesRef.current.get(key);
          
          if (body) {
            // ✨ Better velocity inheritance from drag
            const velocityMultiplier = 0.75;
            Body.setVelocity(body, {
              x: body.velocity.x * velocityMultiplier,
              y: body.velocity.y * velocityMultiplier
            });
            
            // Add slight rotation on release
            const horizontalVelocity = Math.abs(body.velocity.x);
            if (horizontalVelocity > 2) {
              Body.setAngularVelocity(
                body, 
                (Math.random() - 0.5) * 0.15
              );
            }
            
            // Gentle upward boost if near bottom
            if (body.position.y > scene.clientHeight - 140) {
              Body.applyForce(body, body.position, { x: 0, y: -0.008 });
            }
          }
          
          World.remove(engine.world, spring);
          constraintsRef.current.delete(key);
        },
      },
    });

    // ✨ DEBOUNCED RESIZE
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = scene.clientWidth;
        const h = scene.clientHeight;
        
        Body.setPosition(ceiling, { x: w / 2, y: -wall / 2 });
        Body.setVertices(ceiling, Bodies.rectangle(w / 2, -wall / 2, w + 200, wall, { isStatic: true }).vertices);
        
        Body.setPosition(floor, { x: w / 2, y: h + wall / 2 });
        Body.setVertices(floor, Bodies.rectangle(w / 2, h + wall / 2, w + 200, wall, { isStatic: true }).vertices);
        
        Body.setPosition(right, { x: w + wall / 2, y: h / 2 });
        Body.setVertices(right, Bodies.rectangle(w + wall / 2, h / 2, wall, h * 3, { isStatic: true }).vertices);
        
        Body.setPosition(left, { x: -wall / 2, y: h / 2 });
        Body.setVertices(left, Bodies.rectangle(-wall / 2, h / 2, wall, h * 3, { isStatic: true }).vertices);
      }, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const constraintsMap = constraintsRef.current;
    const bodiesMap = bodiesRef.current;
    const lastUpdateMap = lastUpdateRef.current;

    return () => {
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      try {
        interact(".ps2d-tile").unset();
      } catch {
        // intentionally empty
      }
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      constraintsMap.clear();
      bodiesMap.clear();
      lastUpdateMap.clear();
    };
  }, [activated, positions, BOX.size]);

  return (
    <section id="skills" className="ps2d-root">
      <StyleTag boxSize={BOX.size} />

      <header className="ps2d-header">
        <h2 className="ps2d-title">
          Skills <span className="ps2d-accent">Playground</span>
        </h2>
        <p className="ps2d-sub">Drag, throw, and watch them bounce. Nothing escapes!</p>
      </header>

      <div ref={sceneRef} className="ps2d-scene">
        <div className="ps2d-layer">
          {SKILLS.map((item) => (
            <SkillTile key={item.key} item={item} boxSize={BOX.size} />
          ))}
        </div>
        <div className="ps2d-floor-line" />
      </div>
    </section>
  );
}

// Helpers
function shade(hex: string, percent: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00ff) + percent;
  const b = (num & 0x0000ff) + percent;
  const clamp = (v: number) => Math.max(Math.min(255, v), 0);
  return `#${(clamp(r) << 16 | clamp(g) << 8 | clamp(b)).toString(16).padStart(6, "0")}`;
}

// Inline CSS
function StyleTag({ boxSize }: { boxSize: number }) {
  return (
    <style>{`

.ps2d-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  background: #070a0f;
  color: #fff;
  overflow: hidden;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

html, body {
  scroll-behavior: smooth;
}

.ps2d-header {
  pointer-events: none;
  position: absolute;
  inset-inline: 0;
  top: 16px;
  text-align: center;
  z-index: 10;
  padding: 0 16px;
}
.ps2d-title {
  font-size: clamp(22px, 4.0vw, 56px);
  font-weight: 900;
  letter-spacing: -0.02em;
}
.ps2d-accent { color: #22d3ee; }
.ps2d-sub { 
  margin-top: 6px; 
  opacity: 0.8; 
  font-size: clamp(12px, 2vw, 16px);
}

.ps2d-scene {
  position: relative;
  width: min(1240px, 96vw);
  height: calc(100dvh - 100px);
  margin: 80px auto 0 auto;
}
.ps2d-layer {
  position: absolute;
  inset: 0;
}

.ps2d-tile {
  position: absolute;
  width: ${boxSize}px;
  height: ${boxSize}px;
  border-radius: ${boxSize > 100 ? '16px' : boxSize > 85 ? '14px' : '12px'};
  border: 2px solid transparent;
  user-select: none;
  touch-action: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  -webkit-tap-highlight-color: transparent;
  will-change: transform;
  backface-visibility: hidden;
  transition: box-shadow 0.2s ease;
}
.ps2d-tile:active {
  cursor: grabbing;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}

.ps2d-row {
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: ${boxSize > 100 ? '12px' : boxSize > 85 ? '10px' : '8px'} 0;
  pointer-events: none;
}

.ps2d-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  pointer-events: none;
  margin-top: ${boxSize > 100 ? '8px' : '4px'};
}

.ps2d-logo {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.ps2d-text {
  font-weight: 900;
  letter-spacing: 0.3px;
  color: #ffffff;
  font-size: ${boxSize > 100 ? '13px' : boxSize > 85 ? '11px' : '9px'};
  text-align: center;
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  margin-bottom: ${boxSize > 100 ? '4px' : '2px'};
}

.ps2d-floor-line {
  pointer-events: none;
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 4px;
  background: rgba(255,255,255,0.08);
}

@media (max-width: 640px) {
  .ps2d-header {
    top: 10px;
  }
  .ps2d-scene { 
    height: calc(100dvh - 85px);
    margin: 68px auto 0 auto;
    width: 98vw;
  }
}

@media (max-width: 480px) {
  .ps2d-scene {
    width: 100vw;
    height: calc(100dvh - 80px);
    margin: 65px auto 0 auto;
  }
}
`}</style>
  );
}
