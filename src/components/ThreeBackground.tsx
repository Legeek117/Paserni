import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, AdaptiveDpr, AdaptiveEvents, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingBlobProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  seed?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
}





const FloatingBlob: React.FC<FloatingBlobProps> = ({ position, color, scale = 1, seed = 0, floatIntensity = 0.6, rotationIntensity = 0.6 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + seed;
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * rotationIntensity * 0.5;
      meshRef.current.rotation.y = Math.cos(t * 0.25) * rotationIntensity * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.7) * floatIntensity * 0.25;
    }
  });
  return (
    <Float speed={1.1} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1.0, 2]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.15} toneMapped={false} />
      </mesh>
    </Float>
  );
};
interface BlobsFieldProps {
  count: number;
  palette: string[];
  floatIntensity: number;
  rotationIntensity: number;
  blobScale?: number; // 1 = default size, <1 smaller
}


const BlobsField: React.FC<BlobsFieldProps> = ({ count, palette, floatIntensity, rotationIntensity, blobScale = 1 }) => {
  const blobs = useMemo(() => {
    const items: Array<{ position: [number, number, number]; color: string; scale: number; seed: number }> = [];
    for (let i = 0; i < count; i += 1) {
      const x = (Math.random() - 0.5) * 12;
      const y = Math.random() * 2 - 0.5;
      const z = (Math.random() - 0.5) * 10 - 2;
      const base = 0.3 + Math.random() * 0.5; // reduced size range
      items.push({
        position: [x, y, z],
        color: palette[i % palette.length],
        scale: base * blobScale,
        seed: Math.random() * 10,
      });
    }
    return items;
  }, [count, palette, blobScale]);
  return (
    <group>
      {blobs.map((b, idx) => (
        <FloatingBlob key={idx} position={b.position} color={b.color} scale={b.scale} seed={b.seed} floatIntensity={floatIntensity} rotationIntensity={rotationIntensity} />
      ))}
    </group>
  );
};




const LogoBillboard: React.FC<{ textureUrl: string }> = ({ textureUrl }) => {
  const texture = useTexture(textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);
  texture.colorSpace = THREE.SRGBColorSpace;
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = Math.sin(t * 0.18) * 0.12;
      meshRef.current.rotation.x = Math.cos(t * 0.12) * 0.08;
    }
  });
  return (
    <Float speed={0.7} rotationIntensity={0.18} floatIntensity={0.35}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[3.0, 3.0]} />
        <meshBasicMaterial map={texture} transparent={true} alphaTest={0.01} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  );
};
export interface ThreeBackgroundProps {
  className?: string;
  count?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
  palette?: string[];
  textureUrl?: string;
  disableOnSmallScreens?: boolean;
}


  // When a logo is shown, reduce blob count further and scale down


const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  className,
  count = 12,
  floatIntensity = 0.8,
  rotationIntensity = 0.8,
  palette = ['#fb923c', '#f97316', '#fdba74', '#ea580c'],
  textureUrl,
  disableOnSmallScreens = true,
}) => {
  const isSmall = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  if (disableOnSmallScreens && isSmall) return null;
  const [validTextureUrl, setValidTextureUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!textureUrl) { setValidTextureUrl(null); return; }
    let cancelled = false;
    const img = new Image();
    img.onload = () => { if (!cancelled) setValidTextureUrl(textureUrl); };
    img.onerror = () => { if (!cancelled) setValidTextureUrl(null); };
    img.src = textureUrl;
    return () => { cancelled = true; };
  }, [textureUrl]);
  const baseCount = isSmall ? Math.floor(count * 0.5) : count;
  const effectiveCount = validTextureUrl ? Math.max(4, Math.floor(baseCount * 0.6)) : baseCount;
  const blobScale = validTextureUrl ? 0.7 : 1;
  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.15]} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.5} groundColor={new THREE.Color('#444')} />
        {validTextureUrl && <LogoBillboard textureUrl={validTextureUrl} />}
        <BlobsField count={effectiveCount} palette={palette} floatIntensity={floatIntensity} rotationIntensity={rotationIntensity} blobScale={blobScale} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
