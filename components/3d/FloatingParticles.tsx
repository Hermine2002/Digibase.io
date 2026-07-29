"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

interface FloatingParticlesProps {
  className?: string;
}

export function FloatingParticles({ className }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let particles: THREE.Points;
    let animationFrameId: number;

    const PARTICLE_SIZE_BASE = 24;
    const PARTICLE_SIZE_GROW = 28;
    
    let raycaster: THREE.Raycaster;
    let pointer: THREE.Vector2;
    let INTERSECTED: number | null = null;

    // --- INIT ---
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      10000
    );
    camera.position.z = 250;

    // --- ՊԱՐՏԻԿՆԵՐՈՎ ՀԱՎԱՔՎԱԾ ՄՈԴԵԼ (Ավելի փոքր չափսերով, որ կոմպակտ պտտվի տեղում) ---
    const boxGeo = new THREE.BoxGeometry(100, 100, 100, 10, 10, 10);
    boxGeo.deleteAttribute("normal");
    boxGeo.deleteAttribute("uv");
    
    let mergedGeo = BufferGeometryUtils.mergeVertices(boxGeo);
    
    const geometry = Object.assign(mergedGeo, {
      parameters: boxGeo.parameters,
    });

    const positionAttribute = geometry.getAttribute("position");
    const particleCount = positionAttribute.count;

    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Մուգ գույներ սպիտակ ֆոնի վրա հստակ երևալու համար
      color.setHSL(0.35, 0.8, 0.35);
      color.toArray(colors, i * 3);
      sizes[i] = PARTICLE_SIZE_BASE;
    }

    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));

    // --- SHADERS ---
    const vertexShader = `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      uniform float scale;

      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( scale / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord.xy - vec2(0.5);
        float dist = length(uv);
        if (dist > 0.5) discard;

        float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
        gl_FragColor = vec4( color * vColor, alpha * 0.9 );
        
        if (gl_FragColor.a < 0.01) discard;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00c050) }, // Մուգ մոխրագույն/սև պարտիկներ
        scale: { value: window.innerHeight * 0.5 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

   

// --- ԱՅՍՏԵՂ ԿԱՐՈՂ ԵՍ ՏԵՂԱՇԱՐԺԵԼ ---
particles.position.x = 90;   // Դրականը՝ աջ, բացասականը (-50)՝ ձախ
particles.position.y = -30;  // Դրականը՝ վերև, բացասականը (-20)՝ ներքև
particles.position.z = 1;    // Մոտ կամ հեռու (խորություն)

scene.add(particles);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- INTERACTION INIT ---
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 5; 
    pointer = new THREE.Vector2();

    const onPointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    container.addEventListener("pointermove", onPointerMove);
    
    const onPointerLeave = () => {
        pointer.set(-10000, -10000);
        resetIntersections();
    };
    container.addEventListener("mouseleave", onPointerLeave);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.scale.value = window.innerHeight * 0.5;
    };

    window.addEventListener("resize", handleResize);

    const resetIntersections = () => {
        if (INTERSECTED !== null) {
            const sizesArray = geometry.getAttribute('size').array as Float32Array;
            if (INTERSECTED < sizesArray.length) {
                sizesArray[INTERSECTED] = PARTICLE_SIZE_BASE;
                geometry.getAttribute('size').needsUpdate = true;
            }
            INTERSECTED = null;
        }
    };

    // --- ANIMATION LOOP ---
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Ամբողջ պարտիկներով հավաքված մոդելի պտույտը տեղում
      particles.rotation.x += 0.003;
      particles.rotation.y += 0.005;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(particles, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const index = intersect.index !== undefined ? intersect.index : null;

        if (INTERSECTED !== index) {
          const sizesArray = geometry.getAttribute('size').array as Float32Array;
          
          if (INTERSECTED !== null && INTERSECTED < sizesArray.length) {
            sizesArray[INTERSECTED] = PARTICLE_SIZE_BASE;
          }

          INTERSECTED = index;
          if (INTERSECTED !== null && INTERSECTED < sizesArray.length) {
            sizesArray[INTERSECTED] = PARTICLE_SIZE_GROW;
            geometry.getAttribute('size').needsUpdate = true;
          }
        }
      } else {
        resetIntersections();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      geometry.dispose();
      material.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
}