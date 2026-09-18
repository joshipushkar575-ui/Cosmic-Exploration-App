import { supabase } from "../../../lib/supabase";

export type Ar00Type =
  | "lunar-phase"
  | "lunar-position"
  | "solar-position"
  | "sunrise-sunset"
  | "planets"
  | "constellations"
  | "meteor-showers"
  | "tonight";

export interface Ar00LunarPhase {
  phaseAngle: number;
  illuminatedFraction: number;
  phaseName: string;
  ageDays: number;
  isWaxing: boolean;
  lunationNumber: number;
  nextNewMoon?: { year: number; month: number; day: number };
  nextFullMoon?: { year: number; month: number; day: number };
  nextFirstQuarter?: { year: number; month: number; day: number };
  nextLastQuarter?: { year: number; month: number; day: number };
}

export interface Ar00Response<T = unknown> {
  success: boolean;
  source: "AR00.space";
  type: Ar00Type;
  data: T | null;
  fetchedAt?: string;
  error?: string;
}

export async function getAr00Data<T = unknown>(
  type: Ar00Type,
  date: Date = new Date(),
  location?: {
    latitude?: number;
    longitude?: number;
    elevation?: number;
  },
): Promise<Ar00Response<T>> {
  try {
    const body: Record<string, unknown> = {
      type,
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour:
        date.getUTCHours() +
        date.getUTCMinutes() / 60 +
        date.getUTCSeconds() / 3600,
    };

    if (location?.latitude !== undefined) body.lat = location.latitude;
    if (location?.longitude !== undefined) body.lon = location.longitude;
    if (location?.elevation !== undefined) body.elevation = location.elevation;

    const { data, error } = await supabase.functions.invoke(
      "ar00-astronomy",
      { body },
    );

    if (error) throw error;

    if (!data?.success) {
      throw new Error(data?.error || "AR00 request failed");
    }

    return data as Ar00Response<T>;
  } catch (error) {
    console.warn(`AR00 ${type} request failed:`, error);

    return {
      success: false,
      source: "AR00.space",
      type,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "AR00 request failed",
    };
  }
}

export async function getAr00LunarPhase(
  date: Date = new Date(),
): Promise<Ar00Response<Ar00LunarPhase>> {
  return getAr00Data<Ar00LunarPhase>("lunar-phase", date);
}
