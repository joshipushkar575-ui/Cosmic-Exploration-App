import { J2000_EPOCH } from './constants';
import { HorizontalCoordinates, ObserverLocation } from './types';

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Normalizes an angle into [0, 360) degrees.
 */
export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * Normalizes an angle into [0, 24) hours.
 */
export function normalizeHours(hours: number): number {
  let h = hours % 24;
  if (h < 0) h += 24;
  return h;
}

/**
 * Converts a JS Date to Julian Date (UT).
 */
export function toJulianDate(date: Date): number {
  const time = date.getTime();
  // Unix timestamp 0 (1970-01-01T00:00:00Z) corresponds to JD 2440587.5
  return time / 86400000.0 + 2440587.5;
}

/**
 * Julian Centuries from J2000.0.
 */
export function toJulianCenturies(jd: number): number {
  return (jd - J2000_EPOCH) / 36525.0;
}

/**
 * Mean obliquity of the ecliptic (in degrees) at epoch T.
 */
export function meanObliquity(T: number): number {
  // IAU formula (degrees)
  return 23.4392911 - 0.013004167 * T - 0.000000164 * T * T + 0.0000005036 * T * T * T;
}

/**
 * Greenwich Mean Sidereal Time (GMST) in degrees.
 */
export function greenwichMeanSiderealTime(jd: number): number {
  const T = toJulianCenturies(jd);
  // IAU formula for GMST in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  return normalizeDegrees(gmst);
}

/**
 * Local Sidereal Time (LST) in degrees.
 */
export function localSiderealTime(jd: number, longitudeDeg: number): number {
  return normalizeDegrees(greenwichMeanSiderealTime(jd) + longitudeDeg);
}

/**
 * Converts Ecliptic coordinates (longitude, latitude in degrees) to
 * Equatorial coordinates (Right Ascension in degrees, Declination in degrees).
 */
export function eclipticToEquatorial(
  eclipticLonDeg: number,
  eclipticLatDeg: number,
  obliquityDeg: number
): { raDeg: number; decDeg: number; raHours: number } {
  const lambda = eclipticLonDeg * DEG_TO_RAD;
  const beta = eclipticLatDeg * DEG_TO_RAD;
  const eps = obliquityDeg * DEG_TO_RAD;

  const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda);
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));

  const y = Math.sin(lambda) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps);
  const x = Math.cos(lambda);
  let ra = Math.atan2(y, x);

  const raDeg = normalizeDegrees(ra * RAD_TO_DEG);
  const decDeg = dec * RAD_TO_DEG;
  const raHours = normalizeHours(raDeg / 15.0);

  return { raDeg, decDeg, raHours };
}

/**
 * Converts Equatorial coordinates (RA in degrees, Dec in degrees) to
 * Horizontal topocentric coordinates (Altitude in degrees, Azimuth in degrees).
 * Azimuth: 0° = North, 90° = East, 180° = South, 270° = West.
 */
export function equatorialToHorizontal(
  raDeg: number,
  decDeg: number,
  location: ObserverLocation,
  date: Date
): HorizontalCoordinates {
  const jd = toJulianDate(date);
  const lstDeg = localSiderealTime(jd, location.longitude);

  // Hour Angle H = LST - RA (in degrees)
  const H = (lstDeg - raDeg) * DEG_TO_RAD;
  const phi = location.latitude * DEG_TO_RAD;
  const delta = decDeg * DEG_TO_RAD;

  // Altitude h: sin(h) = sin(phi)*sin(delta) + cos(phi)*cos(delta)*cos(H)
  const sinH = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
  let alt = Math.asin(Math.max(-1, Math.min(1, sinH))) * RAD_TO_DEG;

  // Azimuth A: tan(A) = sin(H) / (cos(H)*sin(phi) - tan(delta)*cos(phi))
  const y = Math.sin(H);
  const x = Math.cos(H) * Math.sin(phi) - Math.tan(delta) * Math.cos(phi);
  // Astronomer's azimuth from South -> convert to standard 0 = North
  let az = Math.atan2(y, x) * RAD_TO_DEG + 180.0;
  az = normalizeDegrees(az);

  // Atmospheric refraction correction
  alt = applyRefraction(alt);

  return {
    altitude: parseFloat(alt.toFixed(2)),
    azimuth: parseFloat(az.toFixed(2))
  };
}

/**
 * Simple atmospheric refraction formula (Saemundsson / Bennett).
 * Adds refraction in degrees to apparent altitude.
 */
export function applyRefraction(trueAltitudeDeg: number): number {
  if (trueAltitudeDeg < -2.0) return trueAltitudeDeg;
  // Refraction formula in arcminutes
  const h = Math.max(-1.0, trueAltitudeDeg);
  const rArcmin = 1.02 / Math.tan((h + 10.3 / (h + 5.11)) * DEG_TO_RAD);
  return trueAltitudeDeg + rArcmin / 60.0;
}
