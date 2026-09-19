import { useEffect, useState } from "react";
import { Activity, Globe2, Radio, Rocket, Satellite } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { getLiveISSPosition } from "../services/api/satelliteService";

type ISSData = {
  success: boolean;
  position?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    velocity?: number;
  };
  error?: string;
};

type SpacecraftData = {
  success: boolean;
  targetName?: string;
  position?: {
    x: number;
    y: number;
    z: number;
    vx?: number;
    vy?: number;
    vz?: number;
    units?: string;
  };
  error?: string;
};

export default function LiveSpaceDataCenterScreen({
  onNavigate,
}: {
  onNavigate: (screen: string) => void;
}) {
  const [iss, setIss] = useState<ISSData | null>(null);
  const [jwst, setJwst] = useState<SpacecraftData | null>(null);
  const [hubble, setHubble] = useState<SpacecraftData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    try {
      const [issResult, jwstResult, hubbleResult] = await Promise.all([
        getLiveISSPosition(),
        supabase.functions.invoke("jpl-horizons", {
          body: { target: "-170", center: "500@399" },
        }),
        supabase.functions.invoke("jpl-horizons", {
          body: { target: "-48", center: "500@399" },
        }),
      ]);

      setIss({
        success: issResult.success,
        position: issResult.position
          ? {
              latitude: issResult.position.latitude,
              longitude: issResult.position.longitude,
              altitude: issResult.position.altitudeKm,
              velocity: issResult.position.velocityKmS,
            }
          : undefined,
        error: issResult.error,
      });

      setJwst(jwstResult.data ?? null);
      setHubble(hubbleResult.data ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    const timer = window.setInterval(loadData, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const Card = ({
    icon,
    title,
    subtitle,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-300">
          {icon}
        </div>

        <div>
          <div className="font-semibold text-white">{title}</div>
          <div className="text-xs text-white/35">{subtitle}</div>
        </div>

        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[9px] uppercase tracking-wider text-emerald-300">
            Live
          </span>
        </div>
      </div>

      <div className="relative mt-5">{children}</div>
    </div>
  );

  const Value = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/30">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-white/85">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <button
          onClick={() => onNavigate("home")}
          className="mb-6 text-sm text-white/45 transition hover:text-white"
        >
          ← Back to VYOM
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
              <Activity className="text-cyan-300" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Live Space Data Center
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Real-time telemetry from NASA/JPL and live orbital data.
              </p>
            </div>
          </div>
        </div>

        {loading && !iss ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/40">
            Connecting to live space telemetry...
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <Card
              icon={<Satellite size={21} />}
              title="International Space Station"
              subtitle="Live orbital position"
            >
              {iss?.position ? (
                <div className="grid grid-cols-2 gap-3">
                  <Value
                    label="Latitude"
                    value={`${iss.position.latitude?.toFixed(3) ?? "—"}°`}
                  />
                  <Value
                    label="Longitude"
                    value={`${iss.position.longitude?.toFixed(3) ?? "—"}°`}
                  />
                  <Value
                    label="Altitude"
                    value={`${iss.position.altitude?.toFixed(1) ?? "—"} km`}
                  />
                  <Value
                    label="Velocity"
                    value={`${iss.position.velocity?.toFixed(2) ?? "—"} km/s`}
                  />
                </div>
              ) : (
                <div className="text-sm text-white/40">
                  Live ISS telemetry unavailable.
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-[10px] text-white/25">
                <Radio size={12} />
                Where The ISS At? live telemetry
              </div>
            </Card>

            <Card
              icon={<Rocket size={21} />}
              title="James Webb Space Telescope"
              subtitle="NASA/JPL Horizons"
            >
              {jwst?.position ? (
                <div className="grid grid-cols-3 gap-3">
                  <Value label="X" value={`${jwst.position.x.toFixed(0)} km`} />
                  <Value label="Y" value={`${jwst.position.y.toFixed(0)} km`} />
                  <Value label="Z" value={`${jwst.position.z.toFixed(0)} km`} />
                </div>
              ) : (
                <div className="text-sm text-white/40">
                  JWST telemetry unavailable.
                </div>
              )}

              <div className="mt-4 text-[10px] text-white/25">
                Position relative to Earth-centered JPL reference frame
              </div>
            </Card>

            <Card
              icon={<Globe2 size={21} />}
              title="Hubble Space Telescope"
              subtitle="NASA/JPL Horizons"
            >
              {hubble?.position ? (
                <div className="grid grid-cols-3 gap-3">
                  <Value
                    label="X"
                    value={`${hubble.position.x.toFixed(0)} km`}
                  />
                  <Value
                    label="Y"
                    value={`${hubble.position.y.toFixed(0)} km`}
                  />
                  <Value
                    label="Z"
                    value={`${hubble.position.z.toFixed(0)} km`}
                  />
                </div>
              ) : (
                <div className="text-sm text-white/40">
                  Hubble telemetry unavailable.
                </div>
              )}

              <div className="mt-4 text-[10px] text-white/25">
                NASA/JPL Horizons live ephemeris
              </div>
            </Card>

            <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                VYOM telemetry network
              </div>

              <div className="mt-3 text-2xl font-semibold">
                Live Space Infrastructure
              </div>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                VYOM combines live satellite tracking with NASA/JPL
                ephemeris data to create a unified space-data layer.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["ISS", "NASA/JPL", "JWST", "Hubble", "Auto Refresh"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/45"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>

              <button
                onClick={loadData}
                className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-200 transition hover:bg-cyan-400/20"
              >
                Refresh telemetry
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-[10px] text-white/20">
          Data refreshes automatically every 30 seconds.
        </div>
      </div>
    </div>
  );
}
