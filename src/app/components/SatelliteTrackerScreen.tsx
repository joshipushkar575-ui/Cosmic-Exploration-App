import { useEffect, useState } from "react";
import { Satellite, RefreshCw, MapPin, Gauge, ArrowUp, ArrowLeft } from "lucide-react";
import { getLiveISSPosition, ISSLiveData } from "../services/api/satelliteService";

export default function SatelliteTrackerScreen({ onNavigate }: { onNavigate?: (screen: any) => void }) {
  const [data, setData] = useState<ISSLiveData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadISS = async () => {
    setLoading(true);

    const result = await getLiveISSPosition();

    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadISS();

    const interval = window.setInterval(loadISS, 120000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Satellite className="h-8 w-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold">ISS Tracker</h1>
              <p className="text-white/60">
                International Space Station • NORAD 25544
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin" />
            <p>Fetching live ISS orbital data...</p>
          </div>
        )}

        {!loading && data?.success && data.position && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <MapPin className="mb-3 h-6 w-6 text-cyan-400" />
              <p className="text-sm text-white/50">Latitude</p>
              <p className="text-2xl font-semibold">
                {data.position.latitude.toFixed(3)}°
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <MapPin className="mb-3 h-6 w-6 text-blue-400" />
              <p className="text-sm text-white/50">Longitude</p>
              <p className="text-2xl font-semibold">
                {data.position.longitude.toFixed(3)}°
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <ArrowUp className="mb-3 h-6 w-6 text-purple-400" />
              <p className="text-sm text-white/50">Altitude</p>
              <p className="text-2xl font-semibold">
                {data.position.altitudeKm.toFixed(1)} km
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Gauge className="mb-3 h-6 w-6 text-green-400" />
              <p className="text-sm text-white/50">Velocity</p>
              <p className="text-2xl font-semibold">
                {data.position.velocityKmS.toFixed(2)} km/s
              </p>
            </div>
          </div>
        )}

        {!loading && !data?.success && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="font-semibold">ISS data unavailable</p>
            <p className="mt-2 text-sm text-white/60">
              {data?.error || "Unable to fetch satellite data."}
            </p>

            <button
              onClick={loadISS}
              className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        <div className="mt-6 text-xs text-white/40">
          Data: Where The ISS At? • Live ISS telemetry
        </div>
      </div>
    </div>
  );
}
