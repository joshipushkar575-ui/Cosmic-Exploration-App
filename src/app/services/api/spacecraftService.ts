import { supabase } from "../../../lib/supabase";

export interface Spacecraft {
  id: string;
  name: string;
  target: string;
  mission: string;
  agency: string;
  description: string;
}

export interface SpacecraftPosition {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  epoch?: string;
  units?: string;
}

export interface SpacecraftData {
  success: boolean;
  spacecraft: Spacecraft;
  position?: SpacecraftPosition;
  error?: string;
}

export const VYOM_SPACECRAFT: Spacecraft[] = [
  {
    id: "jwst",
    name: "James Webb Space Telescope",
    target: "-170",
    mission: "JWST",
    agency: "NASA / ESA / CSA",
    description:
      "Infrared space telescope operating near the Sun-Earth L2 region.",
  },
  {
    id: "hubble",
    name: "Hubble Space Telescope",
    target: "-48",
    mission: "HST",
    agency: "NASA / ESA",
    description:
      "Earth-orbiting space telescope observing the universe across multiple wavelengths.",
  },
  {
    id: "cassini",
    name: "Cassini",
    target: "-82",
    mission: "Cassini-Huygens",
    agency: "NASA / ESA / ASI",
    description:
      "Historic Saturn exploration spacecraft.",
  },
];

export async function getSpacecraftData(
  spacecraft: Spacecraft,
): Promise<SpacecraftData> {
  try {
    const { data, error } =
      await supabase.functions.invoke("jpl-horizons", {
        body: {
          target: spacecraft.target,
          center: "500@399",
        },
      });

    if (error) throw error;

    return {
      success: Boolean(data?.success),
      spacecraft,
      position: data?.position,
      error: data?.error,
    };
  } catch (error) {
    return {
      success: false,
      spacecraft,
      error:
        error instanceof Error
          ? error.message
          : "Spacecraft data unavailable.",
    };
  }
}
