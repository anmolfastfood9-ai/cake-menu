"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import Image from "next/image";

interface ThreeHeroCakeProps {
  fallbackImage: string;
  heroTitle: string;
}

export default function ThreeHeroCake({ fallbackImage, heroTitle }: ThreeHeroCakeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Drag physics state refs
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentRotationYRef = useRef<number>(0);
  const targetRotationYRef = useRef<number>(0);
  const velocityYRef = useRef<number>(0);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    velocityYRef.current = 0;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    startXRef.current = clientX;

    // Convert pixels dragged to radians rotation (max sway limit ±0.45 rad ~ ±25°)
    const sensitivity = 0.008;
    targetRotationYRef.current = Math.max(
      -0.45,
      Math.min(0.45, targetRotationYRef.current + deltaX * sensitivity)
    );
    velocityYRef.current = deltaX * sensitivity;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Check WebGL Support
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    // 3. Premium Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyGoldLight = new THREE.DirectionalLight(0xffebad, 2.2);
    keyGoldLight.position.set(3, 4, 5);
    scene.add(keyGoldLight);

    const specularShineLight = new THREE.PointLight(0xffdf80, 2.5, 6);
    specularShineLight.position.set(0, 1.5, 2.5);
    scene.add(specularShineLight);

    // 4. Interactive Master Cake 3D Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    const textureLoader = new THREE.TextureLoader();
    const cakeImageSrc = fallbackImage || "/images/user_master_hero_cake_uncut_transparent.png";

    textureLoader.load(
      cakeImageSrc,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const imgWidth = texture.image.width || 1;
        const imgHeight = texture.image.height || 1;
        const aspect = imgWidth / imgHeight;

        const planeHeight = 3.35;
        const planeWidth = planeHeight * aspect;

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.01,
          roughness: 0.25,
          metalness: 0.35,
          side: THREE.FrontSide,
        });

        const cakeMesh = new THREE.Mesh(geometry, material);
        cakeGroup.add(cakeMesh);

        setLoaded(true);
      },
      undefined,
      () => {
        setLoaded(true);
      }
    );

    // 5. Physics & Animation Loop (Interactive Turntable & Floating Levitation)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!isDraggingRef.current) {
        // Auto Turntable Idle Glide (smooth gentle wave when user is not dragging)
        const idleTarget = Math.sin(elapsedTime * 0.45) * 0.22;
        targetRotationYRef.current += (idleTarget - targetRotationYRef.current) * 0.03;
      }

      // Smooth Spring Damping Physics for Rotation
      currentRotationYRef.current += (targetRotationYRef.current - currentRotationYRef.current) * 0.1;
      cakeGroup.rotation.y = currentRotationYRef.current;

      // Floating Levitation (~5px)
      cakeGroup.position.y = Math.sin(elapsedTime * 1.1) * 0.07;

      // Subtle Breathing Scale
      const scale = 1 + Math.sin(elapsedTime * 0.8) * 0.012;
      cakeGroup.scale.set(scale, scale, 1);

      // Specular Light Sweep
      specularShineLight.position.x = Math.sin(elapsedTime * 0.6) * 2.2;
      specularShineLight.position.y = Math.cos(elapsedTime * 0.6) * 1.0 + 1.2;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [fallbackImage]);

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => e.touches[0] && handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => e.touches[0] && handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
    >
      {/* Interactive 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className={`w-full h-full ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        title="Drag or swipe left/right to rotate cake"
      />

      {/* Fallback image until WebGL texture loads */}
      {(!loaded || !webglSupported) && (
        <Image
          src={fallbackImage}
          alt={heroTitle}
          fill
          priority
          className="object-contain object-center drop-shadow-[0_20px_35px_rgba(212,175,55,0.30)] pointer-events-none"
        />
      )}
    </div>
  );
}
