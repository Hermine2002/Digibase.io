"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { vendors } from "@/data/vendors";
import { useLanguage } from "@/context/LanguageContext";

const ORBIT_RADIUS = 5.6;

// ================= 3D BACKGROUND MOVING BOXES (ՔԱՌԱԿՈՒՍԻՆԵՐ) =================
function BackgroundBoxes() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Ստեղծում ենք պատահական քառակուսիներ (տուփեր) մեկ անգամ
  const boxes = useRef(
    Array.from({ length: 40 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
      scale: 0.6 + Math.random() * 1.2,
    }))
  ).current;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    // Դանդաղ պտտում ենք ամբողջ ֆոնային խումբը
    groupRef.current.rotation.y = t * 0.03;

    // Առանձին պտտում ենք ամեն մի քառակուսի
    groupRef.current.children.forEach((child, i) => {
      const boxData = boxes[i];
      child.rotation.x += boxData.rotationSpeed.x;
      child.rotation.y += boxData.rotationSpeed.y;
    });
  });

  return (
    <group ref={groupRef}>
      {boxes.map((box, i) => (
        <mesh key={i} position={box.position} scale={box.scale}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial
            color="#00c050"
            transparent
            opacity={0.12}
            wireframe={i % 2 === 0} // Կեսը լցված, կեսը wireframe (ցանցաձև)
          />
        </mesh>
      ))}
    </group>
  );
}

// ================= MOUSE PARALLAX & CAMERA CONTROLLER =================
function SceneController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Հաշվում ենք մկնիկի դիրքը -1-ից 1 միջակայքում
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    // Մկնիկի շարժման հետևից տեսարանի/տեսախցիկի նուրբ շարժ (Parallax)
    const targetX = mouse.current.x * 1.2;
    const targetY = 3.2 + mouse.current.y * 0.8;

    camera.position.x += (targetX - camera.position.x) * delta * 3;
    camera.position.y += (targetY - camera.position.y) * delta * 3;
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

// ================= VENDOR CARD =================
function VendorAnchor({ index, vendor, total, orbitRef }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const baseAngle = (index / total) * Math.PI * 2;
  const baseY = Math.sin(index * 2.4) * 0.8;

  useFrame(() => {
    if (!groupRef.current) return;

    const angle = baseAngle + orbitRef.current;
    const x = Math.sin(angle) * ORBIT_RADIUS;
    const z = Math.cos(angle) * ORBIT_RADIUS * 0.88;

    groupRef.current.position.set(x, baseY, z);
  });

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardRef.current.style.transform = `translate(-25%, -50%) perspective(500px) rotateX(${-y * 0.15}deg) rotateY(${x * 0.15}deg) scale(1.05)`;
  };

  const handleMouseLeaveCard = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `translate(-25%, -50%) perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <group ref={groupRef}>
      <Billboard follow={true}>
        <Html
          transform
          occlude="blending"
          distanceFactor={9}
          zIndexRange={[100, 0]}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMoveCard}
            onMouseLeave={handleMouseLeaveCard}
            className="
              w-[160px]
              h-[105px]
              rounded-2xl
              bg-white/85
              backdrop-blur-xl
              border
              border-gray-200/90
              shadow-xl
              flex 
              flex-col
              items-center
              justify-center
              p-4
              -translate-x-1/4
              -translate-y-1/2
              transition-transform
              duration-200
              ease-out
              cursor-pointer
            "
          >
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="max-h-[58px] max-w-[110px] object-contain drop-shadow-sm"
            />
            
          </div>
          
        </Html>
      </Billboard>
    </group>
  );
}

// ================= ORBIT CONTROLLER =================
function OrbitController() {
  const orbitRef = useRef(0);

  useFrame((_, delta) => {
    orbitRef.current += delta * 0.15; // Պտտման արագություն
  });

  return (
    <>
      {vendors.map((vendor, i) => (
        <VendorAnchor
          key={i}
          index={i}
          vendor={vendor}
          total={vendors.length}
          orbitRef={orbitRef}
        />
      ))}
    </>
  );
}

// ================= MAIN COMPONENT =================
export default function VendorsBoxesExperience() {
  const { language, t } = useLanguage();
  const vp = t.vendors;

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F0F0F0] overflow-hidden">
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 3.2, 13.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 12, 8]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 6, 3]} intensity={0.5} color="#00c050" />

        {/* Ֆոնի շարժվող քառակուսիներ */}
        <BackgroundBoxes />

        {/* Մկնիկի շարժման (Parallax) և տեսախցիկի կառավարում */}
        <SceneController />

        {/* Պտտվող Վենդորներ */}
        <OrbitController />
      </Canvas>

      {/* Section Header */}
      <div className="absolute top-12 left-0 right-0 z-20 text-center px-6 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {vp?.expTitle1?.[language] || "Our Trusted"} <span className="text-[#00c050]">{vp?.expTitle2?.[language] || "Vendors"}</span>
        </h1>
      </div>

    </div>
  );
}