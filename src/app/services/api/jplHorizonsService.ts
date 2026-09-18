import { supabase } from "../../../lib/supabase";

export interface JplHorizonsEphemeris {
  timestamp: string | null;
  azimuth: number;
  altitude: number;
  apparentMagnitude: number;
  surfaceBrightness: number;
  distanceAU: number;
  rangeRateKmS: number;
  solarElongation: number;
  sunTargetObserverAngle: number;
  constellation: string | null;
}

export interface JplHorizonsResponse {
  success: boolean;
  source: "NASA/JPL Horizons";
  target: string;
  targetName?: string;
  observer?: {
    latitude: number;
    longitude: number;
    elevation: number;
  };
  ephemeris?: JplHorizonsEphemeris;
  fetchedAt?: string;
  error?: string;
}

export async function getJplHorizonsData(
  target = "599",
  location?: {
    latitude?: number;
    longitude?: number;
    elevation?: number;
  },
): Promise<JplHorizonsResponse> {
  try {
    const body = {
      target,
      lat: location?.latitude,
      lon: location?.longitude,
      elevation: location?.elevation,
    };

    const { data, error } = await supabase.functions.invoke(
      "jpl-horizons",
      { body },
    );

    if (error) throw error;

    if (!data?.success) {
      throw new Error(data?.error || "JPL Horizons request failed.");
    }

    return data as JplHorizonsResponse;
  } catch (error) {
    console.warn("JPL Horizons request failed:", error);

    return {
      success: false,
      source: "NASA/JPL Horizons",
      target,
      error:
        error instanceof Error
          ? error.message
          : "JPL Horizons request failed.",
    };
  }
}
