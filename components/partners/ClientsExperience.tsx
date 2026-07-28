"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clients } from "@/data/clients";
import GalaxyAnimationOrbit from "../3d/GalaxyOrbitExperience";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

// ─── Galaxy Orbit Configuration ───
const ORBIT_RADIUS_X = 340;
const ORBIT_RADIUS_Z = 220;
const ORBIT_RADIUS_Y = 70;
const LOOPS = 2.2;
const TILT_ANGLE = 0.3;
const EASING = 0.055;

export function ClientsExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollProgress = useRef(0);
  const currentRotation = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActive = useRef(0);
  const total = clients.length;

  const { language, t } = useLanguage();
  const pp = t.partners;

  // Scroll Trigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Galaxy Animation
  useEffect(() => {
    const tick = () => {
      const targetRotation = scrollProgress.current * Math.PI * 2 * LOOPS;
      currentRotation.current +=
        (targetRotation - currentRotation.current) * EASING;

      if (bgRef.current) {
        const scale = 1.05 + scrollProgress.current * 0.18;
        const translateY = scrollProgress.current * -45;
        bgRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
      }

      let frontIndex = 0;
      let maxDepth = -Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        const phaseOffset = (i / total) * Math.PI * 2;
        const angle = currentRotation.current + phaseOffset;

        const rawX = Math.sin(angle) * ORBIT_RADIUS_X;
        const rawZ = Math.cos(angle) * ORBIT_RADIUS_Z;
        const rawY = Math.sin(i * 1.618) * ORBIT_RADIUS_Y;

        const tiltedY =
          rawY * Math.cos(TILT_ANGLE) - rawZ * Math.sin(TILT_ANGLE);
        const tiltedZ =
          rawY * Math.sin(TILT_ANGLE) + rawZ * Math.cos(TILT_ANGLE);

        const depth = tiltedZ;
        const normalizedDepth =
          (depth + ORBIT_RADIUS_Z) / (ORBIT_RADIUS_Z * 2);

        const scaleCard = 0.48 + normalizedDepth * 0.62;
        const opacity = 0.22 + normalizedDepth * 0.78;
        const blur = (1 - normalizedDepth) * 4.5;
        const rotateY = Math.sin(angle) * -22;
        const rotateX = Math.cos(angle) * 12;

        if (depth > maxDepth) {
          maxDepth = depth;
          frontIndex = i;
        }

        el.style.transform = `
          translate3d(${rawX}px, ${tiltedY}px, ${tiltedZ}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
          scale(${scaleCard})
        `;
        el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        el.style.filter = `blur(${blur}px)`;
        el.style.zIndex = String(Math.round(normalizedDepth * 100));
      });

      if (lastActive.current !== frontIndex) {
        lastActive.current = frontIndex;
        setActiveIndex(frontIndex);
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [total]);

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${Math.max(total * 70, 400)}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-50">
        {/* Animated Galaxy Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform opacity-50"
          style={{
            backgroundImage: "url('/images/partners-globe.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Star Field */}
        <div className="absolute inset-0 pointer-events-none">
          <StarField />
        </div>
        <GalaxyAnimationOrbit
          particleCount={1000}
          starColor="#e6eff1"
          orbitRadius={600}
        />

        {/* Galaxy Cards */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              width: 0,
              height: 0,
              transform: `rotateX(${TILT_ANGLE * (180 / Math.PI)}deg)`,
            }}
          >
            {clients.map((client, i) => (
              <div
                key={client.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`
                  absolute -translate-x-1/2 -translate-y-1/2 w-[260px] h-[160px] rounded-2xl
                  bg-[#000000]/90 bg-transparent backdrop-blur-xl border border-white/40
                  shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.5)]
                  flex items-center justify-center p-6 transition-shadow duration-500
                  ${
                    i === activeIndex
                      ? "shadow-[0_12px_48px_rgba(16,185,129,0.25),0_0_0_1px_rgba(16,185,129,0.3)]"
                      : ""
                  }
                `}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
                {i === activeIndex && (
                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-20">
          <div className="container-x pt-16 md:pt-20 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">
              {pp.clientsTitle[language]}
            </h2>

            <p className="mt-3 max-w-2xl text-base md:text-lg  text-[#00c050]">
              {pp.clientsSubtitle[language]}
            </p>
          </div>
        </div>

        {/* Active Client Info & Dots */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none z-20">
          <div className="flex gap-2 items-center">
            {clients.map((_, i) => {
              const dist = Math.abs(i - activeIndex);
              const isNear = dist <= 2;
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-10 h-2.5 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : isNear
                      ? "w-2.5 h-2.5 bg-emerald-300/60"
                      : "w-1.5 h-1.5 bg-zinc-300/40"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/90 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      speed: 0.005 + Math.random() * 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${Math.abs(star.alpha) * 0.6})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}