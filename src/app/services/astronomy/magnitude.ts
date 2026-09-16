import { ASTRONOMICAL_UNIT_KM, PLANET_CATALOG } from './constants';

/**
 * Computes apparent visual magnitude for planets based on
 * Mallama & Hilton (2018) / Meeus standard photometric algorithms.
 */
export function calculateApparentMagnitude(
  planetName: string,
  distanceFromSunAU: number,
  distanceFromEarthAU: number,
  phaseAngleDeg: number,
  saturnRingTiltDeg: number = 15.0
): number {
  if (distanceFromSunAU <= 0 || distanceFromEarthAU <= 0) return 0.0;

  const r = distanceFromSunAU;
  const delta = distanceFromEarthAU;
  const alpha = phaseAngleDeg;
  const distTerm = 5.0 * Math.log10(r * delta);

  let mag = 0;

  switch (planetName) {
    case 'Mercury': {
      // V = -0.42 + 5*log10(r*delta) + 0.0380*alpha - 0.000273*alpha^2 + 0.000002*alpha^3
      mag = -0.42 + distTerm + 0.038 * alpha - 0.000273 * alpha * alpha + 0.000002 * Math.pow(alpha, 3);
      break;
    }
    case 'Venus': {
      // V = -4.40 + 5*log10(r*delta) + 0.0009*alpha + 0.000239*alpha^2 - 0.00000065*alpha^3
      mag = -4.40 + distTerm + 0.0009 * alpha + 0.000239 * alpha * alpha - 0.00000065 * Math.pow(alpha, 3);
      break;
    }
    case 'Mars': {
      // V = -1.52 + 5*log10(r*delta) + 0.016*alpha
      mag = -1.52 + distTerm + 0.016 * alpha;
      break;
    }
    case 'Jupiter': {
      // V = -9.40 + 5*log10(r*delta) + 0.005*alpha
      mag = -9.40 + distTerm + 0.005 * alpha;
      break;
    }
    case 'Saturn': {
      // Includes ring system contribution: V = -8.88 + 5*log10(r*delta) + 0.044*alpha - 2.60*sin(|B|) + 1.25*sin^2(|B|)
      const bRad = Math.abs(saturnRingTiltDeg) * (Math.PI / 180);
      const ringTerm = -2.6 * Math.sin(bRad) + 1.25 * Math.pow(Math.sin(bRad), 2);
      mag = -8.88 + distTerm + 0.044 * alpha + ringTerm;
      break;
    }
    case 'Uranus': {
      // V = -7.19 + 5*log10(r*delta) + 0.0028*alpha
      mag = -7.19 + distTerm + 0.0028 * alpha;
      break;
    }
    case 'Neptune': {
      // V = -6.87 + 5*log10(r*delta) + 0.001*alpha
      mag = -6.87 + distTerm + 0.001 * alpha;
      break;
    }
    default:
      mag = 0.0;
  }

  return parseFloat(mag.toFixed(1));
}

/**
 * Formats magnitude with explicit +/- sign.
 */
export function formatMagnitude(mag: number): string {
  const sign = mag > 0 ? '+' : '';
  return `${sign}${mag.toFixed(1)}`;
}

/**
 * Calculates apparent angular diameter in arcseconds.
 * theta = 2 * arctan(Radius / Delta)
 */
export function calculateAngularDiameterArcsec(planetName: string, distanceFromEarthAU: number): number {
  const catalog = PLANET_CATALOG[planetName];
  if (!catalog || distanceFromEarthAU <= 0) return 0;

  const planetRadiusKm = catalog.realDiameterKm / 2.0;
  const distanceKm = distanceFromEarthAU * ASTRONOMICAL_UNIT_KM;

  // Angular diameter in radians
  const angleRad = 2.0 * Math.atan(planetRadiusKm / distanceKm);
  // Convert radians to arcseconds
  const arcsec = angleRad * (180.0 / Math.PI) * 3600.0;

  return parseFloat(arcsec.toFixed(1));
}
