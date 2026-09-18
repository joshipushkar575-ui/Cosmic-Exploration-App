import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const xrStore = createXRStore();

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.65, 64, 64]} />
      <meshStandardMaterial
        color="#ffb300"
        emissive="#ff7b00"
        emissiveIntensity={3}
        roughness={0.8}
      />
      <pointLight intensity={8} distance={20} color="#ffd27a" />
    </mesh>
  );
}

function Planet({
  radius,
  distance,
  color,
  speed,
}: {
  radius: number;
  distance: number;
  color: string;
  speed: number;
}) {
  const angle = useMemo(() => Math.random() * Math.PI * 2, []);

  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.01, distance + 0.01, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function SolarSystemScene() {
  return (
    <>
      <ambientLight intensity={0.15} />

      <Stars
        radius={50}
        depth={30}
        count={2500}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      <Sun />

      <Planet radius={0.08} distance={1.1} color="#9b8b7a" speed={1} />
      <Planet radius={0.12} distance={1.6} color="#d9a441" speed={0.8} />
      <Planet radius={0.14} distance={2.2} color="#4f9cff" speed={0.7} />
      <Planet radius={0.11} distance={2.8} color="#c65f42" speed={0.6} />
      <Planet radius={0.3} distance={4.0} color="#d7b98e" speed={0.45} />
      <Planet radius={0.26} distance={5.2} color="#d2b48c" speed={0.35} />
      <Planet radius={0.2} distance={6.4} color="#79c7d9" speed={0.25} />
      <Planet radius={0.19} distance={7.5} color="#4c6edb" speed={0.2} />

      <OrbitControls
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
}

export function SolarSystemAR() {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-black">
      <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
        <XR store={xrStore}>
          <SolarSystemScene />

        </XR>
      </Canvas>

      <button
        type="button"
        onClick={() => xrStore.enterAR()}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-lg hover:bg-gray-200"
      >
        Enter AR
      </button>
    </div>
  );
}
