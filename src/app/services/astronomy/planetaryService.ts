import { PLANET_CATALOG } from './constants';
import {
  getHeliocentricCoordinates,
  getGeocentricEquatorial,
  getPhaseAngleAndIllumination
} from './ephemeris';
import { calculatePlanetRiseSet } from './riseSet';
import { calculateApparentMagnitude, calculateAngularDiameterArcsec, formatMagnitude } from './magnitude';
import { getConstellation } from './constellations';
import { calculateNextOpposition } from './events';
import { ObserverLocation, PlanetaryTelemetry } from './types';

const PLANET_NAMES = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

/**
 * Calculates complete real-time astronomical telemetry for all major solar system planets.
 */
export function getPlanetaryTelemetryList(location: ObserverLocation, date: Date): PlanetaryTelemetry[] {
  return PLANET_NAMES.map(name => {
    const catalog = PLANET_CATALOG[name];
    const helio = getHeliocentricCoordinates(name, date);

    if (name === 'Earth') {
      const riseSet = calculatePlanetRiseSet('Earth', location, date);
      return {
        name: 'Earth',
        color: catalog.color,
        image: catalog.image,
        facts: catalog.facts,
        size: catalog.size,
        orbitRadius: catalog.orbitRadius,
        distanceFromEarth: '0 AU',
        distanceFromEarthNumAU: 0,
        distanceFromSun: `${helio.radiusAU} AU`,
        distanceFromSunNumAU: helio.radiusAU,
        magnitude: 'N/A',
        magnitudeNum: -99,
        constellation: 'Home',
        visibility: 'Always Visible (Underfoot)',
        isVisibleNow: true,
        altitude: 90,
        azimuth: 0,
        nextOpposition: 'N/A',
        riseTime: 'N/A',
        setTime: 'N/A',
        transitTime: 'N/A',
        angularSize: 'N/A',
        angularSizeArcsec: 0,
        phase: '100%',
        phaseFraction: 1.0,
        heliocentricLongitude: helio.longitude,
        orbitalPeriodDays: catalog.orbitalPeriodDays,
        realDiameterKm: catalog.realDiameterKm,
        moonsCount: catalog.moonsCount,
        type: catalog.type
      };
    }

    const geo = getGeocentricEquatorial(name, date);
    const phaseInfo = getPhaseAngleAndIllumination(name, date);
    const riseSet = calculatePlanetRiseSet(name, location, date);
    const constellation = getConstellation(geo.rightAscension, geo.declination);
    const rawMag = calculateApparentMagnitude(name, helio.radiusAU, geo.distanceAU, phaseInfo.phaseAngleDeg);
    const angularSizeArcsec = calculateAngularDiameterArcsec(name, geo.distanceAU);
    const opp = calculateNextOpposition(name, date);

    return {
      name,
      color: catalog.color,
      image: catalog.image,
      facts: catalog.facts,
      hasFeature: catalog.hasFeature,
      size: catalog.size,
      orbitRadius: catalog.orbitRadius,
      distanceFromEarth: `${geo.distanceAU.toFixed(2)} AU`,
      distanceFromEarthNumAU: geo.distanceAU,
      distanceFromSun: `${helio.radiusAU.toFixed(2)} AU`,
      distanceFromSunNumAU: helio.radiusAU,
      magnitude: formatMagnitude(rawMag),
      magnitudeNum: rawMag,
      constellation,
      visibility: riseSet.visibility,
      isVisibleNow: riseSet.isVisibleNow,
      altitude: riseSet.altitudeNow,
      azimuth: riseSet.azimuthNow,
      nextOpposition: opp.dateStr,
      riseTime: riseSet.riseTime,
      setTime: riseSet.setTime,
      transitTime: riseSet.transitTime,
      angularSize: `${angularSizeArcsec.toFixed(1)}"`,
      angularSizeArcsec,
      phase: `${Math.round(phaseInfo.phaseFraction * 100)}%`,
      phaseFraction: phaseInfo.phaseFraction,
      heliocentricLongitude: helio.longitude,
      orbitalPeriodDays: catalog.orbitalPeriodDays,
      realDiameterKm: catalog.realDiameterKm,
      moonsCount: catalog.moonsCount,
      type: catalog.type
    };
  });
}
