import { Canvas } from '@react-three/fiber';
import { XR, createXRStore, useXRHitTest, useXRInputSourceEvent } from '@react-three/xr';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import type { PlanetViewModel } from './ExplorerScreen';
import { CosmicIconButton } from './CosmicIconButton';

const xrStore = createXRStore();

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[0.65, 32, 32]} />
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
        <ringGeometry args={[distance - 0.01, distance + 0.01, 64]} />
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
        count={1200}
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


function ARHitTest({ onPlace }: { onPlace: (matrix: THREE.Matrix4) => void }) {
  const reticleRef = useRef<THREE.Mesh>(null);
  const hitMatrixRef = useRef(new THREE.Matrix4());
  const hasHitRef = useRef(false);

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (reticleRef.current === null || results.length === 0) {
        if (reticleRef.current !== null) reticleRef.current.visible = false;
        return;
      }

      getWorldMatrix(hitMatrixRef.current, results[0]);
      hasHitRef.current = true;
      reticleRef.current.visible = true;
      reticleRef.current.matrixAutoUpdate = false;
      reticleRef.current.matrix.copy(hitMatrixRef.current);
    },
    "viewer"
  );

  useXRInputSourceEvent(
    "all",
    "selectend",
    () => {
      if (hasHitRef.current) {
        onPlace(hitMatrixRef.current.clone());
      }
    },
    [onPlace]
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
        count={1200}
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
              <sphereGeometry args={[visualRadius, 20, 20]} />
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
  const [placementMatrix, setPlacementMatrix] = useState<THREE.Matrix4 | null>(null);

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
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-3xl border border-white/[0.12] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_45px_rgba(34,211,238,0.08)]">
      <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
        <XR store={xrStore}>
          <ARHitTest onPlace={setPlacementMatrix} />
          <group matrix={placementMatrix ?? new THREE.Matrix4()} matrixAutoUpdate={false} visible>{planets.length > 0 ? <LiveSolarSystemScene planets={planets} onSelectPlanet={setSelectedPlanet} /> : <SolarSystemScene />}</group>

        </XR>
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-2xl border border-white/[0.12] bg-slate-950/60 px-3.5 py-2.5 text-white backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
            VYOM • AR EXPLORER
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Place the solar system in your space
        </div>
      </div>

      <button
        type="button"
        onClick={handleEnterAR}
        className="group absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-cyan-200/25 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-7 py-3.5 font-semibold text-slate-950 shadow-[0_10px_35px_rgba(34,211,238,0.24),0_0_30px_rgba(139,92,246,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_45px_rgba(34,211,238,0.32)] active:translate-y-0 active:scale-[0.98]"
      >
        Enter AR
      </button>

      {selectedPlanet && (
        <div className="absolute left-1/2 top-4 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-white/[0.14] bg-slate-950/85 px-5 py-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_35px_rgba(139,92,246,0.10)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                Planet telemetry
              </div>
              <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-white">{selectedPlanet.name}</h3>
              <p className="text-xs text-slate-500">Live astronomical data</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPlanet(null)}
              aria-label="Close planet telemetry"
              title="Close planet telemetry"
              className="group relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.045] text-white/60 shadow-[0_6px_20px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-300/[0.08] hover:text-white hover:shadow-[0_8px_24px_rgba(139,92,246,0.14)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/35"
            >
              <span className="text-base leading-none transition-transform duration-300 group-hover:rotate-90">✕</span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all duration-300 hover:bg-white/[0.06]">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Sun distance</span><br />
              {selectedPlanet.distanceFromSun.toFixed(3)} AU
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all duration-300 hover:bg-white/[0.06]">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Earth distance</span><br />
              {selectedPlanet.distanceFromEarth}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all duration-300 hover:bg-white/[0.06]">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Magnitude</span><br />
              {selectedPlanet.magnitude}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all duration-300 hover:bg-white/[0.06]">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Constellation</span><br />
              {selectedPlanet.constellation}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all duration-300 hover:bg-white/[0.06]">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Moons</span><br />
              {selectedPlanet.moons}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 transition-all duration-300 hover:bg-white/[0.06]">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Diameter</span><br />
              {selectedPlanet.realSize.toLocaleString()} km
            </div>
          </div>
        </div>
      )}

      {arMessage && (
        <div className="absolute bottom-20 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-amber-300/20 bg-slate-950/85 px-4 py-3 text-center text-sm text-amber-100 shadow-[0_16px_45px_rgba(0,0,0,0.45),0_0_24px_rgba(245,158,11,0.08)] backdrop-blur-2xl">
          {arMessage}
        </div>
      )}
    </div>
  );
}
