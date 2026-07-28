"use client";

import { useEffect, useState, useCallback, ReactNode, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe2,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { BlurReveal } from "@/components/ui/TextReveal";
import { vendors } from "@/data/vendors";
import { useLanguage } from "@/context/LanguageContext";

// 3D Scene Component
export function NeuralScene() {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, lines } = useMemo(() => {
    const nodes: Array<[number, number, number]> = [];
    for (let i = 0; i < 30; i++) {
      const phi = Math.acos(-1 + (2 * i) / 30);
      const theta = Math.sqrt(30 * Math.PI) * phi;
      const r = 4;
      nodes.push([r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)]);
    }
    const pts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        if (dx * dx + dy * dy + dz * dz < 8) {
          pts.push(...nodes[i], ...nodes[j]);
        }
      }
    }
    return { nodes, lines: new Float32Array(pts) };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 6, 6]} intensity={0.9} color="#ffffff" />
      <pointLight position={[0, 0, -10]} intensity={0.3} color="#00c050" />

      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color="#00c050" metalness={0.6} roughness={0.25} />
        </mesh>
      ))}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00c050" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// Next.js-ում SSR Hydration-ից խուսափելու համար Dynamic Wrapper Canvas-ով
const NeuralCanvas = dynamic(
  () =>
    Promise.resolve(() => (
      <div className="absolute inset-0 pointer-events-none -z-10 h-full w-full">
        <Canvas camera={{ position: [2,0, 9], fov: 120 }}>
          <NeuralScene />
        </Canvas>
      </div>
    )),
  { ssr: false }
);

export function VendorsPreview() {
  const { language, t } = useLanguage();
  const vp = t.vendorsPreview;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const total = vendors.length;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total === 0) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, total, next]);

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />
      <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-200/20 blur-[120px]" />

      {/* 3D NEURAL CANVAS */}
      <NeuralCanvas />

      <div className="container-x relative z-10">
        {/* HEADER */}
        <BlurReveal>
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">{vp.eyebrow[language]}</span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {vp.mainTitle[language]}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
              {vp.mainDescription[language]}
            </p>
          </div>
        </BlurReveal>

        {/* FEATURE CARDS */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Globe2 />}
            title={vp.features.directAccess.title[language]}
            text={vp.features.directAccess.text[language]}
            badge={vp.features.badgeText[language]}
          />
          <FeatureCard
            icon={<Award />}
            title={vp.features.certifiedExperts.title[language]}
            text={vp.features.certifiedExperts.text[language]}
            badge={vp.features.badgeText[language]}
          />
          <FeatureCard
            icon={<Cpu />}
            title={vp.features.completePortfolio.title[language]}
            text={vp.features.completePortfolio.text[language]}
            badge={vp.features.badgeText[language]}
          />
        </div>

        {/* PARTNER TITLE */}
        <BlurReveal delay={0.2}>
          <div className="mt-28 text-center">
            <span className="eyebrow">{vp.partnersTitle[language]}</span>
            <h3 className="mt-5 text-3xl font-bold tracking-tight text-black md:text-5xl">
              {vp.partnersSubtitle[language]}
            </h3>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
              {vp.partnersDescription[language]}
            </p>
          </div>
        </BlurReveal>

        {/* 3D CAROUSEL */}
        <BlurReveal delay={0.3}>
          <div
            className="relative mt-16 h-[500px] md:h-[560px] overflow-hidden rounded-[32px] md:rounded-[40px] border border-zinc-200 bg-white shadow-2xl perspective-[1200px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-zinc-100" />
            <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 blur-[100px]" />

            {/* CARDS CONTAINER */}
            <div className="relative flex h-full items-center justify-center">
              {vendors.map((vendor, index) => {
                const position = (index - currentIndex + total) % total;
                const offset =
                  position > total / 2 ? position - total : position;
                const active = offset === 0;

                const xStep = isMobile ? 160 : 260;

                return (
                  <motion.div
                    key={vendor.name}
                    className="absolute h-[250px] w-[290px] sm:h-[280px] sm:w-[360px] cursor-pointer rounded-[32px]"
                    style={{
                      zIndex: active ? 50 : 30 - Math.abs(offset),
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      x: offset * xStep,
                      rotateY: offset * (isMobile ? 25 : 35),
                      scale: active
                        ? 1.08
                        : Math.max(0.65, 1 - Math.abs(offset) * 0.18),
                      opacity: active
                        ? 1
                        : Math.max(0.2, 1 - Math.abs(offset) * 0.35),
                      filter: active
                        ? "blur(0px)"
                        : `blur(${Math.abs(offset) * 1.5}px)`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 22,
                    }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-xl">
                      {/* LOGO */}
                      <div className="flex h-full items-center justify-center p-8 sm:p-12">
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-700"
                        />
                      </div>

                      {/* GLASS OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* TEXT */}
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h4 className="text-xl sm:text-2xl font-bold">
                          {vendor.name}
                        </h4>
                        <p className="mt-1 text-xs sm:text-sm text-white/70">
                          {vendor.category}
                        </p>
                      </div>

                      {/* ACTIVE GLOW */}
                      {active && (
                        <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-2 ring-emerald-400/60" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* LEFT BUTTON */}
            <button
              onClick={prev}
              aria-label="Previous Vendor"
              className="absolute left-4 md:left-8 top-1/2 flex h-12 w-12 md:h-14 md:w-14 -translate-y-1/2 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-lg transition hover:-translate-x-1 hover:shadow-xl z-50"
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={next}
              aria-label="Next Vendor"
              className="absolute right-4 md:right-8 top-1/2 flex h-12 w-12 md:h-14 md:w-14 -translate-y-1/2 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-lg transition hover:translate-x-1 hover:shadow-xl z-50"
            >
              <ArrowRight className="h-5 w-5 text-black" />
            </button>

            {/* DOTS */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-50">
              {vendors.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-8 md:w-10 bg-emerald-500"
                      : "w-2 bg-zinc-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </BlurReveal>

        {/* CTA */}
        <BlurReveal delay={0.5}>
          <div className="mt-20 rounded-[32px] md:rounded-[40px] bg-black px-8 py-14 text-center text-white md:px-16">
            <h3 className="text-3xl font-bold md:text-5xl">
              {vp.cta.title[language]}
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
              {vp.cta.description[language]}
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black transition hover:scale-105"
            >
              {vp.cta.button[language]}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}

// FEATURE CARD COMPONENT
function FeatureCard({
  icon,
  title,
  text,
  badge,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  badge: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h4 className="mt-6 text-xl font-bold text-black">{title}</h4>

      <p className="mt-4 leading-7 text-zinc-600">{text}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        {badge}
      </div>
    </motion.div>
  );
}