// import React, { useEffect, useRef } from 'react';

// interface GalaxyAnimationOrbitProps {
//   particleCount?: number;
//   starColor?: string;
//   orbitRadius?: number;
//   className?: string;
// }

// export const GalaxyAnimation: React.FC<GalaxyAnimationOrbitProps> = ({
//   particleCount = 500,
//   starColor = '#FFD700', // Դեղին աստղեր
//   orbitRadius = 300,
//   className = '',
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let animationFrameId: number;
//     let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
//     let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

//     let targetZoom = 2;
//     let currentZoom = 1;

//     // const handleResize = () => {
//     //   if (!canvas) return;
//     //   width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
//     //   height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
//     // };

//     // Scroll-ի ժամանակ zoom-ի հաշվարկ (մոտենալ / հեռանալ)
//     // const handleScroll = () => {
//     //   const scrollY = window.scrollY;
//     //   targetZoom = 1 + scrollY * 0.0025;
//     // };

//     // window.addEventListener('resize', handleResize);
//     // window.addEventListener('scroll', handleScroll, { passive: true });

//     // 5-թևանի աստղ նկարելու ֆունկցիա
//     const drawStar = (
//       cx: number,
//       cy: number,
//       spikes: number,
//       outerRadius: number,
//       innerRadius: number,
//       rotation: number
//     ) => {
//       let rot = (Math.PI / 2) * 3 + rotation;
//       let x = cx;
//       let y = cy;
//       const step = Math.PI / spikes;

//       ctx.beginPath();
//       ctx.moveTo(cx, cy - outerRadius);

//       for (let i = 0; i < spikes; i++) {
//         x = cx + Math.cos(rot) * outerRadius;
//         y = cy + Math.sin(rot) * outerRadius;
//         ctx.lineTo(x, y);
//         rot += step;

//         x = cx + Math.cos(rot) * innerRadius;
//         y = cy + Math.sin(rot) * innerRadius;
//         ctx.lineTo(x, y);
//         rot += step;
//       }

//       ctx.lineTo(cx, cy - outerRadius);
//       ctx.closePath();
//     };

//     // Աստղերի տվյալները
//     const particles = Array.from({ length: particleCount }, () => {
//       const angle = Math.random() * Math.PI * 2;
//       const radius = Math.random() * orbitRadius + 30;
//       return {
//         angle,
//         radius,
//         z: (Math.random() - 0.5) * 400,
//         speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
//         size: Math.random() * 3 + 2, // Աստղի չափսը
//         starRotation: Math.random() * Math.PI, // Աստղի անհատական պտույտը
//         rotationSpeed: (Math.random() - 0.5) * 0.02,
//         alpha: Math.random() * 0.7 + 0.3,
//       };
//     });

//     let rotationAngle = 0;

//     const render = () => {
//       // Լրիվ թափանցիկ մաքրում վիդեոյի համար
//       ctx.clearRect(0, 0, width, height);

//       // Lerp հարթ zoom-ի համար
//       currentZoom += (targetZoom - currentZoom) * 0.08;

//       const centerX = width / 2;
//       const centerY = height / 2;

//       rotationAngle += 0.0015;

//       particles.forEach((p) => {
//         p.angle += p.speed;
//         p.starRotation += p.rotationSpeed;

//         const currRadius = (p.radius + Math.sin(rotationAngle * 2 + p.angle) * 10) * currentZoom;
//         const x3d = Math.cos(p.angle) * currRadius;
//         const y3d = Math.sin(p.angle) * currRadius;

//         const fov = 350;
//         const scale = (fov / (fov + p.z)) * currentZoom;

//         const x2d = centerX + x3d;
//         const y2d = centerY + y3d * 0.5; // Orbit-ի թեքություն

//         const outerR = p.size * scale;
//         const innerR = outerR / 2; // Աստղի ներսի շառավիղը
//         const currentAlpha = Math.min(p.alpha * (scale * 0.8), 1);

//         if (outerR > 0 && currentAlpha > 0) {
//           ctx.fillStyle = starColor;
//           ctx.globalAlpha = currentAlpha;

//           // Դեղին փայլ (Glow)
//           ctx.shadowBlur = 8 * scale;
//           ctx.shadowColor = starColor;

//           // Նկարում ենք աստղը
//           drawStar(x2d, y2d, 5, outerR, innerR, p.starRotation);
//           ctx.fill();

//           ctx.globalAlpha = 1;
//         }
//       });

//       animationFrameId = requestAnimationFrame(render);
//     };

//     render();

//     return () => {
//     //   window.removeEventListener('resize', handleResize);
//     //   window.removeEventListener('scroll', handleScroll);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, [particleCount, starColor, orbitRadius]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className={`fixed inset-0 pointer-events-none z-10 w-full h-full ${className}`}
//     />
//   );
// };

// export default GalaxyAnimation;