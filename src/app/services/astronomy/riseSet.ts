import {
  DEG_TO_RAD,
  normalizeDegrees,
  toJulianDate,
  equatorialToHorizontal
} from './coordinates';
import { getGeocentricEquatorial } from './ephemeris';
import { getSunCoordinates } from './solar';
import { ObserverLocation } from './types';

export interface RiseSetResult {
  riseTime: string;    // HH:MM or "N/A"
  setTime: string;     // HH:MM or "N/A"
  transitTime: string; // HH:MM or "N/A"
  visibility: string;  // descriptive visibility status
  isVisibleNow: boolean;
  altitudeNow: number;
  azimuthNow: number;
}

/**
 * Calculates topocentric rise, set, and meridian transit times for any planet.
 * Evaluates altitude across the current 24-hour window in 20-minute steps.
 */
export function calculatePlanetRiseSet(
  planetName: string,
  location: ObserverLocation,
  date: Date
): RiseSetResult {
  if (planetName === 'Earth') {
    return {
      riseTime: 'N/A',
      setTime: 'N/A',
      transitTime: 'N/A',
      visibility: 'Home Planet (Underfoot)',
      isVisibleNow: true,
      altitudeNow: 90,
      azimuthNow: 0
    };
  }

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  let prevAlt = 0;
  let maxAlt = -999;
  let riseDate: Date | null = null;
  let setDate: Date | null = null;
  let transitDate: Date | null = null;

  // Horizon threshold = -0.5667° (refraction + standard horizon)
  const HORIZON_DEG = -0.5667;

  // Step through day
  for (let m = 0; m <= 24 * 60; m += 20) {
    const t = new Date(startOfDay.getTime() + m * 60000);
    const eq = getGeocentricEquatorial(planetName, t);
    const horiz = equatorialToHorizontal(eq.rightAscension * 15.0, eq.declination, location, t);

    if (horiz.altitude > maxAlt) {
      maxAlt = horiz.altitude;
      transitDate = t;
    }

    if (m > 0) {
      // Crossed above horizon
      if (prevAlt < HORIZON_DEG && horiz.altitude >= HORIZON_DEG && !riseDate) {
        riseDate = t;
      }
      // Crossed below horizon
      if (prevAlt >= HORIZON_DEG && horiz.altitude < HORIZON_DEG && !setDate) {
        setDate = t;
      }
    }
    prevAlt = horiz.altitude;
  }

  // Current moment evaluation
  const currentEq = getGeocentricEquatorial(planetName, date);
  const currentHoriz = equatorialToHorizontal(currentEq.rightAscension * 15.0, currentEq.declination, location, date);
  const sunCoords = getSunCoordinates(date);
  const sunHoriz = equatorialToHorizontal(sunCoords.raHours * 15.0, sunCoords.decDeg, location, date);

  // Solar elongation (angular separation from Sun in degrees)
  const raDiff = Math.abs(currentEq.rightAscension - sunCoords.raHours) * 15.0 * DEG_TO_RAD;
  const decP = currentEq.declination * DEG_TO_RAD;
  const decS = sunCoords.decDeg * DEG_TO_RAD;
  const cosElong = Math.sin(decP) * Math.sin(decS) + Math.cos(decP) * Math.cos(decS) * Math.cos(raDiff);
  const elongationDeg = Math.acos(Math.max(-1, Math.min(1, cosElong))) * (180.0 / Math.PI);

  const isVisibleNow = currentHoriz.altitude > 0 && sunHoriz.altitude < -6.0; // Above horizon & dark sky

  // Determine descriptive visibility status
  let visibility = 'Visible';
  if (elongationDeg < 12.0) {
    visibility = 'Too close to Sun';
  } else if (sunHoriz.altitude > 0) {
    // Currently daytime
    if (planetName === 'Venus' && currentHoriz.altitude > 20) {
      visibility = 'Daytime Visible (Telescope)';
    } else {
      visibility = 'Daytime Sky (Not Visible)';
    }
  } else {
    // Night or twilight
    if (currentHoriz.altitude > 0) {
      if (planetName === 'Venus' || planetName === 'Mercury') {
        const isEvening = (currentEq.rightAscension > sunCoords.raHours);
        visibility = isEvening ? 'Evening Star' : 'Morning Star';
      } else if (planetName === 'Jupiter') {
        visibility = 'Great Red Spot Visible';
      } else if (planetName === 'Saturn') {
        visibility = 'Rings Visible';
      } else if (planetName === 'Uranus') {
        visibility = 'Binoculars Needed';
      } else if (planetName === 'Neptune') {
        visibility = 'Telescope Required';
      } else {
        visibility = `Visible (${Math.round(currentHoriz.altitude)}° Alt)`;
      }
    } else {
      if (riseDate && riseDate.getTime() > date.getTime()) {
        visibility = `Rises at ${formatTime(riseDate)}`;
      } else {
        visibility = 'Below Horizon';
      }
    }
  }

  return {
    riseTime: formatTime(riseDate),
    setTime: formatTime(setDate),
    transitTime: formatTime(transitDate),
    visibility,
    isVisibleNow,
    altitudeNow: currentHoriz.altitude,
    azimuthNow: currentHoriz.azimuth
  };
}

function formatTime(d: Date | null): string {
  if (!d) return 'N/A';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
