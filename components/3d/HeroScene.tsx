"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Թողնում ենք transparent (alpha: true), որպեսզի էջի սպիտակ ֆոնի հետ գեղեցիկ նստի
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      1,
      5000
    );
    // Մոտեցնում ենք տեսախցիկը, որպեսզի օբյեկտները շատ մոտ և խոշոր երևան
    camera.position.set(0, 0, 800);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00c050, 8, 3000);
    pointLight.position.set(0, 0, 500);
    scene.add(pointLight);

    // 3. LOD Objects (Ավելի մեծ չափսեր՝ շատ մոտիկ և տեսանելի լինելու համար)
    const geometry: [THREE.BufferGeometry, number][] = [
      [new THREE.IcosahedronGeometry(350, 4), 100],  // Ավելի մեծ գնդեր (radius: 350)
      [new THREE.IcosahedronGeometry(350, 2), 500],
      [new THREE.IcosahedronGeometry(350, 1), 1500],
    ];

    const material = new THREE.MeshLambertMaterial({
      color: 0x00c050,
      wireframe: true,
      transparent: true,
      opacity: 0.65, // Որպեսզի շատ չմգեցնի տեքստերը
    });

    const lodGroup = new THREE.Group();

    // Կրճատել ենք քանակը մինչև 50, բայց դարձրել շատ խոշոր ու մոտիկ
    for (let j = 0; j < 50; j++) {
      const lod = new THREE.LOD();

      for (let i = 0; i < geometry.length; i++) {
        const mesh = new THREE.Mesh(geometry[i][0], material);
        lod.addLevel(mesh, geometry[i][1]);
      }

      // Դասավորում ենք ավելի մոտ տարածության վրա, որ էկրանին միշտ մեծ երևան
      lod.position.x = (Math.random() - 0.5) * 1800;
      lod.position.y = (Math.random() - 0.5) * 1800;
      lod.position.z = (Math.random() - 0.5) * 1500;
      
      lodGroup.add(lod);
    }

    scene.add(lodGroup);

    // 4. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Դանդաղ պտտում ենք ամբողջ խումբը
      lodGroup.rotation.y = elapsedTime * 0.08;
      lodGroup.rotation.x = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}