import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Planet3D {
  name: string;
  size: number;
  distance: number;
  texture: string;
  color: string;
  hasRings?: boolean;
}

const PLANETS: Planet3D[] = [
  {
    name: 'Mercury',
    size: 0.42,
    distance: 3.2,
    texture: '/textures/planets/mercury.jpg',
    color: '#9b8f82',
  },
  {
    name: 'Venus',
    size: 0.62,
    distance: 4.5,
    texture: '/textures/planets/venus.jpg',
    color: '#d8a15b',
  },
  {
    name: 'Earth',
    size: 0.68,
    distance: 5.9,
    texture: '/textures/planets/earth.jpg',
    color: '#4aa3df',
  },
  {
    name: 'Mars',
    size: 0.52,
    distance: 7.3,
    texture: '/textures/planets/mars.jpg',
    color: '#c65f45',
  },
  {
    name: 'Jupiter',
    size: 1.45,
    distance: 10.2,
    texture: '/textures/planets/jupiter.jpg',
    color: '#c99a6b',
  },
  {
    name: 'Saturn',
    size: 1.2,
    distance: 13.2,
    texture: '/textures/planets/saturn.jpg',
    color: '#d7c08b',
    hasRings: true,
  },
  {
    name: 'Uranus',
    size: 0.9,
    distance: 16,
    texture: '/textures/planets/uranus.jpg',
    color: '#8bd6e8',
  },
  {
    name: 'Neptune',
    size: 0.88,
    distance: 18.5,
    texture: '/textures/planets/neptune.jpg',
    color: '#4169d8',
  },
];

function Planet({ planet }: { planet: Planet3D }) {
  const texture = useTexture(planet.texture);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={[planet.distance, 0, 0]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial
  map={texture}
  roughness={0.65}
  metalness={0}
  emissive="#111111"
  emissiveIntensity={0.25}
/>
      </mesh>

      {planet.hasRings && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]} receiveShadow>
          <ringGeometry
            args={[
              planet.size * 1.45,
              planet.size * 2.35,
              128,
            ]}
          />
          <meshStandardMaterial
            color="#c7b58c"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            roughness={1}
          />
        </mesh>
      )}
    </group>
  );
}

function Sun() {
  const sunTexture = useTexture('/textures/planets/sun.jpg');
  sunTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      {/* Sun surface */}
      <mesh>
        <sphereGeometry args={[2, 96, 96]} />
        <meshBasicMaterial
          map={sunTexture}
          toneMapped={false}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#ff9d18"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Outer corona */}
      <mesh scale={1.22}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#ff6a00"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Sun illumination */}
      <pointLight
        intensity={1200}
        distance={120}
        decay={1.5}
        color="#fff3cf"
        castShadow
      />

      <pointLight
        intensity={150}
        distance={80}
        decay={1.5}
        color="#ff8c00"
      />
    </group>
  );
}

function Orbit({ radius }: { radius: number }) {
  const points = new THREE.EllipseCurve(
    0,
    0,
    radius,
    radius,
    0,
    Math.PI * 2,
    false,
    0,
  ).getPoints(256);

  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y)),
  );

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.12}
      />
    </line>
  );
}

function SolarSystemScene() {
  return (
    <>
      <color attach="background" args={['#010208']} />

      <Stars
        radius={120}
        depth={70}
        count={9000}
        factor={3}
        saturation={0}
        fade
        speed={0.15}
      />

      <ambientLight intensity={0.12} />

      <Sun />

      {PLANETS.map((planet) => (
        <Planet key={planet.name} planet={planet} />
      ))}

      {PLANETS.map((planet) => (
        <Orbit key={`orbit-${planet.name}`} radius={planet.distance} />
      ))}

      <OrbitControls
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
  minDistance={8}
  maxDistance={70}
  rotateSpeed={0.55}
  zoomSpeed={0.8}
  panSpeed={0.8}
  screenSpacePanning={true}
/>
    </>
  );
}
function loadSolarSystemCSS() {
  if (document.getElementById('solar-system-original-css')) return;

  const link = document.createElement('link');
  link.id = 'solar-system-original-css';
  link.rel = 'stylesheet';
  link.href = '/solar-system/SolarSystem3D.css';

  document.head.appendChild(link);
}
export function RealisticSolarSystem3D() {
  loadSolarSystemCSS();
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{
  position: [0, 14, 38],
  fov: 52,
  near: 0.1,
  far: 200,
}}
        dpr={[1, 2]}
      >
        <SolarSystemScene />
      </Canvas>
    </div>
  );
}
