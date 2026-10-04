import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

export interface ServiceItem {
  id: string;
  title: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface ServicesOrbit3DProps {
  services: ServiceItem[];
  radius?: number;
  rotationSpeed?: number;
  className?: string;
}





const Orbit: React.FC<{ services: ServiceItem[]; radius: number; rotationSpeed: number }> = ({ services, radius, rotationSpeed }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * rotationSpeed;
  });
  const isSmall = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  const positions = useMemo(() => {
    const angleStep = (Math.PI * 2) / services.length;
    return services.map((_, i) => {
      const a = i * angleStep;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      return new THREE.Vector3(x, 0, z);
    });
  }, [services, radius]);
  return (
    <group ref={groupRef}>
      {services.map((s, i) => (
        <Float key={s.id} speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
          <group position={positions[i]} rotation={[0, -Math.atan2(positions[i].z, positions[i].x) + Math.PI / 2, 0]}>
            {/* Slimmer thick disk */}
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}> 
              <cylinderGeometry args={[0.95, 0.95, 0.12, 48]} />
              <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.25} />
            </mesh>
            {/* Rim highlight adjusted */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.95, 0.03, 16, 64]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.15} metalness={0.4} roughness={0.3} />
            </mesh>
            <Html center distanceFactor={isSmall ? 9 : 7}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                <s.Icon size={isSmall ? 18 : 20} className="text-orange-600" />
                <div style={{ fontWeight: 700, color: '#111827', marginTop: 4, fontSize: isSmall ? 12 : 13, textAlign: 'center', maxWidth: 110 }}>{s.title}</div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  );
};

const ServicesOrbit3D: React.FC<ServicesOrbit3DProps> = ({ services, radius = 4, rotationSpeed = 0.22, className }) => {
  return (
    <div className={className} style={{ height: 380, position: 'relative', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 2.2, 8.5], fov: 50 }} dpr={[1, 1.2]} gl={{ antialias: true, alpha: true }} shadows>
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 6, 4]} intensity={1.0} castShadow />
        <directionalLight position={[-4, 3, -2]} intensity={0.4} />
        <Orbit services={services} radius={radius} rotationSpeed={rotationSpeed} />
      </Canvas>
    </div>
  );
};

export default ServicesOrbit3D;
