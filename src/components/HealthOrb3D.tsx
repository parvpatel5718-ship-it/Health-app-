import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HealthOrb3DProps {
  hydrationPercent?: number;
  heartRate?: number;
  energyStatus?: string;
}

export default function HealthOrb3D({
  hydrationPercent = 72,
  heartRate = 68,
  energyStatus = 'Optimal'
}: HealthOrb3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isExpanded) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 230;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 2.5, 20);
    pointLight1.position.set(4, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 2.5, 20);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x8b5cf6, 2.0, 15);
    pointLight3.position.set(0, 4, -2);
    scene.add(pointLight3);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Pulsing Vital Heart / Nucleus
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      specular: 0x34d399,
      shininess: 90,
      transparent: true,
      opacity: 0.92
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Translucent Bio-Energy Outer Sphere (Wireframe aura)
    const wireGeo = new THREE.IcosahedronGeometry(1.65, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 3. Orbital Biometric Vital Rings
    function createRing(radius: number, tube: number, colorHex: number, rotX: number, rotY: number) {
      const geom = new THREE.TorusGeometry(radius, tube, 16, 80);
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = rotX;
      mesh.rotation.y = rotY;
      return mesh;
    }

    const ringHydration = createRing(2.1, 0.05, 0x0284c7, Math.PI / 3, 0.4);
    const ringRecovery = createRing(2.4, 0.045, 0x10b981, -Math.PI / 4, 0.8);
    const ringActivity = createRing(2.7, 0.04, 0xf59e0b, Math.PI / 6, -0.6);

    mainGroup.add(ringHydration);
    mainGroup.add(ringRecovery);
    mainGroup.add(ringActivity);

    // 4. Floating Data Nodes / Particles
    const particleCount = 70;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pPos[i] = r * Math.cos(phi) * Math.cos(theta);
      pPos[i + 1] = r * Math.sin(phi);
      pPos[i + 2] = r * Math.cos(phi) * Math.sin(theta);
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xa7f3d0,
      size: 0.09,
      transparent: true,
      opacity: 0.85
    });
    const particles = new THREE.Points(pGeom, pMat);
    mainGroup.add(particles);

    // Interaction handlers
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const rect = container.getBoundingClientRect();
      mouseX = ((clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      mouseY = -(((clientY - rect.top) / (rect.height || 1)) * 2 - 1);

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        mainGroup.rotation.y += deltaX * 0.01;
        mainGroup.rotation.x += deltaY * 0.01;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevMouseX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      prevMouseY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Pulsing heartbeat rhythm
      const pulseRate = heartRate ? heartRate / 60 : 1.13;
      const pulse = 1 + Math.sin(t * pulseRate * 3.5) * 0.07 + Math.sin(t * pulseRate * 7.0) * 0.025;
      coreMesh.scale.set(pulse, pulse, pulse);

      wireMesh.rotation.y = t * 0.25;
      wireMesh.rotation.x = t * 0.15;

      ringHydration.rotation.z = t * 0.4;
      ringRecovery.rotation.z = -t * 0.35;
      ringActivity.rotation.x = Math.PI / 6 + Math.sin(t * 0.5) * 0.2;
      ringActivity.rotation.y = -0.6 + t * 0.3;

      particles.rotation.y = -t * 0.12;

      // Gentle floating oscillation
      mainGroup.position.y = Math.sin(t * 1.5) * 0.12;

      if (!isDragging) {
        targetRotY = mouseX * 0.6;
        targetRotX = -mouseY * 0.4;
        mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.04;
        mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 360;
      const newH = container.clientHeight || 230;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      pGeom.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isExpanded, heartRate]);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#06101e] via-[#091522] to-[#040911] border border-cyan-500/20 shadow-xl shadow-cyan-950/30 text-white">
      {/* Header bar within 3D widget */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-1 relative z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
            3D Interactive Health Core
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            Touch to Rotate
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
            title={isExpanded ? "Collapse 3D Core" : "Expand 3D Core"}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      {isExpanded && (
        <div
          ref={containerRef}
          className="w-full h-52 sm:h-56 relative cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Decorative ambient radial glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      )}

      {/* Bottom Mini Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 px-3 pb-3 relative z-20">
        <div className="bg-white/5 border border-cyan-400/20 rounded-2xl p-2.5 text-center backdrop-blur-md">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-cyan-300/80">
            Hydration
          </span>
          <span className="font-extrabold text-[15px] text-cyan-200 mt-0.5 inline-flex items-center gap-0.5">
            {hydrationPercent}% <span className="text-emerald-400 text-xs">↑</span>
          </span>
        </div>
        <div className="bg-white/5 border border-emerald-400/20 rounded-2xl p-2.5 text-center backdrop-blur-md">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-300/80">
            Heart Pulse
          </span>
          <span className="font-extrabold text-[15px] text-emerald-200 mt-0.5 inline-flex items-center gap-1">
            {heartRate} <span className="text-[10px] font-normal text-slate-300">BPM</span>
          </span>
        </div>
        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-2.5 text-center backdrop-blur-md">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-300/80">
            Energy
          </span>
          <span className="font-extrabold text-[14px] text-amber-200 mt-0.5 block truncate">
            {energyStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
