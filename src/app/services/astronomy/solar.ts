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
import { getHeliocentricCartesian } from './ephemeris';
import { getConstellation } from './constellations';
import { ObserverLocation, SolarTelemetry } from './types';

/**
 * Computes Geocentric coordinates of the Sun at a given date.
 */
export function getSunCoordinates(date: Date): { raHours: number; decDeg: number; distanceAU: number; eclipticLonDeg: number } {
  // Sun is opposite Earth's heliocentric position
  const earthHelio = getHeliocentricCartesian('Earth', date);

  const xSun = -earthHelio.x;
  const ySun = -earthHelio.y;
  const zSun = -earthHelio.z;

  const distanceAU = Math.sqrt(xSun * xSun + ySun * ySun + zSun * zSun);
  const eclipticLonDeg = normalizeDegrees(Math.atan2(ySun, xSun) * RAD_TO_DEG);
  const eclipticLatDeg = Math.asin(Math.max(-1, Math.min(1, zSun / distanceAU))) * RAD_TO_DEG;

  const jd = toJulianDate(date);
  const T = toJulianCenturies(jd);
  const eps = meanObliquity(T);

  const eq = eclipticToEquatorial(eclipticLonDeg, eclipticLatDeg, eps);

  return {
    raHours: eq.raHours,
    decDeg: eq.decDeg,
    distanceAU: parseFloat(distanceAU.toFixed(4)),
    eclipticLonDeg
  };
}

/**
 * Formats a Date into a local time string HH:MM.
 */
function formatTime(d: Date | null): string {
  if (!d || isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Calculates solar times (sunrise, sunset, noon, civil twilight) for an observer location.
 * Standard solar altitude at horizon = -0.833° (accounting for 34' refraction + 16' solar radius).
 * Civil twilight altitude = -6.0°.
 */
export function calculateSolarTimes(
  location: ObserverLocation,
  date: Date
): {
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date | null;
  civilDawn: Date | null;
  civilDusk: Date | null;
} {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const sunNoon = getSunCoordinates(startOfDay);

  const latRad = location.latitude * DEG_TO_RAD;
  const decRad = sunNoon.decDeg * DEG_TO_RAD;

  // Local solar noon occurs when Sun is on observer's meridian
  // Hour angle H = 0 -> LST = RA -> GMST + lon = RA
  const jdNoon = toJulianDate(startOfDay);
  const gmstNoon = (sunNoon.raHours * 15.0 - location.longitude + 360) % 360;
  
  // Approximate noon time shift in minutes
  const noonDate = new Date(startOfDay.getTime());

  // Function to calculate hour angle for a given solar altitude angle (degrees)
  const calcHourAngle = (targetAltDeg: number): number | null => {
    const altRad = targetAltDeg * DEG_TO_RAD;
    const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1.0) return null; // Polar night (Sun never reaches altitude)
    if (cosH < -1.0) return 180.0; // Midnight sun (Sun always above altitude)
    return Math.acos(cosH) * RAD_TO_DEG;
  };

  const hSunrise = calcHourAngle(-0.833);
  const hCivil = calcHourAngle(-6.0);

  // Convert hour angle to minutes (1° = 4 minutes)
  let sunrise: Date | null = null;
  let sunset: Date | null = null;
  let civilDawn: Date | null = null;
  let civilDusk: Date | null = null;

  if (hSunrise !== null) {
    const minutesHalfDay = (hSunrise / 15.0) * 60.0;
    sunrise = new Date(noonDate.getTime() - minutesHalfDay * 60000);
    sunset = new Date(noonDate.getTime() + minutesHalfDay * 60000);
  }

  if (hCivil !== null) {
    const minutesCivil = (hCivil / 15.0) * 60.0;
    civilDawn = new Date(noonDate.getTime() - minutesCivil * 60000);
    civilDusk = new Date(noonDate.getTime() + minutesCivil * 60000);
  }

  return { sunrise, sunset, solarNoon: noonDate, civilDawn, civilDusk };
}

/**
 * Assembles complete Solar Telemetry.
 */
export function getSolarTelemetry(location: ObserverLocation, date: Date): SolarTelemetry {
  const sunCoords = getSunCoordinates(date);
  const horizontal = equatorialToHorizontal(sunCoords.raHours * 15.0, sunCoords.decDeg, location, date);
  const times = calculateSolarTimes(location, date);
  const constellation = getConstellation(sunCoords.raHours, sunCoords.decDeg);

  let daylightDuration = 'N/A';
  if (times.sunrise && times.sunset) {
    const diffMs = times.sunset.getTime() - times.sunrise.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    daylightDuration = `${hours}h ${minutes}m`;
  }

  return {
    altitude: horizontal.altitude,
    azimuth: horizontal.azimuth,
    riseTime: formatTime(times.sunrise),
    setTime: formatTime(times.sunset),
    solarNoonTime: formatTime(times.solarNoon),
    daylightDuration,
    civilDawn: formatTime(times.civilDawn),
    civilDusk: formatTime(times.civilDusk),
    constellation,
    distanceAU: sunCoords.distanceAU,
    isDaytime: horizontal.altitude > -0.833
  };
}
