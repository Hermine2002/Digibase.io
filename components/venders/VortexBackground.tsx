"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GLOBE_RADIUS = 2.2;

function VortexCore() {
  const vortexRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const particleCount = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const t = Math.random() * Math.PI * 6;
      const radius = GLOBE_RADIUS * (0.3 + Math.random() * 0.8);
      const height = (Math.random() - 0.5) * GLOBE_RADIUS * 2.8;

      pos[i3] = radius * Math.cos(t);
      pos[i3 + 1] = height + Math.sin(t * 3) * 0.4;
      pos[i3 + 2] = radius * Math.sin(t);

      const intensity = Math.random();
      colors[i3] = 0.1 + intensity * 0.6;
      colors[i3 + 1] = 0.9 + intensity * 0.1;
      colors[i3 + 2] = 0.6 + intensity * 0.4;
    }
    return { pos, colors };
  }, []);

  useFrame((state) => {
  const t = state.clock.elapsedTime;

  if (vortexRef.current) {
    vortexRef.current.rotation.y = t * 0.22;
  }

  if (particlesRef.current) {
    particlesRef.current.rotation.y = t * 0.55;
  }

  if (ringsRef.current) {
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.y = t * (0.25 + i * 0.08);

      const material =
        (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;

      material.opacity =
        0.12 + Math.sin(t * 2 + i) * 0.06;
    });
  }
});
  return (
    <group ref={vortexRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={positions.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.027}
          vertexColors
          transparent
          opacity={0.78}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group ref={ringsRef}>
        {[1.4, 1.8, 2.3].map((r, i) => (
          <mesh key={i} rotation={[Math.PI * 0.1 * i, 0, 0]}>
            <torusGeometry args={[r, 0.035, 18, 120]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>

      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function VortexBackground() {
  return (
    <section className="relative min-h-screen bg-[#06120E] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 3.2, 13.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[10, 12, 8]} intensity={0.65} color="#f8fafc" />
          <pointLight position={[0, 6, 3]} intensity={0.45} color="#00ff88" />
          <VortexCore />
        </Canvas>
      </div>
    </section>
  );
}