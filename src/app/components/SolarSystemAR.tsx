import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  XR,
  createXRStore,
  useXRHitTest,
  useXRInputSourceEvent,
} from '@react-three/xr';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { PlanetViewModel } from './ExplorerScreen';

const xrStore = createXRStore();

const TEXTURES: Record<string, string> = {
  Mercury: '/textures/planets/mercury.jpg',
  Venus: '/textures/planets/venus.jpg',
  Earth: '/textures/earth.jpg',
  Mars: '/textures/planets/mars.jpg',
  Jupiter: '/textures/planets/jupiter.jpg',
  Saturn: '/textures/planets/saturn.jpg',
  Uranus: '/textures/planets/uranus.jpg',
  Neptune: '/textures/planets/neptune.jpg',
};

function RealisticSun() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.65, 96, 96]} />

        <shaderMaterial
          ref={materialRef}
          uniforms={{
            time: { value: 0 },
          }}
          vertexShader={`
            varying vec3 vNormal;

            void main() {
              vNormal = normalize(normalMatrix * normal);

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;

            varying vec3 vNormal;

            float hash(vec3 p) {
              p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
              p *= 17.0;
              return fract(
                p.x * p.y * p.z *
                (p.x + p.y + p.z)
              );
            }

            float noise(vec3 p) {
              vec3 i = floor(p);
              vec3 f = fract(p);

              f = f * f * (3.0 - 2.0 * f);

              return mix(
                mix(
                  mix(
                    hash(i),
                    hash(i + vec3(1.0, 0.0, 0.0)),
                    f.x
                  ),
                  mix(
                    hash(i + vec3(0.0, 1.0, 0.0)),
                    hash(i + vec3(1.0, 1.0, 0.0)),
                    f.x
                  ),
                  f.y
                ),
                mix(
                  mix(
                    hash(i + vec3(0.0, 0.0, 1.0)),
                    hash(i + vec3(1.0, 0.0, 1.0)),
                    f.x
                  ),
                  mix(
                    hash(i + vec3(0.0, 1.0, 1.0)),
                    hash(i + vec3(1.0, 1.0, 1.0)),
                    f.x
                  ),
                  f.y
                ),
                f.z
              );
            }

            float fbm(vec3 p) {
              float value = 0.0;
              float amplitude = 0.5;

              for (int i = 0; i < 5; i++) {
                value += noise(p) * amplitude;
                p *= 2.05;
                amplitude *= 0.5;
              }

              return value;
            }

            void main() {
              vec3 normal = normalize(vNormal);

              float granulation =
                fbm(normal * 18.0 + vec3(time * 0.018));

              float fine =
                noise(normal * 55.0 + vec3(time * 0.035));

              float turbulence =
                fbm(normal * 5.5 - vec3(time * 0.008));

              float surface =
                granulation * 0.62 +
                fine * 0.23 +
                turbulence * 0.15;

              vec3 deepOrange =
                vec3(1.0, 0.24, 0.025);

              vec3 orange =
                vec3(1.0, 0.48, 0.055);

              vec3 gold =
                vec3(1.0, 0.72, 0.18);

              vec3 hotWhite =
                vec3(1.0, 0.94, 0.72);

              vec3 color =
                mix(
                  deepOrange,
                  orange,
                  smoothstep(0.05, 0.38, surface)
                );

              color =
                mix(
                  color,
                  gold,
                  smoothstep(0.35, 0.68, surface)
                );

              color =
                mix(
                  color,
                  hotWhite,
                  smoothstep(0.62, 0.92, surface)
                );

              float viewFactor =
                clamp(
                  dot(normal, vec3(0.0, 0.0, 1.0)),
                  0.0,
                  1.0
                );

              color *=
                mix(
                  0.58,
                  1.0,
                  pow(viewFactor, 0.42)
                );

              float hotspots =
                smoothstep(0.67, 0.94, surface);

              color +=
                vec3(1.0, 0.42, 0.08) *
                hotspots *
                0.18;

              color *= 1.28;

              gl_FragColor =
                vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.93, 64, 64]} />

        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            color: {
              value: new THREE.Color(0xffa52f),
            },
            intensity: {
              value: 0.42,
            },
          }}
          vertexShader={`
            varying vec3 vNormal;

            void main() {
              vNormal =
                normalize(normalMatrix * normal);

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            uniform float intensity;

            varying vec3 vNormal;

            void main() {
              float edge =
                pow(
                  1.0 -
                  max(
                    dot(
                      normalize(vNormal),
                      vec3(0.0, 0.0, 1.0)
                    ),
                    0.0
                  ),
                  3.2
                );

              float alpha =
                edge *
                0.24 *
                intensity;

              gl_FragColor =
                vec4(color, alpha);
            }
          `}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.22, 64, 64]} />
        <meshBasicMaterial
          color="#ffb84d"
          transparent
          opacity={0.018}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        intensity={18}
        distance={35}
        decay={1.25}
        color="#ffd28a"
      />
    </group>
  );
}

function PlanetVisual({
  planet,
  radius,
  onSelect,
}: {
  planet: PlanetViewModel;
  radius: number;
  onSelect?: () => void;
}) {
  const texturePath = TEXTURES[planet.name];

  const texture = texturePath
    ? useLoader(THREE.TextureLoader, texturePath)
    : null;

  const clouds =
    planet.name === 'Earth'
      ? useLoader(
          THREE.TextureLoader,
          '/textures/earth_clouds.png',
        )
      : null;

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
    }

    if (clouds) {
      clouds.colorSpace = THREE.SRGBColorSpace;
      clouds.anisotropy = 8;
    }
  }, [texture, clouds]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        delta *
        (planet.name === 'Jupiter'
          ? 0.20
          : planet.name === 'Saturn'
            ? 0.17
            : 0.10);
    }
  });

  const atmosphereColor =
    planet.name === 'Earth'
      ? '#38bdf8'
      : planet.name === 'Venus'
        ? '#ffc27a'
        : '#67d9ff';

  return (
    <group ref={groupRef}>
      <mesh onClick={onSelect}>
        <sphereGeometry args={[radius, 96, 96]} />

        <meshPhongMaterial
          map={texture ?? undefined}
          color={texture ? '#ffffff' : planet.color}
          shininess={
            planet.name === 'Earth'
              ? 18
              : planet.name === 'Jupiter'
                ? 10
                : 8
          }
          specular={
            planet.name === 'Earth'
              ? '#446677'
              : '#161616'
          }
        />
      </mesh>

      {(planet.name === 'Earth' ||
        planet.name === 'Venus' ||
        planet.name === 'Uranus' ||
        planet.name === 'Neptune') && (
        <mesh>
          <sphereGeometry
            args={[radius * 1.035, 64, 64]}
          />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={
              planet.name === 'Earth'
                ? 0.13
                : 0.075
            }
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {planet.name === 'Earth' && clouds && (
        <mesh>
          <sphereGeometry
            args={[radius * 1.012, 96, 96]}
          />
          <meshPhongMaterial
            map={clouds}
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>
      )}

      {planet.name === 'Saturn' && (
        <>
          <mesh rotation={[Math.PI / 2.35, 0, 0]}>
            <ringGeometry
              args={[
                radius * 1.35,
                radius * 2.15,
                128,
              ]}
            />
            <meshPhongMaterial
              color="#d8c18d"
              transparent
              opacity={0.72}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2.35, 0, 0]}>
            <ringGeometry
              args={[
                radius * 1.72,
                radius * 1.86,
                128,
              ]}
            />
            <meshBasicMaterial
              color="#f2dfb0"
              transparent
              opacity={0.38}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

function OrbitRing({ distance }: { distance: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry
        args={[
          distance - 0.006,
          distance + 0.006,
          128,
        ]}
      />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.09}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight
        color="#9fb8d6"
        intensity={0.42}
      />

      <hemisphereLight
        color="#c9e2ff"
        groundColor="#182235"
        intensity={0.48}
      />

      <pointLight
        color="#ffd28a"
        intensity={420}
        distance={0}
        decay={1.25}
        position={[0, 0, 0]}
      />

      <directionalLight
        color="#aed4f5"
        intensity={0.68}
        position={[-35, 28, 35]}
      />

      <directionalLight
        color="#ffffff"
        intensity={0.62}
        position={[0, 12, 45]}
      />

      <directionalLight
        color="#78bfff"
        intensity={0.18}
        position={[35, -12, -35]}
      />
    </>
  );
}

function SpaceBackground() {
  return (
    <Stars
      radius={95}
      depth={230}
      count={1800}
      factor={1.35}
      saturation={0}
      fade
      speed={0.08}
    />
  );
}

function SolarSystemScene() {
  const fallbackPlanets = [
    ['Mercury', 0.08, 1.1],
    ['Venus', 0.12, 1.6],
    ['Earth', 0.14, 2.2],
    ['Mars', 0.11, 2.8],
    ['Jupiter', 0.30, 4.0],
    ['Saturn', 0.26, 5.2],
    ['Uranus', 0.20, 6.4],
    ['Neptune', 0.19, 7.5],
  ] as const;

  return (
    <>
      <color attach="background" args={['#02050b']} />

      <Lighting />
      <SpaceBackground />
      <RealisticSun />

      {fallbackPlanets.map(
        ([name, radius, distance]) => {
          const planet = {
            name,
            color:
              name === 'Earth'
                ? '#3d72ad'
                : name === 'Mars'
                  ? '#b65438'
                  : '#c99d72',
          } as PlanetViewModel;

          return (
            <group key={name}>
              <PlanetVisual
                planet={planet}
                radius={radius}
              />
              <OrbitRing distance={distance} />
            </group>
          );
        },
      )}

      <OrbitControls
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
}

function ARHitTest({
  onPlace,
}: {
  onPlace: (matrix: THREE.Matrix4) => void;
}) {
  const reticleRef = useRef<THREE.Mesh>(null);
  const hitMatrixRef = useRef(new THREE.Matrix4());
  const hasHitRef = useRef(false);

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (
        reticleRef.current === null ||
        results.length === 0
      ) {
        if (reticleRef.current !== null) {
          reticleRef.current.visible = false;
        }
        return;
      }

      getWorldMatrix(
        hitMatrixRef.current,
        results[0],
      );

      hasHitRef.current = true;
      reticleRef.current.visible = true;
      reticleRef.current.matrixAutoUpdate = false;
      reticleRef.current.matrix.copy(
        hitMatrixRef.current,
      );
    },
    'viewer',
  );

  useXRInputSourceEvent(
    'all',
    'selectend',
    () => {
      if (hasHitRef.current) {
        onPlace(hitMatrixRef.current.clone());
      }
    },
    [onPlace],
  );

  return (
    <mesh
      ref={reticleRef}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <ringGeometry args={[0.08, 0.12, 32]} />
      <meshBasicMaterial
        color="#00ffcc"
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function LiveSolarSystemScene({
  planets,
  onSelectPlanet,
}: {
  planets: PlanetViewModel[];
  onSelectPlanet: (planet: PlanetViewModel) => void;
}) {
  return (
    <>
      <Lighting />
      <SpaceBackground />
      <RealisticSun />

      {planets.map((planet) => {
        const angle =
          (planet.currentPosition * Math.PI) /
          180;

        const visualDistance =
          1.2 +
          Math.log10(
            Math.max(
              0.3,
              planet.distanceFromSun,
            ),
          ) *
            2.5;

        const visualRadius = Math.max(
          0.06,
          Math.min(
            0.42,
            planet.size / 90,
          ),
        );

        return (
          <group key={planet.name}>
            <group
              position={[
                Math.cos(angle) *
                  visualDistance,
                0,
                Math.sin(angle) *
                  visualDistance,
              ]}
            >
              <PlanetVisual
                planet={planet}
                radius={visualRadius}
                onSelect={() =>
                  onSelectPlanet(planet)
                }
              />
            </group>

            <OrbitRing
              distance={visualDistance}
            />
          </group>
        );
      })}

      <OrbitControls
        enablePan
        enableZoom
        minDistance={0.8}
        maxDistance={25}
      />
    </>
  );
}

export function SolarSystemAR({
  planets = [],
}: {
  planets?: PlanetViewModel[];
}) {
  const [arMessage, setArMessage] =
    useState('');

  const [selectedPlanet, setSelectedPlanet] =
    useState<PlanetViewModel | null>(null);

  const [placementMatrix, setPlacementMatrix] =
    useState<THREE.Matrix4 | null>(null);

  const handleEnterAR = async () => {
    if (!navigator.xr) {
      setArMessage(
        'AR is not supported in this browser/device.',
      );
      return;
    }

    try {
      const supported =
        await navigator.xr.isSessionSupported(
          'immersive-ar',
        );

      if (!supported) {
        setArMessage(
          'Immersive AR is not available on this device.',
        );
        return;
      }

      await xrStore.enterAR();
    } catch (error) {
      console.error(
        'Failed to start AR session:',
        error,
      );

      setArMessage(
        'Could not start AR. Please check WebXR support.',
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-black">
      <Canvas
        camera={{
          position: [0, 4, 12],
          fov: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <XR store={xrStore}>
          <ARHitTest
            onPlace={setPlacementMatrix}
          />

          <group
            matrix={
              placementMatrix ??
              new THREE.Matrix4()
            }
            matrixAutoUpdate={false}
            visible
          >
            {planets.length > 0 ? (
              <LiveSolarSystemScene
                planets={planets}
                onSelectPlanet={
                  setSelectedPlanet
                }
              />
            ) : (
              <SolarSystemScene />
            )}
          </group>
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
              <h3 className="text-lg font-bold">
                {selectedPlanet.name}
              </h3>

              <p className="text-xs text-white/60">
                Live astronomical data
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedPlanet(null)
              }
              className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">
                Sun distance
              </span>
              <br />
              {selectedPlanet.distanceFromSun.toFixed(
                3,
              )}{' '}
              AU
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">
                Earth distance
              </span>
              <br />
              {selectedPlanet.distanceFromEarth}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">
                Magnitude
              </span>
              <br />
              {selectedPlanet.magnitude}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">
                Constellation
              </span>
              <br />
              {selectedPlanet.constellation}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">
                Moons
              </span>
              <br />
              {selectedPlanet.moons}
            </div>

            <div className="rounded-lg bg-white/5 p-2">
              <span className="text-white/50">
                Diameter
              </span>
              <br />
              {selectedPlanet.realSize.toLocaleString()}{' '}
              km
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
