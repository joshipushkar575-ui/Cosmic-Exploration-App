import {
  eciToGeodetic,
  gstime,
  json2satrec,
  propagate,
} from "satellite.js";

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKmS: number;
  timestamp: string;
}

export function calculateISSPosition(
  orbitalData: Record<string, unknown>,
  date = new Date(),
): ISSPosition {
  const satrec = json2satrec(orbitalData);

  const result = propagate(satrec, date);

  if (
    !result ||
    !result.position ||
    typeof result.position === "boolean"
  ) {
    throw new Error("Unable to calculate ISS position.");
  }

  const positionEci = result.position;
  const velocity = result.velocity;

  const geodetic = eciToGeodetic(
    positionEci,
    gstime(date),
  );

  const velocityKmS =
    velocity && typeof velocity !== "boolean"
      ? Math.sqrt(
          velocity.x ** 2 +
            velocity.y ** 2 +
            velocity.z ** 2,
        )
      : 0;

  return {
    latitude: (geodetic.latitude * 180) / Math.PI,
    longitude: (geodetic.longitude * 180) / Math.PI,
    altitudeKm: geodetic.height,
    velocityKmS,
    timestamp: date.toISOString(),
  };
}
