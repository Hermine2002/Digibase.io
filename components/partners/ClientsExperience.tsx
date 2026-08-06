"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { clients } from "@/data/clients";
import { useLanguage } from "@/context/LanguageContext";

const ORBIT_RADIUS = 5.6;

// ================= 3D BACKGROUND MOVING BOXES (ՔԱՌԱԿՈՒՍԻՆԵՐ) =================
function BackgroundBoxes() {
  const groupRef = useRef<THREE.Group>(null);
  
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

    groupRef.current.rotation.y = t * 0.03;

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
            wireframe={i % 2 === 0}
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
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const targetX = mouse.current.x * 1.2;
    const targetY = 3.2 + mouse.current.y * 0.8;

    camera.position.x += (targetX - camera.position.x) * delta * 3;
    camera.position.y += (targetY - camera.position.y) * delta * 3;
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

// ================= CLIENT CARD =================
function ClientAnchor({ index, client, total, orbitRef, onHover }: any) {
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
    onHover(false);
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
            onMouseEnter={() => onHover(true)}
            onMouseMove={handleMouseMoveCard}
            onMouseLeave={handleMouseLeaveCard}
            className="
              w-[160px]
              h-[105px]
              rounded-2xl
              bg-black/15
              transparent-10
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
              src={client.logo}
              alt={client.name}
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
  const [isHovered, setIsHovered] = useState(false);

  useFrame((_, delta) => {
    const speed = isHovered ? 0 : 0.15;
    orbitRef.current += delta * speed;
  });

  return (
    <>
      {clients.map((client, i) => (
        <ClientAnchor
          key={i}
          index={i}
          client={client}
          total={clients.length}
          orbitRef={orbitRef}
          onHover={setIsHovered}
        />
      ))}
    </>
  );
}

// ================= MAIN COMPONENT =================
export function ClientsExperience() {
  const { language, t } = useLanguage();
  const pp = t.partners;

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

        {/* Պտտվող Կլիենտներ */}
        <OrbitController />
      </Canvas>

      {/* Section Header */}
      <div className="absolute top-12 left-0 right-0 z-20 text-center px-6 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {pp?.clientsTitle?.[language] || "Our Trusted"} <span className="text-[#00c050]">{pp?.clientsSubtitle?.[language] || "Clients"}</span>
        </h2>
      </div>

    </div>
  );
}