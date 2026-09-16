import {
  DEG_TO_RAD,
  RAD_TO_DEG,
  normalizeDegrees,
  toJulianDate,
  toJulianCenturies,
  meanObliquity,
  eclipticToEquatorial,
  equatorialToHorizontal
} from './coordinates';
import { getSunCoordinates } from './solar';
import { getConstellation } from './constellations';
import { ObserverLocation, LunarTelemetry } from './types';
import { ASTRONOMICAL_UNIT_KM } from './constants';

/**
 * Truncated lunar ephemeris (Jean Meeus, Astronomical Algorithms Chapter 47).
 * Computes Moon's geocentric ecliptic longitude, latitude, and distance in km.
 */
export function getMoonGeocentricCoordinates(date: Date): {
  eclipticLonDeg: number;
  eclipticLatDeg: number;
  distanceKm: number;
  raHours: number;
  decDeg: number;
} {
  const jd = toJulianDate(date);
  const T = toJulianCenturies(jd);

  // Fundamental arguments of lunar motion (degrees)
  // Moon's mean longitude
  const LPrime = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  // Mean elongation of the Moon
  const D = normalizeDegrees(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  // Sun's mean anomaly
  const M = normalizeDegrees(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  // Moon's mean anomaly
  const MPrime = normalizeDegrees(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  // Moon's argument of latitude
  const F = normalizeDegrees(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

  // Periodic perturbations in longitude (in degrees)
  let lSum = 0;
  lSum += 6.288774 * Math.sin(MPrime * DEG_TO_RAD);
  lSum += 1.274027 * Math.sin((2 * D - MPrime) * DEG_TO_RAD); // Evection
  lSum += 0.658314 * Math.sin((2 * D) * DEG_TO_RAD);          // Variation
  lSum += 0.213618 * Math.sin((2 * MPrime) * DEG_TO_RAD);
  lSum -= 0.185116 * Math.sin(M * DEG_TO_RAD);               // Annual equation
  lSum -= 0.114332 * Math.sin((2 * F) * DEG_TO_RAD);
  lSum += 0.058793 * Math.sin((2 * D - 2 * MPrime) * DEG_TO_RAD);
  lSum += 0.057066 * Math.sin((2 * D - M - MPrime) * DEG_TO_RAD);
  lSum += 0.053322 * Math.sin((2 * D + MPrime) * DEG_TO_RAD);
  lSum += 0.045758 * Math.sin((2 * D - M) * DEG_TO_RAD);

  const eclipticLonDeg = normalizeDegrees(LPrime + lSum);

  // Periodic perturbations in latitude (in degrees)
  let bSum = 0;
  bSum += 5.128122 * Math.sin(F * DEG_TO_RAD);
  bSum += 0.280602 * Math.sin((MPrime + F) * DEG_TO_RAD);
  bSum += 0.277693 * Math.sin((MPrime - F) * DEG_TO_RAD);
  bSum += 0.173238 * Math.sin((2 * D - F) * DEG_TO_RAD);
  bSum += 0.055413 * Math.sin((2 * D - MPrime + F) * DEG_TO_RAD);
  bSum += 0.046271 * Math.sin((2 * D - MPrime - F) * DEG_TO_RAD);

  const eclipticLatDeg = bSum;

  // Periodic perturbations in distance (in km)
  let rSum = 0;
  rSum -= 20954.0 * Math.cos(MPrime * DEG_TO_RAD);
  rSum -= 3699.0 * Math.cos((2 * D - MPrime) * DEG_TO_RAD);
  rSum -= 2956.0 * Math.cos((2 * D) * DEG_TO_RAD);
  rSum -= 570.0 * Math.cos((2 * MPrime) * DEG_TO_RAD);
  rSum += 246.0 * Math.cos((2 * D - 2 * MPrime) * DEG_TO_RAD);
  rSum -= 205.0 * Math.cos((M - MPrime) * DEG_TO_RAD);
  rSum -= 171.0 * Math.cos((2 * D + MPrime) * DEG_TO_RAD);

  const distanceKm = 385000.56 + rSum;

  const eps = meanObliquity(T);
  const eq = eclipticToEquatorial(eclipticLonDeg, eclipticLatDeg, eps);

  return {
    eclipticLonDeg,
    eclipticLatDeg,
    distanceKm: Math.round(distanceKm),
    raHours: eq.raHours,
    decDeg: eq.decDeg
  };
}

/**
 * Calculates phase angle, illumination percentage, age, and phase name.
 */
export function getMoonPhaseDetails(date: Date): {
  illuminationPct: number;
  phaseAngleDeg: number;
  ageDays: number;
  phaseName: string;
  phaseEmoji: string;
} {
  const moon = getMoonGeocentricCoordinates(date);
  const sun = getSunCoordinates(date);

  // Phase angle psi is difference in ecliptic longitude
  let diffLon = normalizeDegrees(moon.eclipticLonDeg - sun.eclipticLonDeg);

  // Illumination fraction k = (1 - cos(psi)) / 2  or  (1 + cos(180 - psi)) / 2
  const psiRad = diffLon * DEG_TO_RAD;
  const illumination = (1.0 - Math.cos(psiRad)) / 2.0;
  const illuminationPct = Math.round(illumination * 100);

  // Synodic month is 29.530588853 days
  const synodicMonth = 29.530588853;
  const ageDays = parseFloat(((diffLon / 360.0) * synodicMonth).toFixed(1));

  let phaseName = 'New Moon';
  let phaseEmoji = '🌑';

  if (diffLon < 22.5 || diffLon >= 337.5) {
    phaseName = 'New Moon';
    phaseEmoji = '🌑';
  } else if (diffLon >= 22.5 && diffLon < 67.5) {
    phaseName = 'Waxing Crescent';
    phaseEmoji = '🌒';
  } else if (diffLon >= 67.5 && diffLon < 112.5) {
    phaseName = 'First Quarter';
    phaseEmoji = '🌓';
  } else if (diffLon >= 112.5 && diffLon < 157.5) {
    phaseName = 'Waxing Gibbous';
    phaseEmoji = '🌔';
  } else if (diffLon >= 157.5 && diffLon < 202.5) {
    phaseName = 'Full Moon';
    phaseEmoji = '🌕';
  } else if (diffLon >= 202.5 && diffLon < 247.5) {
    phaseName = 'Waning Gibbous';
    phaseEmoji = '🌖';
  } else if (diffLon >= 247.5 && diffLon < 292.5) {
    phaseName = 'Third Quarter';
    phaseEmoji = '🌗';
  } else {
    phaseName = 'Waning Crescent';
    phaseEmoji = '🌘';
  }

  return {
    illuminationPct,
    phaseAngleDeg: parseFloat(diffLon.toFixed(1)),
    ageDays,
    phaseName,
    phaseEmoji
  };
}

/**
 * Calculates approximate Moonrise and Moonset for given location and date.
 */
export function calculateMoonTimes(
  location: ObserverLocation,
  date: Date
): { riseTime: string; setTime: string } {
  // Approximate search across 24h of current date in 30m steps
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  let prevAlt = 0;
  let riseDate: Date | null = null;
  let setDate: Date | null = null;

  for (let m = 0; m <= 24 * 60; m += 30) {
    const t = new Date(startOfDay.getTime() + m * 60000);
    const mCoords = getMoonGeocentricCoordinates(t);
    const horiz = equatorialToHorizontal(mCoords.raHours * 15.0, mCoords.decDeg, location, t);
    const currentAlt = horiz.altitude - 0.125; // Moon semi-diameter & parallax offset

    if (m > 0) {
      // Crossed from negative to positive -> Moonrise
      if (prevAlt < 0 && currentAlt >= 0 && !riseDate) {
        riseDate = t;
      }
      // Crossed from positive to negative -> Moonset
      if (prevAlt >= 0 && currentAlt < 0 && !setDate) {
        setDate = t;
      }
    }
    prevAlt = currentAlt;
  }

  const format = (d: Date | null) => d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';

  return {
    riseTime: format(riseDate),
    setTime: format(setDate)
  };
}

/**
 * Assembles complete Lunar Telemetry.
 */
export function getLunarTelemetry(location: ObserverLocation, date: Date): LunarTelemetry {
  const moonCoords = getMoonGeocentricCoordinates(date);
  const horiz = equatorialToHorizontal(moonCoords.raHours * 15.0, moonCoords.decDeg, location, date);
  const phase = getMoonPhaseDetails(date);
  const times = calculateMoonTimes(location, date);
  const constellation = getConstellation(moonCoords.raHours, moonCoords.decDeg);

  return {
    altitude: horiz.altitude,
    azimuth: horiz.azimuth,
    riseTime: times.riseTime,
    setTime: times.setTime,
    distanceKm: moonCoords.distanceKm,
    distanceAU: parseFloat((moonCoords.distanceKm / ASTRONOMICAL_UNIT_KM).toFixed(6)),
    illumination: phase.illuminationPct,
    phaseAngle: phase.phaseAngleDeg,
    phaseName: phase.phaseName,
    phaseEmoji: phase.phaseEmoji,
    ageDays: phase.ageDays,
    constellation
  };
}
