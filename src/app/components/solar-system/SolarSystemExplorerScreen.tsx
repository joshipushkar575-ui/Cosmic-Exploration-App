import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { supabase } from "../../../lib/supabase";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  ArrowLeft,
  RotateCcw,
  Maximize2,
  Info,
  Pause,
  Play,
  Sun,
  Sparkles,
} from "lucide-react";

interface SolarSystemExplorerScreenProps {
  onNavigate: (screen: string) => void;
}

interface PlanetDefinition {
  name: string;
  radius: number;
  distance: number;
  color: number;
  roughness: number;
  rotationSpeed: number;
  orbitSpeed: number;
  tilt: number;
  description: string;
}

interface JPLVectorPosition {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  epoch?: string;
  units?: string;
  reference?: string;
  center?: string;
}

interface JPLVectorResponse {
  success: boolean;
  source?: string;
  target?: string;
  targetName?: string;
  vector?: boolean;
  position?: JPLVectorPosition;
  fetchedAt?: string;
  error?: string;
}

const JPL_TARGETS: Record<string, string> = {
  Mercury: "199",
  Venus: "299",
  Earth: "399",
  Mars: "499",
  Jupiter: "599",
  Saturn: "699",
  Uranus: "799",
  Neptune: "899",
};

const JPL_AU_KM = 149597870.7;

const PLANETS: PlanetDefinition[] = [
  {
    name: "Mercury",
    radius: 0.42,
    distance: 8,
    color: 0xaaa39b,
    roughness: 0.94,
    rotationSpeed: 0.003,
    orbitSpeed: 0.020,
    tilt: 0.03,
    description:
      "The smallest planet and the closest planet to the Sun. Its surface is heavily cratered and has extreme temperature variation.",
  },
  {
    name: "Venus",
    radius: 0.72,
    distance: 11,
    color: 0xd9b37c,
    roughness: 0.78,
    rotationSpeed: -0.0015,
    orbitSpeed: 0.015,
    tilt: 3.1,
    description:
      "A hot, cloud-covered world with a dense carbon-dioxide atmosphere and runaway greenhouse warming.",
  },
  {
    name: "Earth",
    radius: 0.78,
    distance: 14,
    color: 0x4b82b8,
    roughness: 0.52,
    rotationSpeed: 0.010,
    orbitSpeed: 0.012,
    tilt: 0.41,
    description:
      "Our home world, with liquid surface water, a nitrogen-rich atmosphere and an active biosphere.",
  },
  {
    name: "Mars",
    radius: 0.56,
    distance: 18,
    color: 0xb96348,
    roughness: 0.91,
    rotationSpeed: 0.008,
    orbitSpeed: 0.010,
    tilt: 0.44,
    description:
      "The Red Planet, marked by iron-rich dust, ancient valleys, volcanoes and polar ice deposits.",
  },
  {
    name: "Jupiter",
    radius: 1.72,
    distance: 25,
    color: 0xcda77e,
    roughness: 0.72,
    rotationSpeed: 0.018,
    orbitSpeed: 0.006,
    tilt: 0.05,
    description:
      "The largest planet in the Solar System, dominated by hydrogen and helium and famous for its atmospheric bands.",
  },
  {
    name: "Saturn",
    radius: 1.48,
    distance: 33,
    color: 0xd6c18f,
    roughness: 0.70,
    rotationSpeed: 0.016,
    orbitSpeed: 0.004,
    tilt: 0.47,
    description:
      "A gas giant surrounded by an extensive and highly structured ring system made primarily of icy particles.",
  },
  {
    name: "Uranus",
    radius: 1.0,
    distance: 42,
    color: 0x83cbd2,
    roughness: 0.64,
    rotationSpeed: 0.011,
    orbitSpeed: 0.003,
    tilt: 1.71,
    description:
      "An ice giant with a blue-green atmosphere and an extreme axial tilt that produces unusual seasons.",
  },
  {
    name: "Neptune",
    radius: 0.98,
    distance: 50,
    color: 0x4d73c4,
    roughness: 0.62,
    rotationSpeed: 0.013,
    orbitSpeed: 0.002,
    tilt: 0.49,
    description:
      "A distant ice giant with powerful atmospheric winds and a deep blue appearance caused by atmospheric methane.",
  },
];

function createCanvasTexture(
  width: number,
  height: number,
  generator: (ctx: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.Texture();
  }

  generator(ctx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
}

function createPlanetTexture(
  planet: PlanetDefinition,
  variant: "normal" | "earth" | "gas",
) {
  return createCanvasTexture(1024, 512, (ctx) => {
    const image = ctx.createImageData(1024, 512);
    const data = image.data;

    const base = new THREE.Color(planet.color);
    const r = base.r * 255;
    const g = base.g * 255;
    const b = base.b * 255;

    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 1024; x++) {
        const i = (y * 1024 + x) * 4;

        const wave1 = Math.sin(x * 0.025 + Math.sin(y * 0.03) * 2.2);
        const wave2 = Math.sin(y * 0.075 + x * 0.006);
        const wave3 = Math.sin((x + y) * 0.017);
        const noise = (wave1 + wave2 + wave3) / 3;

        let rr = r;
        let gg = g;
        let bb = b;

        if (variant === "gas") {
          const band = Math.sin(y * 0.075 + noise * 2.8);
          const turbulence =
            Math.sin(x * 0.035 + y * 0.012) *
            Math.sin(y * 0.05 + x * 0.008);

          const variation = band * 22 + turbulence * 18;

          rr += variation;
          gg += variation * 0.85;
          bb += variation * 0.65;

          if (planet.name === "Jupiter") {
            const storm =
              Math.exp(
                -(
                  Math.pow((x - 760) / 110, 2) +
                  Math.pow((y - 350) / 45, 2)
                ),
              );

            rr += storm * 45;
            gg += storm * 15;
            bb -= storm * 5;
          }
        } else {
          rr += noise * 20;
          gg += noise * 20;
          bb += noise * 20;
        }

        if (planet.name === "Mars") {
          const darkRegion =
            Math.sin(x * 0.022) * Math.sin(y * 0.041) > 0.55;
          if (darkRegion) {
            rr *= 0.72;
            gg *= 0.68;
            bb *= 0.64;
          }
        }

        if (planet.name === "Mercury") {
          const crater =
            Math.sin(x * 0.095 + y * 0.07) *
            Math.sin(x * 0.041 - y * 0.055);

          rr += crater * 22;
          gg += crater * 20;
          bb += crater * 18;
        }

        if (variant === "earth") {
          const ocean =
            Math.sin(x * 0.021 + y * 0.017) *
            Math.sin(y * 0.032 - x * 0.009);

          const land =
            Math.sin(x * 0.014) +
            Math.sin(y * 0.028) +
            Math.sin((x + y) * 0.018);

          if (land > 1.1) {
            rr = 48 + noise * 22;
            gg = 112 + noise * 24;
            bb = 62 + noise * 15;
          } else {
            rr = 24 + ocean * 12;
            gg = 75 + ocean * 20;
            bb = 145 + ocean * 24;
          }

          if (y < 55 || y > 457) {
            rr = 205;
            gg = 220;
            bb = 232;
          }
        }

        data[i] = Math.max(0, Math.min(255, rr));
        data[i + 1] = Math.max(0, Math.min(255, gg));
        data[i + 2] = Math.max(0, Math.min(255, bb));
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    if (variant === "earth") {
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < 65; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = 8 + Math.random() * 28;

        const glow = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius,
        );

        glow.addColorStop(0, "rgba(255,255,255,0.55)");
        glow.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }
  });
}

function createStarfield(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const colorA = new THREE.Color(0xbddcff);
  const colorB = new THREE.Color(0xffe9c2);
  const colorC = new THREE.Color(0xffffff);

  for (let i = 0; i < count; i++) {
    const radius = 95 + Math.random() * 230;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const chosen =
      Math.random() < 0.18
        ? colorA
        : Math.random() < 0.22
          ? colorB
          : colorC;

    colors[i * 3] = chosen.r;
    colors[i * 3 + 1] = chosen.g;
    colors[i * 3 + 2] = chosen.b;

    sizes[i] = Math.random() < 0.08 ? 2.4 : 0.8 + Math.random() * 1.4;
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3),
  );

  geometry.setAttribute(
    "size",
    new THREE.BufferAttribute(sizes, 1),
  );

  const material = new THREE.PointsMaterial({
    size: 0.9,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.72,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createNebula() {
  const geometry = new THREE.BufferGeometry();
  const count = 0;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color(0x4c6fff),
    new THREE.Color(0x9b5cff),
    new THREE.Color(0x28b9ff),
    new THREE.Color(0xff6bc9),
  ];

  for (let i = 0; i < count; i++) {
    const radius = 80 + Math.random() * 160;
    const theta = Math.random() * Math.PI * 2;
    const spread = (Math.random() - 0.5) * 65;

    const x = Math.cos(theta) * radius;
    const y = spread + Math.sin(theta * 3.0) * 15;
    const z = Math.sin(theta) * radius;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const c = palette[Math.floor(Math.random() * palette.length)];

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3),
  );

  const material = new THREE.PointsMaterial({
    size: 8,
    transparent: true,
    opacity: 0.045,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createOrbit(radius: number) {
  const curve = new THREE.EllipseCurve(
    0,
    0,
    radius,
    radius,
    0,
    Math.PI * 2,
    false,
    0,
  );

  const points = curve.getPoints(256);

  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(
      (point) =>
        new THREE.Vector3(point.x, 0, point.y),
    ),
  );

  const material = new THREE.LineBasicMaterial({
    color: 0x64748b,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const orbit = new THREE.LineLoop(
    geometry,
    material,
  );

  orbit.renderOrder = 1;

  return orbit;
}

function createSaturnRings(radius: number) {
  const group = new THREE.Group();

  const ringConfigs = [
    { inner: radius * 1.45, outer: radius * 1.72, opacity: 0.82 },
    { inner: radius * 1.74, outer: radius * 1.95, opacity: 0.58 },
    { inner: radius * 1.98, outer: radius * 2.16, opacity: 0.38 },
  ];

  for (const config of ringConfigs) {
    const geometry = new THREE.RingGeometry(
      config.inner,
      config.outer,
      128,
    );

    const material = new THREE.MeshStandardMaterial({
      color: 0xd6c28f,
      roughness: 0.82,
      metalness: 0.05,
      transparent: true,
      opacity: config.opacity,
      side: THREE.DoubleSide,
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  return group;
}

function createSun(textureLoader?: THREE.TextureLoader) {
  const group = new THREE.Group();

  // Realistic procedural solar photosphere.
  // This avoids a flat cartoon-orange sphere while keeping
  // the Sun fully self-contained and fast to render.
  const sunGeometry = new THREE.SphereGeometry(
    3.25,
    128,
    128,
  );

  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0,
      },
    },

    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);

        vec4 worldPosition =
          modelMatrix * vec4(position, 1.0);

        vWorldPosition = worldPosition.xyz;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform float time;

      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      // Smooth procedural noise.
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(
            mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)),
                hash(i + vec3(1.0, 1.0, 0.0)), f.x),
            f.y
          ),
          mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)),
                hash(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)),
                hash(i + vec3(1.0, 1.0, 1.0)), f.x),
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

        // Solar granulation / convection pattern.
        float granulation =
          fbm(normal * 18.0 + vec3(time * 0.018));

        float fineGranulation =
          noise(normal * 55.0 + vec3(time * 0.035));

        // Large-scale turbulent structures.
        float turbulence =
          fbm(normal * 5.5 - vec3(time * 0.008));

        float surface =
          granulation * 0.62 +
          fineGranulation * 0.23 +
          turbulence * 0.15;

        // Bright solar photosphere palette.
        vec3 deepOrange = vec3(
          1.0,
          0.24,
          0.025
        );

        vec3 orange = vec3(
          1.0,
          0.48,
          0.055
        );

        vec3 gold = vec3(
          1.0,
          0.72,
          0.18
        );

        vec3 hotWhite = vec3(
          1.0,
          0.94,
          0.72
        );

        vec3 color = mix(
          deepOrange,
          orange,
          smoothstep(0.05, 0.38, surface)
        );

        color = mix(
          color,
          gold,
          smoothstep(0.35, 0.68, surface)
        );

        color = mix(
          color,
          hotWhite,
          smoothstep(0.62, 0.92, surface)
        );

        // Limb darkening — the solar disk naturally becomes
        // slightly darker toward its edge.
        float viewFactor =
          clamp(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);

        float limb =
          mix(0.58, 1.0, pow(viewFactor, 0.42));

        color *= limb;

        // Small bright convection highlights.
        float hotspots =
          smoothstep(0.67, 0.94, surface);

        color +=
          vec3(1.0, 0.42, 0.08) *
          hotspots *
          0.18;

        // Keep the photosphere emissive-looking.
        color *= 1.28;

        gl_FragColor =
          vec4(color, 1.0);
      }
    `,

    transparent: false,
    depthWrite: true,
  });

  const sun = new THREE.Mesh(
    sunGeometry,
    sunMaterial,
  );

  sun.userData = {
    solarSurface: true,
  };

  group.add(sun);

  // Controlled inner solar glow.
  const glowGeometry = new THREE.SphereGeometry(
    4.65,
    96,
    96,
  );

  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(0xffa52f),
      },
      intensity: {
        value: 0.42,
      },
    },

    vertexShader: `
      varying vec3 vNormal;

      void main() {
        vNormal =
          normalize(normalMatrix * normal);

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(position, 1.0);
      }
    `,

    fragmentShader: `
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
    `,

    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });

  group.add(
    new THREE.Mesh(
      glowGeometry,
      glowMaterial,
    ),
  );

  // Very subtle outer corona.
  const coronaGeometry = new THREE.SphereGeometry(
    6.1,
    72,
    72,
  );

  const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffb84d,
    transparent: true,
    opacity: 0.018,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });

  group.add(
    new THREE.Mesh(
      coronaGeometry,
      coronaMaterial,
    ),
  );

  return group;
}

export default function SolarSystemExplorerScreen({
  onNavigate,
}: SolarSystemExplorerScreenProps) {

  const jplVectorsRef = useRef<Record<string, JPLVectorPosition>>({});
  const jplLoadedRef = useRef(false);
  const jplFetchedAtRef = useRef<string | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planetMeshesRef = useRef<
    Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>
  >(new Map());
  const animationFrameRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const selectedPlanetRef = useRef<string | null>(null);

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(
    null,
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x030712);

    scene.fog = new THREE.FogExp2(0x030712, 0.0009);

    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      900,
    );

    camera.position.set(0, 23, 67);

    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2),
    );

    renderer.setSize(
      mount.clientWidth,
      mount.clientHeight,
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    rendererRef.current = renderer;

    const controls = new OrbitControls(
      camera,
      renderer.domElement,
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.minDistance = 8;
    controls.maxDistance = 170;
    controls.target.set(0, 0, 0);

    controlsRef.current = controls;

    // Stronger cinematic fill lighting.
    // Keeps planetary textures readable even when a planet
    // is focused closely, while preserving solar direction.

    const ambientLight = new THREE.AmbientLight(
      0x9fb8d6,
      0.42,
    );

    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(
      0xc9e2ff,
      0x182235,
      0.48,
    );

    scene.add(hemisphereLight);

    // Main solar illumination.
    const sunLight = new THREE.PointLight(
      0xffd28a,
      4200,
      0,
      1.25,
    );

    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);

    scene.add(sunLight);

    // Soft neutral fill from the opposite side.
    const fillLight = new THREE.DirectionalLight(
      0xaed4f5,
      0.68,
    );

    fillLight.position.set(
      -35,
      28,
      35,
    );

    scene.add(fillLight);

    // Subtle frontal fill specifically for close-up readability.
    const frontFill = new THREE.DirectionalLight(
      0xffffff,
      0.62,
    );

    frontFill.position.set(
      0,
      12,
      45,
    );

    scene.add(frontFill);

    // Very subtle blue rim.
    const rimLight = new THREE.DirectionalLight(
      0xa7c8eb,
      0.18,
    );

    rimLight.position.set(
      -30,
      45,
      25,
    );

    scene.add(rimLight);

    const stars = createStarfield(6500);
    scene.add(stars);

    const nebula = createNebula();
    scene.add(nebula);

    const textureLoader = new THREE.TextureLoader();

    const sun = createSun(textureLoader);
    scene.add(sun);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    PLANETS.forEach((planet) => {
      const orbit = createOrbit(planet.distance);
      orbit.rotation.x = planet.tilt * 0.15;
      orbitGroup.add(orbit);
    });

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    PLANETS.forEach((planet) => {
      const geometry = new THREE.SphereGeometry(
        planet.radius,
        96,
        96,
      );

      const texturePaths: Record<string, string> = {
        Mercury: "/textures/planets/mercury.jpg",
        Venus: "/textures/planets/venus.jpg",
        Earth: "/textures/earth.jpg",
        Mars: "/textures/planets/mars.jpg",
        Jupiter: "/textures/planets/jupiter.jpg",
        Saturn: "/textures/planets/saturn.jpg",
        Uranus: "/textures/planets/uranus.jpg",
        Neptune: "/textures/planets/neptune.jpg",
      };

      const planetTexturePath = texturePaths[planet.name];

      const material = new THREE.MeshPhongMaterial({
        map: planetTexturePath
          ? textureLoader.load(planetTexturePath)
          : undefined,
        color: planetTexturePath
          ? 0xffffff
          : planet.color,
        shininess:
          planet.name === "Earth"
            ? 18
            : planet.name === "Jupiter"
              ? 10
              : 8,
        specular:
          planet.name === "Earth"
            ? new THREE.Color(0x446677)
            : new THREE.Color(0x161616),
      });

      if (planetTexturePath) {
        const texture = material.map;
        if (texture) {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(
            renderer.capabilities.getMaxAnisotropy(),
            8,
          );
        }
      }

      const mesh = new THREE.Mesh(
        geometry,
        material,
      );

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.rotation.z = planet.tilt;

      mesh.userData = {
        planetName: planet.name,
        baseY: 0,
        jplTarget: JPL_TARGETS[planet.name],
        jplSource: "NASA/JPL Horizons",
      };

      planetGroup.add(mesh);

      planetMeshesRef.current.set(
        planet.name,
        mesh,
      );

      if (
        planet.name === "Earth" ||
        planet.name === "Venus" ||
        planet.name === "Uranus" ||
        planet.name === "Neptune"
      ) {
        const atmosphereGeometry = new THREE.SphereGeometry(
          planet.radius * 1.035,
          96,
          96,
        );

        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color:
            planet.name === "Earth"
              ? 0x38bdf8
              : planet.name === "Venus"
                ? 0xffc27a
                : 0x67d9ff,
          transparent: true,
          opacity:
            planet.name === "Earth"
              ? 0.13
              : 0.075,
          side: THREE.BackSide,
          depthWrite: false,
        });

        mesh.add(
          new THREE.Mesh(
            atmosphereGeometry,
            atmosphereMaterial,
          ),
        );
      }

      if (planet.name === "Earth") {
        const cloudGeometry = new THREE.SphereGeometry(
          planet.radius * 1.012,
          96,
          96,
        );

        const cloudTexture = textureLoader.load(
          "/textures/earth_clouds.png",
        );

        cloudTexture.colorSpace = THREE.SRGBColorSpace;
        cloudTexture.anisotropy = 8;

        const cloudMaterial = new THREE.MeshPhongMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        });

        mesh.add(
          new THREE.Mesh(
            cloudGeometry,
            cloudMaterial,
          ),
        );
      }

      if (planet.name === "Saturn") {
        mesh.add(
          createSaturnRings(
            planet.radius,
          ),
        );
      }
    });

    // Small asteroid belt for additional depth.
    const asteroidGeometry =
      new THREE.BufferGeometry();

    const asteroidCount = 1100;

    const asteroidPositions =
      new Float32Array(
        asteroidCount * 3,
      );

    for (let i = 0; i < asteroidCount; i++) {
      const radius =
        20.5 + Math.random() * 2.8;

      const angle =
        Math.random() * Math.PI * 2;

      const y =
        (Math.random() - 0.5) * 0.9;

      asteroidPositions[i * 3] =
        Math.cos(angle) * radius;

      asteroidPositions[i * 3 + 1] = y;

      asteroidPositions[i * 3 + 2] =
        Math.sin(angle) * radius;
    }

    asteroidGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        asteroidPositions,
        3,
      ),
    );

    const asteroidMaterial =
      new THREE.PointsMaterial({
        color: 0x9b8f7a,
        size: 0.055,
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
      });

    scene.add(
      new THREE.Points(
        asteroidGeometry,
        asteroidMaterial,
      ),
    );

    const raycaster = new THREE.Raycaster();

    const pointer = new THREE.Vector2();

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const rect =
        renderer.domElement.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
        1;

      pointer.y =
        -(
          (event.clientY - rect.top) /
          rect.height
        ) *
          2 +
        1;

      raycaster.setFromCamera(
        pointer,
        camera,
      );

      const intersections =
        raycaster.intersectObjects(
          Array.from(
            planetMeshesRef.current.values(),
          ),
          false,
        );

      if (!intersections.length) {
        return;
      }

      const object =
        intersections[0]
          .object as THREE.Mesh;

      const name =
        object.userData.planetName;

      if (!name) return;

      selectedPlanetRef.current =
        name;

      setSelectedPlanet(name);

      const definition =
        PLANETS.find(
          (planet) =>
            planet.name === name,
        );

      if (!definition) return;

      const direction =
        new THREE.Vector3(
          object.position.x,
          object.position.y,
          object.position.z,
        ).normalize();

      const target =
        object.position.clone();

      controls.target.copy(target);

      camera.position.copy(
        target
          .clone()
          .add(
            direction
              .multiplyScalar(
                definition.radius * 5 + 4,
              ),
          )
          .add(
            new THREE.Vector3(
              0,
              definition.radius * 2,
              0,
            ),
          ),
      );
    };

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current =
        requestAnimationFrame(animate);

      const delta =
        clock.getDelta();

      if (!pausedRef.current) {
        sun.rotation.y +=
          delta * 0.025;

        PLANETS.forEach(
          (planet) => {
            const mesh =
              planetMeshesRef.current.get(
                planet.name,
              );

            if (!mesh) return;

            const jpl = jplVectorsRef.current[planet.name];

            if (jpl) {
              // NASA/JPL Horizons provides heliocentric Cartesian
              // coordinates in kilometres.
              const xAU = jpl.x / JPL_AU_KM;
              const yAU = jpl.y / JPL_AU_KM;
              const zAU = jpl.z / JPL_AU_KM;

              const radiusAU = Math.sqrt(
                xAU * xAU +
                  yAU * yAU +
                  zAU * zAU,
              );

              if (radiusAU > 0) {
                // Compress the real Solar System scale for the
                // 3D visualization while preserving JPL direction.
                const visualRadius =
                  14 *
                  (Math.log1p(radiusAU * 0.9) /
                    Math.log1p(0.9));

                const scale =
                  visualRadius / radiusAU;

                mesh.position.x = xAU * scale;
                mesh.position.y = zAU * scale;
                mesh.position.z = -yAU * scale;
              }
            } else {
              // Safe visual fallback while JPL data is loading.
              // This prevents planets from sitting inside the Sun.
              const fallbackAngle =
                PLANETS.indexOf(planet) * 0.9;

              mesh.position.x =
                Math.cos(fallbackAngle) *
                planet.distance;

              mesh.position.z =
                Math.sin(fallbackAngle) *
                planet.distance;

              mesh.position.y =
                Math.sin(
                  fallbackAngle * 0.65 +
                    planet.tilt,
                ) *
                planet.distance *
                0.035;
            }
            mesh.rotation.y +=
              planet.rotationSpeed *
              0.75;

            if (
              planet.name ===
              "Saturn"
            ) {
              const rings =
                mesh.children.find(
                  (child) =>
                    child instanceof
                    THREE.Group,
                );

              if (rings) {
                rings.rotation.z +=
                  delta * 0.01;
              }
            }
          },
        );
      }

      controls.update();

      renderer.render(
        scene,
        camera,
      );
    };

    animate();

    const handleResize = () => {
      const width =
        mount.clientWidth;

      const height =
        mount.clientHeight;

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
      );
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current,
        );
      }

      window.removeEventListener(
        "resize",
        handleResize,
      );

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      controls.dispose();

      scene.traverse((object) => {
        if (
          object instanceof
          THREE.Mesh
        ) {
          object.geometry.dispose();

          if (
            Array.isArray(
              object.material,
            )
          ) {
            object.material.forEach(
              (material) => {
                material.dispose();

                if (
                  material.map
                ) {
                  material.map.dispose();
                }
              },
            );
          } else {
            object.material.dispose();

            if (
              object.material.map
            ) {
              object.material.map.dispose();
            }
          }
        }

        if (
          object instanceof
          THREE.Points
        ) {
          object.geometry.dispose();

          if (
            Array.isArray(
              object.material,
            )
          ) {
            object.material.forEach(
              (material) =>
                material.dispose(),
            );
          } else {
            object.material.dispose();
          }
        }

        if (
          object instanceof
          THREE.Line
        ) {
          object.geometry.dispose();

          if (
            Array.isArray(
              object.material,
            )
          ) {
            object.material.forEach(
              (material) =>
                material.dispose(),
            );
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (
        mount.contains(
          renderer.domElement,
        )
      ) {
        mount.removeChild(
          renderer.domElement,
        );
      }

      planetMeshesRef.current.clear();
    };
  }, []);

  const selectedDefinition =
    PLANETS.find(
      (planet) =>
        planet.name === selectedPlanet,
    );

  const resetCamera = () => {
    const camera =
      cameraRef.current;

    const controls =
      controlsRef.current;

    if (!camera || !controls) return;

    camera.position.set(
      0,
      23,
      67,
    );

    controls.target.set(
      0,
      0,
      0,
    );

    controls.update();

    selectedPlanetRef.current =
      null;

    setSelectedPlanet(null);
  };

  const focusPlanet = (
    planetName: string,
  ) => {
    const mesh =
      planetMeshesRef.current.get(
        planetName,
      );

    const definition =
      PLANETS.find(
        (planet) =>
          planet.name ===
          planetName,
      );

    const camera =
      cameraRef.current;

    const controls =
      controlsRef.current;

    if (
      !mesh ||
      !definition ||
      !camera ||
      !controls
    ) {
      return;
    }

    selectedPlanetRef.current =
      planetName;

    setSelectedPlanet(
      planetName,
    );

    const direction =
      mesh.position
        .clone()
        .normalize();

    controls.target.copy(
      mesh.position,
    );

    camera.position.copy(
      mesh.position
        .clone()
        .add(
          direction.multiplyScalar(
            definition.radius * 5 +
              4,
          ),
        )
        .add(
          new THREE.Vector3(
            0,
            definition.radius * 2,
            0,
          ),
        ),
    );
  };

  const toggleFullscreen =
    async () => {
      const element =
        mountRef.current
          ?.parentElement;

      if (!element) return;

      if (
        document.fullscreenElement
      ) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#030712] text-white">
      <div
        ref={mountRef}
        className="absolute inset-0"
      />

      {/* Cinematic atmospheric overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,190,95,0.045),transparent_24%),radial-gradient(circle_at_18%_25%,rgba(68,116,255,0.07),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(168,71,255,0.055),transparent_30%)]" />

      {/* Top navigation */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/75 via-black/35 to-transparent px-5 pb-10 pt-5">
        <button
          onClick={() =>
            onNavigate("home")
          }
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 py-2.5 text-sm font-medium backdrop-blur-xl transition hover:bg-white/10"
        >
          <ArrowLeft
            size={17}
          />
          Back
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles
              size={17}
              className="text-cyan-300"
            />
            <h1 className="text-lg font-semibold tracking-wide">
              Solar System Explorer
            </h1>
          </div>

          <p className="mt-1 text-[11px] text-white/55">
            Cinematic 3D planetary visualization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setPaused(
                (value) =>
                  !value,
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 backdrop-blur-xl transition hover:bg-white/10"
            title={
              paused
                ? "Play"
                : "Pause"
            }
          >
            {paused ? (
              <Play size={17} />
            ) : (
              <Pause size={17} />
            )}
          </button>

          <button
            onClick={resetCamera}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 backdrop-blur-xl transition hover:bg-white/10"
            title="Reset view"
          >
            <RotateCcw
              size={17}
            />
          </button>

          <button
            onClick={
              toggleFullscreen
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 backdrop-blur-xl transition hover:bg-white/10"
            title="Fullscreen"
          >
            <Maximize2
              size={17}
            />
          </button>
        </div>
      </div>

      {/* Left info panel */}
      <div className="absolute left-5 top-24 z-10 w-[310px] max-w-[calc(100vw-40px)]">
        <div className="rounded-2xl border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="mb-3 flex items-center gap-2 text-cyan-200">
            <Info size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Explorer
            </span>
          </div>

          {selectedDefinition ? (
            <>
              <h2 className="text-2xl font-semibold">
                {selectedDefinition.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/65">
                {
                  selectedDefinition.description
                }
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">
                    Orbital zone
                  </div>
                  <div className="mt-1 text-sm">
                    {
                      selectedDefinition.distance
                    } AU scale
                  </div>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">
                    Visual radius
                  </div>
                  <div className="mt-1 text-sm">
                    {
                      selectedDefinition.radius
                    }
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">
                Explore the Solar System
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/60">
                Drag to orbit, scroll to zoom,
                and click a planet to focus it.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
                <Sun
                  size={14}
                  className="text-amber-300"
                />
                Enhanced solar illumination
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom planet selector */}
      <div className="absolute bottom-5 left-1/2 z-20 w-[calc(100%-30px)] max-w-5xl -translate-x-1/2">
        <div className="rounded-2xl border border-white/10 bg-black/55 p-2 shadow-2xl backdrop-blur-2xl">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PLANETS.map(
              (planet) => (
                <button
                  key={planet.name}
                  onClick={() =>
                    focusPlanet(
                      planet.name,
                    )
                  }
                  className={`min-w-[108px] rounded-xl border px-3 py-2.5 text-left transition ${
                    selectedPlanet ===
                    planet.name
                      ? "border-cyan-300/45 bg-cyan-300/10"
                      : "border-white/8 bg-white/[0.035] hover:bg-white/[0.08]"
                  }`}
                >
                  <div
                    className="mb-1 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        `#${planet.color.toString(16).padStart(6, "0")}`,
                      boxShadow:
                        `0 0 10px #${planet.color.toString(16).padStart(6, "0")}`,
                    }}
                  />

                  <div className="text-xs font-medium">
                    {planet.name}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-2 text-center text-[10px] text-white/35">
          Visual distances are normalized for exploration.
          Scientific ephemeris positioning is added separately.
        </div>
      </div>

      {/* Small status badge */}
      <div className="absolute right-5 top-24 z-10 hidden rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[10px] text-white/45 backdrop-blur-xl md:block">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        3D Renderer Active
      </div>
    </div>
  );
}
