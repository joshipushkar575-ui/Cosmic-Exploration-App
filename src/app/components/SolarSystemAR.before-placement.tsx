import { Canvas } from '@react-three/fiber';
import { XR, createXRStore, useXRHitTest } from '@react-three/xr';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import type { PlanetViewModel } from './ExplorerScreen';

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


function ARHitTest() {
  const reticleRef = useRef<THREE.Mesh>(null);

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (reticleRef.current === null || results.length === 0) {
        if (reticleRef.current !== null) reticleRef.current.visible = false;
        return;
      }

      const matrix = new THREE.Matrix4();
      getWorldMatrix(matrix);
      reticleRef.current.visible = true;
      reticleRef.current.matrixAutoUpdate = false;
      reticleRef.current.matrix.copy(matrix);
    },
    "viewer"
  );

  return (
    <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.08, 0.12, 32]} />
      <meshBasicMaterial color="#00ffcc" transparent opacity={0.9} />
    </mesh>
  );
}

function LiveSolarSystemScene({ planets, onSelectPlanet }: { planets: PlanetViewModel[]; onSelectPlanet: (planet: PlanetViewModel) => void }) {
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

      {planets.map((planet) => {
        const angle = (planet.currentPosition * Math.PI) / 180;

        // Compressed visual scale: real AU distances are too large for AR.
        const visualDistance =
          1.2 + Math.log10(Math.max(0.3, planet.distanceFromSun)) * 2.5;

        const visualRadius = Math.max(
          0.06,
          Math.min(0.42, planet.size / 90)
        );

        return (
          <group key={planet.name}>
            <mesh
              onClick={() => onSelectPlanet(planet)}
              position={[
                Math.cos(angle) * visualDistance,
                0,
                Math.sin(angle) * visualDistance,
              ]}
            >
              <sphereGeometry args={[visualRadius, 32, 32]} />
              <meshStandardMaterial
                color={planet.color}
                roughness={0.8}
              />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[
                  visualDistance - 0.01,
                  visualDistance + 0.01,
                  128,
                ]}
              />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.12}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
        })}

      <OrbitControls
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
}

export function SolarSystemAR({ planets = [] }: { planets?: PlanetViewModel[] }) {
  const [arMessage, setArMessage] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetViewModel | null>(null);

  const handleEnterAR = async () => {
    if (!navigator.xr) {
      setArMessage('AR is not supported in this browser/device.');
      return;
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');

      if (!supported) {
        setArMessage('Immersive AR is not available on this device.');
        return;
      }

      await xrStore.enterAR();
    } catch (error) {
      console.error('Failed to start AR session:', error);
      setArMessage('Could not start AR. Please check WebXR support.');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-black">
      <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
        <XR store={xrStore}>
          <ARHitTest />
          {planets.length > 0 ? <LiveSolarSystemScene planets={planets} onSelectPlanet={setSelectedPlanet} /> : <SolarSystemScene />}

        </XR>
      </Canvas>

      <button
        type="button"
        onClick={handleEnterAR}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-lg hover:bg-gray-200"
      >
        Enter AR
      </button>

      {selectedPlanet && (
        <div className="absolute top-6 left-1/2 z-10 w-[90%] max-w-md -translate-x-1/2 rounded-2xl bg-black/80 px-5 py-4 text-white backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">{selectedPlanet.name}</h3>
              <p className="text-xs text-white/60">Live astronomical data</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPlanet(null)}
              className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">Sun distance</span><br />
              {selectedPlanet.distanceFromSun.toFixed(3)} AU
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">Earth distance</span><br />
              {selectedPlanet.distanceFromEarth}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">Magnitude</span><br />
              {selectedPlanet.magnitude}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">Constellation</span><br />
              {selectedPlanet.constellation}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">Moons</span><br />
              {selectedPlanet.moons}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">Diameter</span><br />
              {selectedPlanet.realSize.toLocaleString()} km
            </div>
          </div>
        </div>
      )}

      {arMessage && (
        <div className="absolute bottom-20 left-1/2 z-10 w-[90%] max-w-md -translate-x-1/2 rounded-xl bg-black/80 px-4 py-3 text-center text-sm text-white">
          {arMessage}
        </div>
      )}
    </div>
  );
}
