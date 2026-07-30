"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import { clients } from "@/data/clients";
import { useLanguage } from "@/context/LanguageContext";

// ─── Galaxy Orbit Configuration ───
const ORBIT_RADIUS_X = 520;
const ORBIT_RADIUS_Z = 340;
const ORBIT_RADIUS_Y = 90;
const TILT_ANGLE = 0.25;
const AUTO_ROTATE_SPEED = 0.015; // Ավելի սահուն և հարթ պտույտ

export function ClientsExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentRotation = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActive = useRef(0);
  const total = clients.length;

  const { language, t } = useLanguage();
  const pp = t.partners;

  // ─── Three.js 3D Ֆոնային էֆեկտ ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    const spheres: THREE.Mesh[] = [];
    let animationFrameId: number;

    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = (container.clientWidth || window.innerWidth) / 2;
    let windowHalfY = (container.clientHeight || 750) / 2;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100);
    camera.position.z = 3;

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 3, 50);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const secondLight = new THREE.PointLight(0x38bdf8, 2, 50);
    secondLight.position.set(-2, -2, 2);
    scene.add(secondLight);

    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.85,
    });

    for (let i = 0; i < 150; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 10 - 5;
      mesh.position.y = Math.random() * 10 - 5;
      mesh.position.z = Math.random() * 10 - 5;
      mesh.scale.setScalar(Math.random() * 1.5 + 0.5);
      scene.add(mesh);
      spheres.push(mesh);
    }

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Սահմանափակում ենք Pixel Ratio-ն, որպեսզի ծանր չլինի վեբ կայքի համար
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const onDocumentMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;
      mouseX = (clientX - windowHalfX) / 100;
      mouseY = (clientY - windowHalfY) / 100;
    };

    container.addEventListener("mousemove", onDocumentMouseMove);

    const animateThree = () => {
      animationFrameId = requestAnimationFrame(animateThree);
      const timer = 0.0001 * Date.now();

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      for (let i = 0, il = spheres.length; i < il; i++) {
        const sphere = spheres[i];
        sphere.position.x = 5 * Math.cos(timer + i);
        sphere.position.y = 5 * Math.sin(timer + i * 1.1);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };

    animateThree();

    const handleResize = () => {
      if (!container) return;
      windowHalfX = container.clientWidth / 2;
      windowHalfY = container.clientHeight / 2;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousemove", onDocumentMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // ─── Քարտերի պտտման անիմացիա ───
  useEffect(() => {
    const bgTween = gsap.to(bgRef.current, {
      scale: 1.18,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const tick = () => {
      currentRotation.current += AUTO_ROTATE_SPEED;

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

        const scaleCard = 0.52 + normalizedDepth * 0.58;
        const opacity = 0.2 + normalizedDepth * 0.8;
        const blur = (1 - normalizedDepth) * 3;
        const rotateY = Math.sin(angle) * -15;
        const rotateX = Math.cos(angle) * 8;

        if (depth > maxDepth) {
          maxDepth = depth;
          frontIndex = i;
        }

        // Հարթեցված և ճշգրիտ ձևաչափված transform՝ թրթիռից խուսափելու համար
        el.style.transform = `translate3d(${rawX}px, ${tiltedY}px, ${tiltedZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scaleCard})`;
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

    return () => {
      gsap.ticker.remove(tick);
      bgTween.kill();
    };
  }, [total]);

  return (
    <div className="relative w-full h-[650px] md:h-[750px] overflow-hidden">
      <div className="relative h-full w-full overflow-hidden bg-transparent">
        {/* Dark Background Image */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform opacity-50 pointer-events-none"
          style={{
            backgroundImage: "url('/images/20260729_2258_image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Three.js 3D Interactive Canvas */}
        <div ref={containerRef} className="absolute inset-0 z-10" />

        {/* Star Field */}
        <div className="absolute inset-0 pointer-events-none opacity-50 z-10">
          <StarField />
        </div>

        {/* Galaxy Cards Layer */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none w-full"
          style={{ perspective: "1500px" }}
        >
          <div
            className="relative pointer-events-auto"
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
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className={`
                  absolute -translate-x-1/2 -translate-y-1/2 w-[260px] h-[190px] rounded-2xl
                  bg-black/40 backdrop-blur-md border border-white/15
                  shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                  flex flex-col items-center justify-between p-3 transition-colors duration-300
                  will-change-transform
                  ${
                    i === activeIndex
                      ? "bg-black/75 shadow-[0_12px_48px_rgba(255,255,255,0.25),0_0_0_2px_rgba(255,255,255,0.9)] border-white"
                      : ""
                  }
                `}
              >
                {/* Լոգոյի տարածք՝ մեծացված և հարմարեցված (h-28) */}
                <div className="w-full h-28 flex items-center justify-center p-2 mt-1">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-full max-w-full w-auto object-contain select-none pointer-events-none block drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]"
                    draggable={false}
                    // Եթե ուզում եք, որ բոլոր լոգոները սպիտակ լինեն, բացեք ներքևի տողը՝
                    // style={{ filter: "brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                  />
                </div>

                {/* Լոգոյի անունը՝ ճիշտ դիրքավորված ներքևում */}
                <div className="w-full text-center pb-2 pt-1 mt-auto">
                  <span className="text-xs md:text-sm font-semibold tracking-wide text-white/90 truncate block px-2">
                    {client.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-30">
          <div className="container-x pt-12 md:pt-16 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              {pp.clientsTitle[language]}
            </h2>

            <p className="text-3xl md:text-5xl font-bold text-[#00c050] mt-2">
              {pp.clientsSubtitle[language]}
            </p>
          </div>
        </div>

        {/* Active Client Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none z-30">
          <div className="flex gap-2 items-center">
            {clients.map((_, i) => {
              const dist = Math.abs(i - activeIndex);
              const isNear = dist <= 2;
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? "w-10 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                      : isNear
                      ? "w-2.5 h-2.5 bg-white/50"
                      : "w-1.5 h-1.5 bg-zinc-700"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-zinc-950 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-zinc-950 to-transparent" />
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

    const stars = Array.from({ length: 120 }, () => ({
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
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha) * 0.5})`;
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