import { supabase } from "../../../lib/supabase";
import {
  calculateISSPosition,
  ISSPosition,
} from "./issTrackingService";

export interface SatelliteRecord {
  OBJECT_NAME?: string;
  OBJECT_ID?: string;
  EPOCH?: string;
  MEAN_MOTION?: number;
  ECCENTRICITY?: number;
  INCLINATION?: number;
  RA_OF_ASC_NODE?: number;
  ARG_OF_PERICENTER?: number;
  MEAN_ANOMALY?: number;
  NORAD_CAT_ID?: number;
  [key: string]: unknown;
}

export interface SatelliteTLE {
  name?: string;
  line1: string;
  line2: string;
  epoch?: number;
}

export interface SatelliteDataResponse {
  success: boolean;
  source: string;
  satellite?: SatelliteRecord[];
  fetchedAt?: string;
  error?: string;
}

export interface ISSLiveData {
  success: boolean;
  source: string;
  position?: ISSPosition;
  satellite?: SatelliteRecord;
  error?: string;
}

export async function getISSData(): Promise<SatelliteDataResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "satellite-data",
    );

    if (error) throw error;

    if (!data?.success) {
      throw new Error(
        data?.error || "Satellite data request failed.",
      );
    }

    return data as SatelliteDataResponse;
  } catch (error) {
    return {
      success: false,
      source: "Where The ISS At?",
      error:
        error instanceof Error
          ? error.message
          : "ISS data request failed.",
    };
  }
}

export async function getLiveISSPosition(
  date = new Date(),
): Promise<ISSLiveData> {
  try {
    const response = await getISSData();

    if (!response.success || !response.satellite?.length) {
      throw new Error(
        response.error ||
          "No ISS orbital data available.",
      );
    }

    const satellite = response.satellite[0] as SatelliteRecord & {
      latitude?: number;
      longitude?: number;
      altitude?: number;
      velocity?: number;
      timestamp?: number;
    };

    if (
      typeof satellite.latitude !== "number" ||
      typeof satellite.longitude !== "number" ||
      typeof satellite.altitude !== "number"
    ) {
      throw new Error(
        "ISS position data is incomplete.",
      );
    }

    const position: ISSPosition = {
      latitude: satellite.latitude,
      longitude: satellite.longitude,
      altitudeKm: satellite.altitude,
      velocityKmS:
        typeof satellite.velocity === "number"
          ? satellite.velocity / 3600
          : 0,
      timestamp: date.toISOString(),
    };

    return {
      success: true,
      source: "Where The ISS At? + live TLE + telemetry",
      position,
      satellite,
    };
  } catch (error) {
    return {
      success: false,
      source: "Where The ISS At? + live TLE + telemetry",
      error:
        error instanceof Error
          ? error.message
          : "Live ISS position calculation failed.",
    };
  }
}
