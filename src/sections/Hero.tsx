
import { useEffect, useLayoutEffect, useMemo, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// CSS injection for crisp grid + socials
const gridCSS = `
.hero-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
    radial-gradient(ellipse at 50% 120%, rgba(255,255,255,0.035), rgba(0,0,0,0) 60%);
  background-size: 80px 80px, 80px 80px, 100% 100%;
  background-position: 0 0, 0 0, 0 0;
  opacity: 0.55;
  filter: contrast(1) saturate(1.0);
  transform: translateZ(0);
  will-change: background-position;
}
.hero-social a { transition: transform .2s ease, color .2s ease; }
.hero-social a:hover { transform: translateY(-2px); color: #fff; }
`;

// Optimized Neon gradient glow shader
class NeonGlowMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uHue: { value: 0.66 },
        uAlpha: { value: 1.0 },
        uFresnelPow: { value: 3.2 },
        uGlow: { value: 1.85 },
        uHueShiftSpeed: { value: 0.02 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        uniform float uTime, uHue, uAlpha, uFresnelPow, uGlow, uHueShiftSpeed;

        vec3 hsl2rgb(vec3 hsl) {
          vec3 rgb = clamp(abs(mod(hsl.x*6.0 + vec3(0,4,2), 6.0)-3.0)-1.0, 0.0, 1.0);
          return hsl.z + hsl.y*(rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
        }

        void main() {
          float t = uTime;
          float hue = mod(uHue + uHueShiftSpeed * t, 1.0);
          float fres = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uFresnelPow);

          // Simplified color calculation without noise
          float sat = 0.9;
          float lig = 0.55 + 0.16 * sin(t * 1.1);

          vec3 base = hsl2rgb(vec3(hue, sat, lig));
          vec3 color = base + uGlow * fres * vec3(1.0, 0.95, 1.2);

          gl_FragColor = vec4(color, uAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }
}
extend({ NeonGlowMaterial });

function NeonMat({ hue = 0.65, hueSpeed = 0.02, fresnel = 3.2, glow = 1.85, alpha = 1 }) {
  const materialRef = useRef<NeonGlowMaterial | THREE.MeshStandardMaterial | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  // Create material only once
  useMemo(() => {
    try {
      materialRef.current = new NeonGlowMaterial();
    } catch (error) {
      console.warn('NeonGlowMaterial failed, using fallback:', error);
      setUseFallback(true);
      materialRef.current = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        emissive: new THREE.Color().setHSL(hue, 0.5, 0.2),
        transparent: true,
        opacity: alpha,
      });
    }
    return materialRef.current;
  }, [hue, alpha]);
  
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const t = state.clock.getElapsedTime();
    if (!useFallback && materialRef.current instanceof NeonGlowMaterial) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uHue.value = hue;
      materialRef.current.uniforms.uHueShiftSpeed.value = hueSpeed;
      materialRef.current.uniforms.uFresnelPow.value = fresnel;
      materialRef.current.uniforms.uGlow.value = glow;
      materialRef.current.uniforms.uAlpha.value = alpha;
    } else if (useFallback && materialRef.current instanceof THREE.MeshStandardMaterial) {
      const animatedHue = (hue + hueSpeed * t) % 1;
      materialRef.current.color.setHSL(animatedHue, 0.8, 0.6);
      materialRef.current.emissive.setHSL(animatedHue, 0.5, 0.2);
    }
  });

  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose();
      }
    };
  }, []);
  
  return materialRef.current ? <primitive object={materialRef.current} /> : null;
}

// Utility
function randDir() {
  const a = Math.random() * Math.PI * 2;
  return new THREE.Vector2(Math.cos(a), Math.sin(a));
}

// Optimized wrap-around motion
function useWrapMotionWithInertia(ref: React.MutableRefObject<THREE.Object3D | null>, opts?: {
  z?: number;
  speedMin?: number;
  speedMax?: number;
  rotSpeedMin?: number;
  rotSpeedMax?: number;
  scale?: number;
  externalDirRef?: React.MutableRefObject<THREE.Vector2>;
}) {
  const {
    z = -1.5,
    speedMin = 0.012,
    speedMax = 0.035,
    rotSpeedMin = 0.12,
    rotSpeedMax = 0.28,
    scale = 1,
    externalDirRef,
  } = opts || {};

  const dir = useRef(randDir());
  const speed = useRef(THREE.MathUtils.lerp(speedMin, speedMax, Math.random()));
  const rot = useRef({
    x: THREE.MathUtils.lerp(rotSpeedMin, rotSpeedMax, Math.random()) * (Math.random() < 0.5 ? -1 : 1),
    y: THREE.MathUtils.lerp(rotSpeedMin, rotSpeedMax, Math.random()) * (Math.random() < 0.5 ? -1 : 1),
  });
  const driftTimer = useRef(0);
  const bounds = useRef({ halfW: 0, halfH: 0 });

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Cache viewport bounds calculation
    if (bounds.current.halfW === 0) {
      const { width, height } = state.viewport;
      let depthScale = 1;
      if ((state.camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const camZ = state.camera.position.z;
        const distAt0 = Math.abs(camZ - 0);
        const distAtZ = Math.abs(camZ - z);
        depthScale = distAtZ / distAt0;
      }
      bounds.current.halfW = (width * depthScale) / 2 + 0.7;
      bounds.current.halfH = (height * depthScale) / 2 + 0.7;
    }

    // External direction from drag release
    if (externalDirRef?.current && externalDirRef.current.lengthSq() > 0.0001) {
      dir.current.copy(externalDirRef.current).normalize();
      externalDirRef.current.multiplyScalar(0.96);
      if (externalDirRef.current.length() < 0.02) externalDirRef.current.set(0, 0);
    }

    driftTimer.current += delta;
    if (driftTimer.current > 2.4 + Math.random() * 1.8) {
      driftTimer.current = 0;
      dir.current.add(randDir().multiplyScalar(0.2)).normalize();
      speed.current = THREE.MathUtils.clamp(
        speed.current + (Math.random() - 0.5) * 0.01,
        speedMin,
        speedMax
      );
    }

    ref.current.position.x += dir.current.x * speed.current;
    ref.current.position.y += dir.current.y * speed.current;

    ref.current.rotation.x += rot.current.x * delta;
    ref.current.rotation.y += rot.current.y * delta;

    const { halfW, halfH } = bounds.current;
    if (ref.current.position.x > halfW) ref.current.position.x = -halfW;
    else if (ref.current.position.x < -halfW) ref.current.position.x = halfW;
    if (ref.current.position.y > halfH) ref.current.position.y = -halfH;
    else if (ref.current.position.y < -halfH) ref.current.position.y = halfH;

    ref.current.position.z = z;
    ref.current.scale.setScalar(scale);
  });
}

// Optimized raycast drag controller with throttling
function useDragControl() {
  const { camera, gl, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragging = useRef<THREE.Object3D | null>(null);
  const lastPos = useRef(new THREE.Vector3());
  const deltaDir = useRef(new THREE.Vector2(0, 0));
  const draggableObjects = useRef<THREE.Object3D[]>([]);

  // Cache draggable objects
  useEffect(() => {
    const collectDraggable = () => {
      draggableObjects.current = [];
      scene.traverse((obj) => {
        if (obj.userData.draggable) {
          draggableObjects.current.push(obj);
        }
      });
    };
    collectDraggable();
    const interval = setInterval(collectDraggable, 1000);
    return () => clearInterval(interval);
  }, [scene]);

  const planeZ = -1.5;

  const toWorldOnPlane = useCallback((clientX: number, clientY: number) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const ndc = new THREE.Vector3(x, y, 0.5);
    ndc.unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const t = (planeZ - camera.position.z) / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(t));
  }, [camera, gl, planeZ]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    const p = toWorldOnPlane(e.clientX, e.clientY);
    const mouseVec = new THREE.Vector2(
      ((e.clientX - gl.domElement.getBoundingClientRect().left) / gl.domElement.clientWidth) * 2 - 1,
      -((e.clientY - gl.domElement.getBoundingClientRect().top) / gl.domElement.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouseVec, camera);
    
    // Only raycast against cached draggable objects
    const intersects = raycaster.intersectObjects(draggableObjects.current, false);
    if (intersects.length > 0) {
      const target = intersects[0].object.userData.draggableRoot || intersects[0].object;
      dragging.current = target;
      lastPos.current.copy(p);
      deltaDir.current.set(0, 0);
      gl.domElement.style.cursor = "grabbing";
    }
  }, [camera, gl, raycaster, toWorldOnPlane]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const p = toWorldOnPlane(e.clientX, e.clientY);
    const dx = p.x - lastPos.current.x;
    const dy = p.y - lastPos.current.y;
    if ('position' in dragging.current) {
      dragging.current.position.x += dx;
      dragging.current.position.y += dy;
    }
    deltaDir.current.lerp(new THREE.Vector2(dx, dy), 0.6);
    lastPos.current.copy(p);
  }, [toWorldOnPlane]);

  const onPointerUp = useCallback(() => {
    if (dragging.current) {
      gl.domElement.style.cursor = "default";
    }
    dragging.current = null;
  }, [gl]);

  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp]);

  return { deltaDir };
}

// Optimized shapes with lower polygon count
function DraggableSphere({ hueDeg = 210, z = -1.5 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const externalDirRef = useRef(new THREE.Vector2(0, 0));
  const { deltaDir } = useDragControl();

  useFrame(() => {
    if (deltaDir.current && (Math.abs(deltaDir.current.x) + Math.abs(deltaDir.current.y) > 0.0001)) {
      externalDirRef.current.copy(deltaDir.current);
    }
  });

  useWrapMotionWithInertia(meshRef, {
    z,
    scale: 1.2,
    speedMin: 0.012,
    speedMax: 0.03,
    externalDirRef,
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.draggable = true;
      meshRef.current.userData.draggableRoot = meshRef.current;
    }
  }, []);

  return (
    <mesh ref={meshRef} position={[-2.0, 0.5, z]}>
      {/* Reduced from 64x64 to 32x32 - significant performance gain */}
      <sphereGeometry args={[1.0, 32, 32]} />
      <NeonMat hue={(hueDeg % 360) / 360} hueSpeed={0.02} fresnel={3.3} glow={1.95} />
    </mesh>
  );
}

function DraggableCube({ hueDeg = 325, z = -1.5 }) {
  const groupRef = useRef<THREE.Group>(null);
  const externalDirRef = useRef(new THREE.Vector2(0, 0));
  const { deltaDir } = useDragControl();

  useFrame(() => {
    if (deltaDir.current && (Math.abs(deltaDir.current.x) + Math.abs(deltaDir.current.y) > 0.0001)) {
      externalDirRef.current.copy(deltaDir.current);
    }
  });

  useWrapMotionWithInertia(groupRef, {
    z,
    scale: 1.2,
    speedMin: 0.012,
    speedMax: 0.03,
    externalDirRef,
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.draggable = true;
      groupRef.current.userData.draggableRoot = groupRef.current;
    }
  }, []);

  return (
    <group ref={groupRef} position={[2.0, -0.5, z]}>
      {/* Reduced smoothness from 10 to 6 */}
      <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.2} smoothness={6}>
        <NeonMat hue={(hueDeg % 360) / 360} hueSpeed={0.02} fresnel={3.1} glow={1.9} />
      </RoundedBox>
    </group>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const warpRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cssRef = useRef<HTMLStyleElement | null>(null);
  const mm = useMemo(() => gsap.matchMedia(), []);

  // Inject CSS once
  useEffect(() => {
    if (!cssRef.current) {
      const tag = document.createElement("style");
      tag.innerHTML = gridCSS;
      document.head.appendChild(tag);
      cssRef.current = tag;
    }
    return () => {
      if (cssRef.current) {
        cssRef.current.remove();
        cssRef.current = null;
      }
    };
  }, []);

  // Optimized grid animation with reduced frequency
  useLayoutEffect(() => {
    if (!rootRef.current || !gridRef.current) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduce) {
        // Slower, less frequent animation
        gsap.to(gridRef.current, {
          backgroundPosition: "40px 40px, 40px 40px, 0% 0%",
          duration: 25, // Increased from 18
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      if (warpRef.current) {
        const warp = warpRef.current;
        gsap.set(warp, { transformPerspective: 900, transformOrigin: "50% 30%" });
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top+=45%",
          scrub: 1, // Added scrub smoothing
          onUpdate: (self) => {
            const p = self.progress;
            const rotateX = gsap.utils.mapRange(0, 1, 0, 7.5)(p);
            const skewY = gsap.utils.mapRange(0, 1, 0, -2.5)(p);
            const scale = gsap.utils.mapRange(0, 1, 1, 1.035)(p);
            gsap.set(warp, { rotateX, skewY, scale }); // Changed to gsap.set for instant updates
          },
        });
      }
    }, rootRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [mm]);

  // Content entrance
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current.querySelector(".hero-content");
    if (!el) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(el, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, delay: 0.15 });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={rootRef} id="hero" className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
      {/* Grid + runway */}
      <div ref={warpRef} className="absolute inset-0 will-change-transform">
        <div ref={gridRef} className="hero-grid absolute inset-0 pointer-events-none" />
      </div>

      {/* 3D scene with optimized settings */}
      <div className="absolute inset-0">
        <Canvas 
          camera={{ position: [0, 0, 5.5], fov: 56 }} 
          dpr={Math.min(window.devicePixelRatio, 2)} // Cap DPR at 2
          gl={{ 
            antialias: window.devicePixelRatio <= 2, // Disable AA on high DPI
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          frameloop="always" // Can change to "demand" if no continuous animation needed
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, 2]} intensity={0.3} color="#4fc3f7" />
          
          <DraggableSphere hueDeg={210} z={-1.5} />
          <DraggableCube hueDeg={325} z={-1.5} />

          {/* Optimized Bloom settings */}
          <EffectComposer multisampling={0}>
            <Bloom 
              intensity={1.15} // Reduced from 1.25
              luminanceThreshold={0.2} // Increased from 0.18
              radius={0.8} // Reduced from 0.9
              mipmapBlur // Enable for better performance
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Foreground content */}
      <div className="relative hero-content z-10 flex min-h-[100svh] items-center justify-center px-6">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-semibold tracking-tight">
            Rupak Chatterjee
          </h1>
          <p className="mt-6 text-gray-300 text-2xl md:text-3xl font-medium">
            Electrical Engineering Student, Developer & Tech Enthusiast
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#contact" className="px-8 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform">
              Contact Me
            </a>
            <a href="/Resume.pdf" target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full border border-white/30 hover:bg-white/10 transition-colors">
              My Resume
            </a>
          </div>

          <div className="hero-social mt-8 flex items-center justify-center gap-6 text-gray-400 text-2xl">
            <a href="https://github.com/Rupakrc9776" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/rupak-chatterjee-293bba2a6/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://x.com/RupakRC97" target="_blank" rel="noreferrer" aria-label="Twitter" title="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400/60 flex items-start justify-center p-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
        </div>
        <span className="text-xs text-gray-400">Scroll</span>
      </div>
    </section>
  );
}
