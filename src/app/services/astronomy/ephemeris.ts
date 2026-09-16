import {
  DEG_TO_RAD,
  RAD_TO_DEG,
  normalizeDegrees,
  toJulianDate,
  toJulianCenturies,
  meanObliquity,
  eclipticToEquatorial
} from './coordinates';
import { HeliocentricCoordinates, EquatorialCoordinates } from './types';

// NASA JPL Keplerian orbital elements and secular rates per century (Standish, 1992 / JPL Ephemeris)
interface KeplerianElements {
  a0: number; aDot: number; // AU, AU/century
  e0: number; eDot: number; // eccentricity, 1/century
  I0: number; IDot: number; // degrees, deg/century
  L0: number; LDot: number; // mean longitude in degrees
  w0: number; wDot: number; // longitude of perihelion in degrees
  node0: number; nodeDot: number; // longitude of ascending node in degrees
  // Optional perturbation factors (for outer planets)
  b?: number; c?: number; s?: number; f?: number;
}

const PLANETARY_ELEMENTS: Record<string, KeplerianElements> = {
  Mercury: {
    a0: 0.38709927, aDot: 0.00000037,
    e0: 0.20563593, eDot: 0.00001906,
    I0: 7.00497902, IDot: -0.00594749,
    L0: 252.25032350, LDot: 149472.67411175,
    w0: 77.45779628, wDot: 0.16047689,
    node0: 48.33076593, nodeDot: -0.12534081
  },
  Venus: {
    a0: 0.72333566, aDot: 0.00000390,
    e0: 0.00677672, eDot: -0.00004107,
    I0: 3.39467605, IDot: -0.00078890,
    L0: 181.97909950, LDot: 58517.81538729,
    w0: 131.60246718, wDot: 0.00268329,
    node0: 76.67984255, nodeDot: -0.27769418
  },
  Earth: {
    a0: 1.00000261, aDot: 0.00000562,
    e0: 0.01671123, eDot: -0.00004392,
    I0: 0.00001531, IDot: -0.01294668,
    L0: 100.46457166, LDot: 35999.37244981,
    w0: 102.93768193, wDot: 0.32327364,
    node0: 0.0, nodeDot: 0.0
  },
  Mars: {
    a0: 1.52371034, aDot: 0.00001847,
    e0: 0.09339410, eDot: 0.00007882,
    I0: 1.84969142, IDot: -0.00813131,
    L0: -4.55343205, LDot: 19140.30268499,
    w0: -23.94362959, wDot: 0.44441088,
    node0: 49.55953891, nodeDot: -0.29257343
  },
  Jupiter: {
    a0: 5.20288700, aDot: -0.00011607,
    e0: 0.04838624, eDot: -0.00013253,
    I0: 1.30439695, IDot: -0.00183714,
    L0: 34.39644051, LDot: 3034.74612775,
    w0: 14.72847983, wDot: 0.21252668,
    node0: 100.47390909, nodeDot: 0.20469106
  },
  Saturn: {
    a0: 9.53667594, aDot: -0.00125060,
    e0: 0.05386179, eDot: -0.00050991,
    I0: 2.48599187, IDot: 0.00193609,
    L0: 49.95424423, LDot: 1222.49362201,
    w0: 92.59887831, wDot: -0.41897216,
    node0: 113.66242448, nodeDot: -0.28867794
  },
  Uranus: {
    a0: 19.18916464, aDot: -0.00196176,
    e0: 0.04725744, eDot: -0.00004397,
    I0: 0.77263783, IDot: -0.00242939,
    L0: 313.23810451, LDot: 428.48202785,
    w0: 170.95427630, wDot: 0.40805281,
    node0: 74.01692503, nodeDot: 0.04240589
  },
  Neptune: {
    a0: 30.06992276, aDot: 0.00026291,
    e0: 0.00859048, eDot: 0.00005105,
    I0: 1.77004347, IDot: 0.00035372,
    L0: -55.12002969, LDot: 218.45945325,
    w0: 44.96476224, wDot: -0.32241464,
    node0: 131.78422574, nodeDot: -0.00508664
  }
};

/**
 * Solve Kepler's equation M = E - e*sin(E) for Eccentric Anomaly E (in radians).
 */
function solveKepler(M_rad: number, e: number): number {
  let E = M_rad + e * Math.sin(M_rad) * (1.0 + e * Math.cos(M_rad));
  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M_rad) / (1.0 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

/**
 * Computes Heliocentric cartesian coordinates (X, Y, Z in AU) in the J2000 ecliptic frame.
 */
export function getHeliocentricCartesian(planetName: string, date: Date): { x: number; y: number; z: number; r: number } {
  const elem = PLANETARY_ELEMENTS[planetName];
  if (!elem) {
    throw new Error(`Planet ${planetName} not found in ephemeris`);
  }

  const jd = toJulianDate(date);
  const T = toJulianCenturies(jd);

  // Compute orbital elements for epoch T
  const a = elem.a0 + elem.aDot * T;
  const e = elem.e0 + elem.eDot * T;
  const I = normalizeDegrees(elem.I0 + elem.IDot * T) * DEG_TO_RAD;
  const L = normalizeDegrees(elem.L0 + elem.LDot * T);
  const w = normalizeDegrees(elem.w0 + elem.wDot * T);
  const node = normalizeDegrees(elem.node0 + elem.nodeDot * T) * DEG_TO_RAD;

  const perihelionArg = normalizeDegrees(w - (node * RAD_TO_DEG)) * DEG_TO_RAD;
  const M = normalizeDegrees(L - w) * DEG_TO_RAD;

  // Solve for Eccentric Anomaly
  const E = solveKepler(M, e);

  // Coordinates in orbital plane
  const xPrime = a * (Math.cos(E) - e);
  const yPrime = a * Math.sqrt(Math.max(0, 1.0 - e * e)) * Math.sin(E);
  const r = Math.sqrt(xPrime * xPrime + yPrime * yPrime);

  // Transform orbital plane to J2000 Ecliptic
  const cosNode = Math.cos(node);
  const sinNode = Math.sin(node);
  const cosPeri = Math.cos(perihelionArg);
  const sinPeri = Math.sin(perihelionArg);
  const cosI = Math.cos(I);

  const Px = cosNode * cosPeri - sinNode * sinPeri * cosI;
  const Py = sinNode * cosPeri + cosNode * sinPeri * cosI;
  const Pz = sinPeri * Math.sin(I);

  const Qx = -cosNode * sinPeri - sinNode * cosPeri * cosI;
  const Qy = -sinNode * sinPeri + cosNode * cosPeri * cosI;
  const Qz = cosPeri * Math.sin(I);

  const x = xPrime * Px + yPrime * Qx;
  const y = xPrime * Py + yPrime * Qy;
  const z = xPrime * Pz + yPrime * Qz;

  return { x, y, z, r };
}

/**
 * Computes Heliocentric coordinates (longitude, latitude in degrees, radius in AU).
 */
export function getHeliocentricCoordinates(planetName: string, date: Date): HeliocentricCoordinates {
  const { x, y, z, r } = getHeliocentricCartesian(planetName, date);
  const lonRad = Math.atan2(y, x);
  const latRad = Math.asin(Math.max(-1, Math.min(1, z / r)));

  return {
    longitude: normalizeDegrees(lonRad * RAD_TO_DEG),
    latitude: latRad * RAD_TO_DEG,
    radiusAU: parseFloat(r.toFixed(4))
  };
}

/**
 * Computes Geocentric Equatorial coordinates (RA, Dec, and distance in AU)
 * for any planet at a given date.
 */
export function getGeocentricEquatorial(planetName: string, date: Date): EquatorialCoordinates {
  if (planetName === 'Earth') {
    return { rightAscension: 0, declination: 0, distanceAU: 0 };
  }

  const planetHelio = getHeliocentricCartesian(planetName, date);
  const earthHelio = getHeliocentricCartesian('Earth', date);

  // Geocentric vector: X_g = X_p - X_e
  const xG = planetHelio.x - earthHelio.x;
  const yG = planetHelio.y - earthHelio.y;
  const zG = planetHelio.z - earthHelio.z;

  const distanceAU = Math.sqrt(xG * xG + yG * yG + zG * zG);

  // Geocentric ecliptic longitude and latitude
  const eclipticLonDeg = normalizeDegrees(Math.atan2(yG, xG) * RAD_TO_DEG);
  const eclipticLatDeg = Math.asin(Math.max(-1, Math.min(1, zG / distanceAU))) * RAD_TO_DEG;

  const jd = toJulianDate(date);
  const T = toJulianCenturies(jd);
  const eps = meanObliquity(T);

  const eq = eclipticToEquatorial(eclipticLonDeg, eclipticLatDeg, eps);

  return {
    rightAscension: eq.raHours,
    declination: eq.decDeg,
    distanceAU: parseFloat(distanceAU.toFixed(4))
  };
}

/**
 * Computes the phase angle alpha (Sun-Planet-Earth angle in degrees) and illumination fraction.
 */
export function getPhaseAngleAndIllumination(planetName: string, date: Date): { phaseAngleDeg: number; phaseFraction: number } {
  if (planetName === 'Earth') {
    return { phaseAngleDeg: 0, phaseFraction: 1 };
  }

  const pHelio = getHeliocentricCartesian(planetName, date);
  const eHelio = getHeliocentricCartesian('Earth', date);

  const r = pHelio.r; // distance planet to Sun
  const R = eHelio.r; // distance Earth to Sun

  const dx = pHelio.x - eHelio.x;
  const dy = pHelio.y - eHelio.y;
  const dz = pHelio.z - eHelio.z;
  const delta = Math.sqrt(dx * dx + dy * dy + dz * dz); // distance planet to Earth

  // Law of cosines for phase angle alpha at the planet:
  // R^2 = r^2 + delta^2 - 2 * r * delta * cos(alpha)
  const cosAlpha = (r * r + delta * delta - R * R) / (2 * r * delta);
  const clampedCos = Math.max(-1, Math.min(1, cosAlpha));
  const phaseAngleDeg = Math.acos(clampedCos) * RAD_TO_DEG;

  // Illuminated fraction k = (1 + cos(alpha)) / 2
  const phaseFraction = (1 + clampedCos) / 2.0;

  return { phaseAngleDeg, phaseFraction };
}
