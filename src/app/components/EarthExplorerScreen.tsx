import { useEffect, useRef, useState } from "react";
import { Globe2, Satellite, RefreshCw, ArrowLeft } from "lucide-react";
import * as THREE from "three";
import * as satellite from "satellite.js";
import { getLiveISSPosition, ISSLiveData } from "../services/api/satelliteService";

export default function EarthExplorerScreen({
  onNavigate,
}: {
  onNavigate?: (screen: any) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const orbitLineRef = useRef<THREE.Line | null>(null);

  const [data, setData] = useState<ISSLiveData | null>(null);
  const dataRef = useRef<ISSLiveData | null>(null);

  const loadISS = async () => {
    const result = await getLiveISSPosition();
    dataRef.current = result;
    setData(result);
  };

  const buildISSOrbit = (
    line1: string,
    line2: string,
    orbitLine: THREE.Line,
  ) => {
    try {
      const satrec = satellite.twoline2satrec(line1, line2);
      const points: THREE.Vector3[] = [];
      const earthRadiusKm = 6371;

      for (let i = 0; i <= 240; i++) {
        const minutes = (i - 120) * 1.5;
        const date = new Date(
          Date.now() + minutes * 60 * 1000,
        );

        const pv = satellite.propagate(satrec, date);

        if (
          !pv.position ||
          typeof pv.position === "boolean"
        ) {
          continue;
        }

        const xKm = pv.position.x;
        const yKm = pv.position.y;
        const zKm = pv.position.z;

        const radiusKm = Math.sqrt(
          xKm * xKm +
          yKm * yKm +
          zKm * zKm,
        );

        if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
          continue;
        }

        const scale = radiusKm / earthRadiusKm;

        points.push(
          new THREE.Vector3(
            (xKm / radiusKm) * scale,
            (zKm / radiusKm) * scale,
            (yKm / radiusKm) * scale,
          ),
        );
      }

      if (points.length > 1) {
        orbitLine.geometry.dispose();
        orbitLine.geometry =
          new THREE.BufferGeometry().setFromPoints(points);

        orbitLine.visible = true;

        console.log(
          "VYOM: Live ISS orbit generated:",
          points.length,
          "points",
        );
      }
    } catch (error) {
      console.error(
        "VYOM: TLE orbit generation failed:",
        error,
      );
    }
  };

  useEffect(() => {
    loadISS();
    const interval = window.setInterval(loadISS, 120000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const satelliteRecord = data?.satellite as
      | (typeof data.satellite & {
          tle?: {
            line1?: string;
            line2?: string;
          };
        })
      | undefined;

    const line1 = satelliteRecord?.tle?.line1;
    const line2 = satelliteRecord?.tle?.line2;

    if (!line1 || !line2) {
      console.warn("VYOM: Live TLE not available yet.");
      return;
    }

    const orbitLine = orbitLineRef.current;

    if (!orbitLine) {
      console.warn(
        "VYOM: Orbit renderer is not ready yet.",
      );
      return;
    }

    buildISSOrbit(line1, line2, orbitLine);
  }, [data]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01030a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.18,
        sizeAttenuation: true,
      }),
    );

    scene.add(stars);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(1, 128, 128);

    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load(
      "/textures/earth.jpg"
    );

    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 18,
      specular: new THREE.Color(0x446677),
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);
    earthRef.current = earth;

    const atmosphereGeometry = new THREE.SphereGeometry(1.035, 96, 96);

    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.13,
      side: THREE.BackSide,
    });

    const atmosphere = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial,
    );

    earthGroup.add(atmosphere);

    const cloudGeometry = new THREE.SphereGeometry(1.012, 96, 96);

    const cloudTexture = textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
    );

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });

    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);

    const ambientLight = new THREE.AmbientLight(0x557799, 0.18);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x55aaff, 0.45);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // ISS orbital path — live TLE propagation
    const orbitGeometry = new THREE.BufferGeometry();

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });

    const orbitLine = new THREE.Line(
      orbitGeometry,
      orbitMaterial,
    );

    earthGroup.add(orbitLine);
    orbitLineRef.current = orbitLine;

    // ISS marker
    const issMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
    );

    const issGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.28,
      }),
    );

    earthGroup.add(issMarker);
    earthGroup.add(issGlow);

    const updateISSMarker = () => {
      const satelliteRecord = dataRef.current?.satellite as
        | (typeof dataRef.current.satellite & {
            tle?: {
              line1?: string;
              line2?: string;
            };
          })
        | undefined;

      const line1 = satelliteRecord?.tle?.line1;
      const line2 = satelliteRecord?.tle?.line2;

      if (!line1 || !line2) return;

      try {
        const satrec = satellite.twoline2satrec(
          line1,
          line2,
        );

        const now = new Date();
        const pv = satellite.propagate(satrec, now);

        if (
          !pv.position ||
          typeof pv.position === "boolean"
        ) {
          return;
        }

        const xKm = pv.position.x;
        const yKm = pv.position.y;
        const zKm = pv.position.z;

        const radiusKm = Math.sqrt(
          xKm * xKm +
          yKm * yKm +
          zKm * zKm,
        );

        if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
          return;
        }

        const radius = radiusKm / 6371;

        issMarker.position.set(
          (xKm / radiusKm) * radius,
          (zKm / radiusKm) * radius,
          (yKm / radiusKm) * radius,
        );

        issGlow.position.copy(issMarker.position);
      } catch (error) {
        console.warn(
          "VYOM: ISS marker propagation failed",
          error,
        );
      }
    };

    let animationId = 0;
    let targetRotationX = 0.12;
    let targetRotationY = -0.45;
    let rotationX = targetRotationX;
    let rotationY = targetRotationY;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const pointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      targetRotationY += dx * 0.006;
      targetRotationX += dy * 0.006;

      targetRotationX = Math.max(
        -1.2,
        Math.min(1.2, targetRotationX),
      );

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const pointerUp = () => {
      dragging = false;
    };

    const wheel = (event: WheelEvent) => {
      event.preventDefault();

      camera.position.z += event.deltaY * 0.0025;
      camera.position.z = Math.max(
        1.65,
        Math.min(5, camera.position.z),
      );
    };

    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointerleave", pointerUp);
    renderer.domElement.addEventListener("wheel", wheel, {
      passive: false,
    });

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      rotationX += (targetRotationX - rotationX) * 0.08;
      rotationY += (targetRotationY - rotationY) * 0.08;

      earthGroup.rotation.x = rotationX;
      earthGroup.rotation.y = rotationY;

      if (!dragging) {
        targetRotationY += 0.00045;
      }

      clouds.rotation.x = rotationX;
      clouds.rotation.y = rotationY + 0.01;

      updateISSMarker();

      stars.rotation.y += 0.00005;

      renderer.render(scene, camera);
    };

    animate();

    const resize = () => {
      if (!container.clientWidth || !container.clientHeight) return;

      camera.aspect =
        container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight,
      );
    };

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);

      renderer.domElement.removeEventListener(
        "pointerdown",
        pointerDown,
      );
      renderer.domElement.removeEventListener(
        "pointermove",
        pointerMove,
      );
      renderer.domElement.removeEventListener(
        "pointerup",
        pointerUp,
      );
      renderer.domElement.removeEventListener(
        "pointerleave",
        pointerUp,
      );
      renderer.domElement.removeEventListener("wheel", wheel);

      earthGeometry.dispose();
      atmosphereGeometry.dispose();
      cloudGeometry.dispose();
      starGeometry.dispose();

      earthMaterial.dispose();
      atmosphereMaterial.dispose();
      cloudMaterial.dispose();
      earthTexture.dispose();
      cloudTexture.dispose();
      orbitLineRef.current = null;
      orbitMaterial.dispose();
      issMarker.geometry.dispose();
      issMarker.material.dispose();
      issGlow.geometry.dispose();
      issGlow.material.dispose();
      (stars.material as THREE.Material).dispose();

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const position = data?.position;

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <div className="relative min-h-screen">
        <div
          ref={mountRef}
          className="absolute inset-0"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.45)_75%,rgba(0,0,0,.85)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
          <div className="pointer-events-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>

            <button
              onClick={loadISS}
              className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl transition hover:bg-white/10"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          <div className="pointer-events-none mt-8">
            <div className="flex items-center gap-3">
              <Globe2 className="h-8 w-8 text-cyan-300" />

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Earth Explorer
                </h1>

                <p className="text-sm text-white/50">
                  Real-time Earth • Deep Space • ISS
                </p>
              </div>
            </div>
          </div>

          {position && (
            <div className="pointer-events-none mt-auto grid max-w-3xl grid-cols-2 gap-3 pb-2 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                <p className="text-xs text-white/40">Latitude</p>
                <p className="text-xl font-semibold">
                  {position.latitude.toFixed(2)}°
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                <p className="text-xs text-white/40">Longitude</p>
                <p className="text-xl font-semibold">
                  {position.longitude.toFixed(2)}°
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                <p className="text-xs text-white/40">Altitude</p>
                <p className="text-xl font-semibold">
                  {position.altitudeKm.toFixed(1)} km
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                <p className="text-xs text-white/40">Velocity</p>
                <p className="text-xl font-semibold">
                  {position.velocityKmS.toFixed(2)} km/s
                </p>
              </div>
            </div>
          )}

          <div className="pointer-events-none pb-2 pt-3 text-xs text-white/35">
            <Satellite className="mr-1 inline h-3 w-3" />
            Live ISS telemetry • Drag to rotate • Scroll to zoom
          </div>
        </div>
      </div>
    </div>
  );
}
