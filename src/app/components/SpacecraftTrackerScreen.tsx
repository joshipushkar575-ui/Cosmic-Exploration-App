import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  ArrowLeft,
  RefreshCw,
  Satellite,
  Radio,
  Activity,
  Globe2,
  Gauge,
  MapPin,
} from "lucide-react";
import {
  getSpacecraftData,
  VYOM_SPACECRAFT,
  type Spacecraft,
  type SpacecraftData,
} from "../services/api/spacecraftService";

interface Props {
  onNavigate: (screen: any) => void;
}

export default function SpacecraftTrackerScreen({ onNavigate }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const spacecraftRef = useRef<THREE.Group | null>(null);
  const targetPositionRef = useRef(new THREE.Vector3());

  const [selected, setSelected] = useState<Spacecraft>(VYOM_SPACECRAFT[0]);
  const [data, setData] = useState<SpacecraftData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const result = await getSpacecraftData(selected);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selected.id]);

  useEffect(() => {
    const interval = window.setInterval(loadData, 30000);
    return () => window.clearInterval(interval);
  }, [selected.id]);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01030a);

    // ---------------- DEEP SPACE NEBULA ----------------

    const nebulaCanvas = document.createElement("canvas");
    nebulaCanvas.width = 1024;
    nebulaCanvas.height = 1024;

    const nebulaCtx = nebulaCanvas.getContext("2d");

    if (nebulaCtx) {
      const base = nebulaCtx.createRadialGradient(
        500,
        480,
        20,
        500,
        480,
        620,
      );

      base.addColorStop(0, "rgba(38, 18, 85, 0.32)");
      base.addColorStop(0.38, "rgba(18, 38, 105, 0.18)");
      base.addColorStop(0.72, "rgba(8, 18, 55, 0.10)");
      base.addColorStop(1, "rgba(0, 0, 0, 0)");

      nebulaCtx.fillStyle = base;
      nebulaCtx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 90; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = 30 + Math.random() * 140;

        const cloud = nebulaCtx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius,
        );

        cloud.addColorStop(0, "rgba(80, 55, 180, 0.045)");
        cloud.addColorStop(0.55, "rgba(35, 80, 170, 0.018)");
        cloud.addColorStop(1, "rgba(0, 0, 0, 0)");

        nebulaCtx.fillStyle = cloud;
        nebulaCtx.fillRect(
          x - radius,
          y - radius,
          radius * 2,
          radius * 2,
        );
      }
    }

    const nebulaTexture = new THREE.CanvasTexture(nebulaCanvas);

    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(480, 32, 32),
      new THREE.MeshBasicMaterial({
        map: nebulaTexture,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );

    scene.add(nebula);

    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.01,
      1000,
    );
    camera.position.set(0, 0.45, 5.25);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    mount.appendChild(renderer.domElement);

    // ---------------- CINEMATIC STARFIELD ----------------

    const createStars = (
      count: number,
      spread: number,
      size: number,
      opacity: number,
    ) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        const radius = spread * (0.35 + Math.random() * 0.65);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      );
    };

    const stars = createStars(14000, 140, 0.032, 0.82);
    const brightStars = createStars(900, 105, 0.075, 1.0);

    scene.add(stars);
    scene.add(brightStars);

    // ---------------- LIGHTING ----------------

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const sunLight = new THREE.PointLight(0xfff1d0, 18, 70);
    sunLight.position.set(-3.5, 2.2, -4);
    scene.add(sunLight);

    // Soft cinematic fill light so spacecraft details remain visible
    const fillLight = new THREE.PointLight(0x8bdcff, 7, 35);
    fillLight.position.set(-4, 2.5, 3);
    scene.add(fillLight);

    // Gentle neutral rim light
    const rimLight = new THREE.PointLight(0xffffff, 5, 30);
    rimLight.position.set(3, -1, -3);
    scene.add(rimLight);

    // ---------------- REALISTIC SUN ----------------

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 96, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffb52e,
      }),
    );

    sun.position.set(-3.4, 1.8, -3.5);

    // Animated solar-surface shader
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;

        varying vec3 vNormal;
        varying vec3 vPosition;

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
              mix(hash(i), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
              f.y
            ),
            mix(
              mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
              f.y
            ),
            f.z
          );
        }

        void main() {
          vec3 p = normalize(vPosition);

          float n1 = noise(p * 7.0 + time * 0.08);
          float n2 = noise(p * 18.0 - time * 0.12);
          float n3 = noise(p * 42.0 + time * 0.18);

          float surface = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;

          vec3 deepOrange = vec3(1.0, 0.22, 0.015);
          vec3 orange = vec3(1.0, 0.48, 0.035);
          vec3 yellow = vec3(1.0, 0.82, 0.18);
          vec3 whiteHot = vec3(1.0, 0.96, 0.70);

          vec3 color = mix(deepOrange, orange, surface);
          color = mix(color, yellow, smoothstep(0.42, 0.72, surface));
          color = mix(color, whiteHot, smoothstep(0.72, 0.95, surface));

          float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.2);

          color += vec3(1.0, 0.32, 0.02) * rim * 0.35;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    sun.material = sunMaterial;
    scene.add(sun);

    // Solar corona
    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.66, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xff8a18,
        transparent: true,
        opacity: 0.10,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );

    sun.add(sunGlow);

    const sunGlowOuter = new THREE.Mesh(
      new THREE.SphereGeometry(0.88, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xff5a00,
        transparent: true,
        opacity: 0.035,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );

    sun.add(sunGlowOuter);

    // ---------------- REALISTIC EARTH ----------------

    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load(
      "/textures/earth.jpg",
    );

    const earthNormal = textureLoader.load(
      "/textures/earth_normal.jpg",
    );

    const earthSpecular = textureLoader.load(
      "/textures/earth_specular.jpg",
    );

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 128),
      new THREE.MeshPhongMaterial({
        map: earthTexture,
        normalMap: earthNormal,
        normalScale: new THREE.Vector2(0.55, 0.55),
        specularMap: earthSpecular,
        specular: new THREE.Color(0x6ea8ff),
        shininess: 24,
        bumpScale: 0.035,
      }),
    );

    scene.add(earth);

    // ---------------- EARTH CLOUDS ----------------

    const cloudTexture = textureLoader.load(
      "/textures/earth_clouds.png",
    );

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.018, 128, 128),
      new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
        shininess: 4,
      }),
    );

    scene.add(clouds);

    // ---------------- EARTH ATMOSPHERE ----------------

    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,

      vertexShader: `
        varying vec3 vWorldNormal;

        void main() {
          vec4 worldPosition =
            modelMatrix * vec4(position, 1.0);

          vWorldNormal =
            normalize(worldPosition.xyz - modelMatrix[3].xyz);

          gl_Position =
            projectionMatrix *
            viewMatrix *
            worldPosition;
        }
      `,

      fragmentShader: `
        varying vec3 vWorldNormal;

        void main() {
          vec3 viewDir =
            normalize(cameraPosition);

          float fresnel =
            pow(
              1.0 - abs(dot(vWorldNormal, viewDir)),
              3.2
            );

          vec3 atmosphereColor =
            vec3(0.12, 0.48, 1.0);

          gl_FragColor =
            vec4(
              atmosphereColor,
              fresnel * 0.18
            );
        }
      `,
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.075, 96, 96),
      atmosphereMaterial,
    );

    scene.add(atmosphere);

    // ---------------- REFERENCE ORBIT ----------------

    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= 256; i++) {
      const angle = (i / 256) * Math.PI * 2;

      orbitPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * 2.1,
          Math.sin(angle) * 0.2,
          Math.sin(angle) * 2.1,
        ),
      );
    }

    orbitGeometry.setFromPoints(orbitPoints);

    const orbit = new THREE.Line(
      orbitGeometry,
      new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.18,
      }),
    );

    scene.add(orbit);

    // ---------------- SPACECRAFT ----------------

    const spacecraft = new THREE.Group();
    spacecraftRef.current = spacecraft;

    // ---------------- NASA OFFICIAL 3D MODEL ----------------

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const modelPath =
      selected.id === "jwst"
        ? "/models/spacecraft/jwst.glb"
        : selected.id === "hubble"
          ? "/models/spacecraft/hubble.glb"
          : "/models/spacecraft/cassini.glb";

    gltfLoader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.roughness = Math.min(material.roughness, 0.42);
                material.metalness = Math.max(material.metalness, 0.25);
              }
            });
          }
        });

        // Normalize model size
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension > 0) {
          const targetSize =
            selected.id === "jwst"
              ? 1.35
              : selected.id === "hubble"
                ? 1.15
                : 1.10;

          model.scale.setScalar(targetSize / maxDimension);
        }

        // Center model
        const centeredBox = new THREE.Box3().setFromObject(model);
        const center = centeredBox.getCenter(new THREE.Vector3());
        model.position.sub(center);

        spacecraft.add(model);

        console.log(
          `NASA 3D model loaded: ${selected.name}`,
        );
      },
      undefined,
      (error) => {
        console.error(
          `NASA 3D model failed to load: ${selected.name}`,
          error,
        );
      },
    );

    // Subtle cyan tracking beacon
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
      }),
    );

    beacon.position.y = 0.65;
    spacecraft.add(beacon);

    // Very subtle atmospheric glow
    const spacecraftGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.055,
        depthWrite: false,
      }),
    );

    spacecraft.add(spacecraftGlow);

    scene.add(spacecraft);

    // ---------------- ANIMATION ----------------

    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      earth.rotation.y += 0.00065;
      clouds.rotation.y += 0.00082;
      clouds.rotation.y += 0.00072;
      stars.rotation.y += 0.000012;
      brightStars.rotation.y -= 0.000018;

      spacecraft.rotation.y += 0.004;
      spacecraft.rotation.x += 0.002;

      if (sunMaterial.uniforms?.time) {
        sunMaterial.uniforms.time.value += 0.012;
      }

      sun.rotation.y += 0.0012;

      spacecraft.position.lerp(
        targetPositionRef.current,
        0.045,
      );

      renderer.render(scene, camera);
    };

    animate();

    const resize = () => {
      if (!mountRef.current) return;

      camera.aspect =
        mountRef.current.clientWidth /
        mountRef.current.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // JPL Earth-centered vector -> visual position
  useEffect(() => {
    const position = data?.position;

    if (
      !position ||
      !Number.isFinite(position.x) ||
      !Number.isFinite(position.y) ||
      !Number.isFinite(position.z)
    ) {
      return;
    }

    const vector = new THREE.Vector3(
      position.x,
      position.z,
      position.y,
    );

    const distance = vector.length();

    const visualDistance =
      distance > 0
        ? 1.35 + Math.log10(distance + 1) * 0.45
        : 1.5;

    vector.normalize().multiplyScalar(visualDistance);

    targetPositionRef.current.copy(vector);
  }, [data]);

  const distance =
    data?.position &&
    Number.isFinite(data.position.x) &&
    Number.isFinite(data.position.y) &&
    Number.isFinite(data.position.z)
      ? Math.sqrt(
          data.position.x ** 2 +
            data.position.y ** 2 +
            data.position.z ** 2,
        )
      : null;

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black/50 px-5 py-4 backdrop-blur-xl">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <Satellite
            className="text-cyan-300"
            size={23}
          />

          <div>
            <div className="font-semibold tracking-wide">
              VYOM Space Network
            </div>

            <div className="text-xs text-white/40">
              NASA / JPL Horizons
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </header>

      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[300px_1fr_330px]">
        {/* LEFT */}
        <aside className="border-r border-white/10 bg-white/[0.02] p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Spacecraft
          </div>

          <div className="space-y-2">
            {VYOM_SPACECRAFT.map((spacecraft) => (
              <button
                key={spacecraft.id}
                onClick={() => setSelected(spacecraft)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selected.id === spacecraft.id
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2">
                    <Satellite size={18} />
                  </div>

                  <div>
                    <div className="font-medium">
                      {spacecraft.name}
                    </div>

                    <div className="mt-1 text-xs text-white/40">
                      {spacecraft.mission}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-5 text-white/45">
            Position data comes directly from NASA/JPL Horizons.
            VYOM does not invent unavailable spacecraft telemetry.
          </div>
        </aside>

        {/* 3D VIEW */}
        <main className="relative min-h-[560px] overflow-hidden">
          <div
            ref={mountRef}
            className="absolute inset-0"
          />

          <div className="pointer-events-none absolute left-6 top-6">
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">
              Live Deep Space View
            </div>

            <div className="mt-2 text-2xl font-semibold">
              {selected.name}
            </div>

            <div className="mt-1 text-xs text-white/40">
              Earth-centered JPL state vector
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl">
            <Radio size={14} className="text-cyan-300" />

            <div>
              <div className="text-xs text-cyan-300">
                LIVE JPL TELEMETRY
              </div>

              <div className="text-[10px] text-white/35">
                Auto refresh: 30s
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT */}
        <aside className="border-l border-white/10 bg-white/[0.02] p-5">
          <div className="mb-5 flex items-center gap-2">
            <Activity
              size={18}
              className="text-cyan-300"
            />
            <span className="font-semibold">
              Telemetry
            </span>
          </div>

          {data?.success && data.position ? (
            <div className="space-y-4">
              {distance !== null && (
                <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] p-4">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/45">
                      <MapPin size={13} />
                      Distance from Earth
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-emerald-300">
                        Live
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-1 text-xl font-semibold text-cyan-300">
                    {distance.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    km
                  </div>

                  <div className="relative mt-2 flex items-center gap-1.5 text-[10px] text-white/30">
                    <Radio size={11} />
                    NASA/JPL Horizons telemetry
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                  <Globe2 size={14} />
                  Position
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/45">X</span>
                    <span>
                      {data.position.x.toFixed(3)} km
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/45">Y</span>
                    <span>
                      {data.position.y.toFixed(3)} km
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/45">Z</span>
                    <span>
                      {data.position.z.toFixed(3)} km
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                  <Gauge size={14} />
                  Velocity
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/45">VX</span>
                    <span>
                      {data.position.vx?.toFixed(5) ?? "—"} km/s
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/45">VY</span>
                    <span>
                      {data.position.vy?.toFixed(5) ?? "—"} km/s
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/45">VZ</span>
                    <span>
                      {data.position.vz?.toFixed(5) ?? "—"} km/s
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">
                <div className="text-xs text-emerald-300">
                  ✓ JPL VERIFIED
                </div>

                <div className="mt-1 text-[11px] text-white/40">
                  Epoch: {data.position.epoch ?? "Unavailable"}
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
              Fetching NASA/JPL telemetry...
            </div>
          ) : selected.id === "cassini" ? (
            <div className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-500/[0.10] via-white/[0.03] to-transparent p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                      <Satellite className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-amber-300/70">
                        Historical Mission
                      </div>
                      <div className="text-base font-semibold text-white">
                        Cassini–Huygens
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-amber-200">
                    Completed
                  </span>
                </div>

                <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-1 text-[11px] uppercase tracking-wider text-white/40">
                    Mission Status
                  </div>
                  <div className="text-sm font-medium text-white">
                    Mission completed — 15 September 2017
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-white/45">
                    Cassini ended its Saturn mission in 2017. NASA/JPL Horizons
                    does not provide a current ephemeris after the mission end.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">
                      Mission
                    </div>
                    <div className="mt-1 text-xs text-white/75">
                      Cassini–Huygens
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">
                      Destination
                    </div>
                    <div className="mt-1 text-xs text-white/75">
                      Saturn System
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">
                      Agency
                    </div>
                    <div className="mt-1 text-xs text-white/75">
                      NASA / ESA / ASI
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/35">
                      Live Telemetry
                    </div>
                    <div className="mt-1 text-xs text-amber-200/80">
                      Unavailable
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-white/35">
                  <Radio className="h-3.5 w-3.5" />
                  NASA/JPL Horizons • Historical spacecraft record
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/50">
              {data?.error || "Spacecraft telemetry unavailable."}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
