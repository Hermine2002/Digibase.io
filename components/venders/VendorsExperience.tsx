"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vendors } from "@/data/vendors";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const ORBIT_RADIUS = 5.6;

// ================= VIDEO BACKGROUND =================
function VideoBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

// ================= VENDOR CARD =================
function VendorAnchor({ index, vendor, total, rotationRef }: any) {
  const groupRef = useRef<THREE.Group>(null);

  const baseAngle = (index / total) * Math.PI * 2.5;
  const baseY = Math.sin(index * 2.4) * 0.8;

  useFrame(() => {
    if (!groupRef.current) return;

    const angle = baseAngle + rotationRef.current;
    const x = Math.sin(angle) * ORBIT_RADIUS;
    const z = Math.cos(angle) * ORBIT_RADIUS * 0.88;

    groupRef.current.position.set(x, baseY, z);
  });

  return (
    <group ref={groupRef}>
      <Billboard follow={true}>
        <Html
          transform
          occlude="blending"
          distanceFactor={9}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="
            w-[160px]
            h-[105px]
            rounded-2xl
            bg-white/75
            backdrop-blur-lg
            border
            border-white/50
            shadow-2xl
            flex
            items-center
            justify-center
            p-4
            -translate-x-1/4
            -translate-y-1/2
          ">
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="
                max-h-[58px]
                max-w-[110px]
                object-contain
              "
            />
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// ================= ORBIT =================
function OrbitController({ scrollProgress }: any) {
  const rotationRef = useRef(0);

  useFrame(() => {
    const target = scrollProgress.current * Math.PI * 2 * 1.1;
    rotationRef.current += (target - rotationRef.current) * 0.09;
  });

  return (
    <>
      {vendors.map((vendor, i) => (
        <VendorAnchor
          key={i}
          index={i}
          vendor={vendor}
          total={vendors.length}
          rotationRef={rotationRef}
        />
      ))}
    </>
  );
}

// ================= CAMERA =================
function CameraController({ scrollProgress }: any) {
  const { camera } = useThree();
  const current = useRef(new THREE.Vector3(0, 3.2, 13.5));

  useFrame(() => {
    const p = scrollProgress.current;
    const target = new THREE.Vector3(0, 3.2 - p * 0.5, 13.5);
    current.current.lerp(target, 0.05);
    camera.position.copy(current.current);
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

function LoadingScreen({ loadingText }: { loadingText: string }) {
  return (
    <Html center>
      <div className="text-white">{loadingText}</div>
    </Html>
  );
}

// ================= MAIN VENDORS EXPERIENCE =================
export default function VendorsExperience() {
  const scrollProgress = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const vp = t.vendors;

  // Type casting 't' որպեսզի TypeScript-ը չբողոքի dynamic property-ներից
  const tAny = t as Record<string, any>;
  const loadingText = tAny.common?.loading?.[language] || tAny.loading?.[language] || "Loading...";

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        height: `${Math.max(vendors.length * 60, 400)}vh`
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050a0f]">
        <VideoBackground />

        <Canvas
          camera={{
            position: [0, 3.2, 13.5],
            fov: 45
          }}
          gl={{
            antialias: true,
            alpha: true
          }}
        >
          <Suspense fallback={<LoadingScreen loadingText={loadingText} />}>
            <ambientLight intensity={0.85} />
            <directionalLight position={[10, 12, 8]} intensity={0.65} />
            <pointLight position={[0, 6, 3]} intensity={0.45} color="#00c050" />

            <OrbitController scrollProgress={scrollProgress} />
            <CameraController scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>

        {/* Section Header */}
        <div className="absolute top-12 left-0 right-0 z-20 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {vp.expTitle1[language]} <span className="text-[#00c050]">{vp.expTitle2[language]}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}