import { normalizeDegrees } from './coordinates';
import { getHeliocentricCartesian, getGeocentricEquatorial } from './ephemeris';
import { getSunCoordinates } from './solar';
import { getMoonPhaseDetails } from './lunar';
import { AstronomicalEvent } from './types';

/**
 * Calculates the next opposition date for a superior planet (Mars, Jupiter, Saturn, Uranus, Neptune).
 * Opposition occurs when Sun-Earth-Planet are in a straight line (elongation from Sun = 180°).
 */
export function calculateNextOpposition(planetName: string, startDate: Date): { dateStr: string; dateObj: Date | null } {
  if (planetName === 'Mercury' || planetName === 'Venus' || planetName === 'Earth') {
    return { dateStr: 'N/A', dateObj: null };
  }

  // Search ahead up to 800 days in 2-day steps
  let prevDiff = 999;
  let minDiff = 999;
  let oppositionDate: Date | null = null;

  for (let d = 5; d <= 800; d += 2) {
    const testDate = new Date(startDate.getTime() + d * 86400000);
    const sun = getSunCoordinates(testDate);
    const planetEq = getGeocentricEquatorial(planetName, testDate);

    // Difference in Right Ascension from Sun + 12h (or 180° in longitude)
    const sunOppositeRa = (sun.raHours + 12.0) % 24.0;
    let diffHours = Math.abs(planetEq.rightAscension - sunOppositeRa);
    if (diffHours > 12) diffHours = 24 - diffHours;

    if (diffHours < minDiff) {
      minDiff = diffHours;
      oppositionDate = testDate;
    } else if (minDiff < 0.2 && diffHours > minDiff) {
      // Passed the minimum
      break;
    }
  }

  if (oppositionDate) {
    const str = oppositionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return { dateStr: str, dateObj: oppositionDate };
  }

  return { dateStr: 'N/A', dateObj: null };
}

/**
 * Calculates next greatest elongation for Mercury or Venus.
 */
export function calculateNextGreatestElongation(planetName: 'Mercury' | 'Venus', startDate: Date): { dateStr: string; elongationDeg: number; isEvening: boolean } {
  let maxElong = 0;
  let bestDate: Date = startDate;
  let isEvening = true;

  for (let d = 2; d <= 150; d += 1) {
    const testDate = new Date(startDate.getTime() + d * 86400000);
    const sun = getSunCoordinates(testDate);
    const planet = getGeocentricEquatorial(planetName, testDate);

    let diffHours = planet.rightAscension - sun.raHours;
    if (diffHours > 12) diffHours -= 24;
    if (diffHours < -12) diffHours += 24;

    const elong = Math.abs(diffHours) * 15.0;
    if (elong > maxElong) {
      maxElong = elong;
      bestDate = testDate;
      isEvening = diffHours > 0;
    } else if (maxElong > (planetName === 'Mercury' ? 18 : 40) && elong < maxElong - 0.5) {
      break;
    }
  }

  return {
    dateStr: bestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    elongationDeg: Math.round(maxElong),
    isEvening
  };
}

/**
 * Known high-reliability annual meteor showers.
 */
interface MeteorShowerRule {
  name: string;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  peakDay: number;
  ratePerHour: number;
  radiant: string;
  description: string;
}

const ANNUAL_METEOR_SHOWERS: MeteorShowerRule[] = [
  {
    name: 'Quadrantids Meteor Peak',
    month: 0,
    peakDay: 3,
    ratePerHour: 110,
    radiant: 'Boötes',
    description: 'Intense short peak producing up to 110 bright meteors per hour. One of the best winter showers.'
  },
  {
    name: 'Lyrids Meteor Peak',
    month: 3,
    peakDay: 22,
    ratePerHour: 18,
    radiant: 'Lyra',
    description: 'Fast meteors originating from Comet C/1861 G1 Thatcher with occasional fireballs.'
  },
  {
    name: 'Eta Aquariids Peak',
    month: 4,
    peakDay: 6,
    ratePerHour: 50,
    radiant: 'Aquarius',
    description: 'Debris from Halley\'s Comet producing swift meteors with persistent trains.'
  },
  {
    name: 'Perseids Meteor Shower Peak',
    month: 7,
    peakDay: 12,
    ratePerHour: 100,
    radiant: 'Perseus',
    description: 'The most popular summer meteor shower, known for fast, bright meteors and fireballs.'
  },
  {
    name: 'Orionids Meteor Peak',
    month: 9,
    peakDay: 21,
    ratePerHour: 20,
    radiant: 'Orion',
    description: 'Swift meteors from Comet Halley, known for prolonged persistent ionization trains.'
  },
  {
    name: 'Leonids Meteor Peak',
    month: 10,
    peakDay: 17,
    ratePerHour: 15,
    radiant: 'Leo',
    description: 'Fastest meteors (71 km/s) associated with Comet Tempel-Tuttle.'
  },
  {
    name: 'Geminids Meteor Shower Peak',
    month: 11,
    peakDay: 14,
    ratePerHour: 120,
    radiant: 'Gemini',
    description: 'The king of annual meteor showers, producing up to 120 multicolored meteors per hour from asteroid 3200 Phaethon.'
  }
];

/**
 * Solstices and equinoxes for any year.
 */
function getSolsticesAndEquinoxes(year: number): Array<{ name: string; date: Date; description: string }> {
  return [
    {
      name: 'March Equinox (Vernal)',
      date: new Date(Date.UTC(year, 2, 20, 9, 30)),
      description: 'Day and night are equal length globally. Official beginning of astronomical spring in North, autumn in South.'
    },
    {
      name: 'June Solstice (Summer)',
      date: new Date(Date.UTC(year, 5, 21, 3, 20)),
      description: 'Sun reaches its northernmost declination. Longest day of the year in Northern hemisphere.'
    },
    {
      name: 'September Equinox (Autumnal)',
      date: new Date(Date.UTC(year, 8, 22, 18, 5)),
      description: 'Sun crosses celestial equator southward. Beginning of astronomical autumn in North, spring in South.'
    },
    {
      name: 'December Solstice (Winter)',
      date: new Date(Date.UTC(year, 11, 21, 15, 30)),
      description: 'Sun at southernmost declination. Shortest day of the year in Northern hemisphere.'
    }
  ];
}

/**
 * Dynamically computes verified upcoming astronomical events from the current date.
 */
export function getUpcomingAstronomicalEvents(currentDate: Date): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  const currentYear = currentDate.getFullYear();

  // 1. Calculate Meteor Shower peaks for current year and next year
  for (const year of [currentYear, currentYear + 1]) {
    for (const shower of ANNUAL_METEOR_SHOWERS) {
      const peakDate = new Date(year, shower.month, shower.peakDay, 22, 0, 0);
      const diffDays = (peakDate.getTime() - currentDate.getTime()) / 86400000;

      if (diffDays >= -1 && diffDays <= 365) {
        const moon = getMoonPhaseDetails(peakDate);
        const moonDesc = moon.illuminationPct > 60 
          ? ` (Moon ${moon.illuminationPct}% illuminated may cause some interference)` 
          : ` (Excellent dark skies: Moon only ${moon.illuminationPct}%)`;

        events.push({
          id: `meteor-${shower.name.toLowerCase().replace(/\s+/g, '-')}-${year}`,
          name: shower.name,
          date: peakDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: '22:00 - 05:00 Local',
          timestamp: peakDate.getTime(),
          type: 'meteor',
          description: `${shower.description}${moonDesc}`,
          difficulty: shower.ratePerHour > 80 ? 'easy' : 'medium',
          points: shower.ratePerHour > 80 ? 100 : 75,
          completed: diffDays < 0,
          countdownDays: Math.ceil(diffDays),
          isToday: Math.abs(diffDays) < 0.8
        });
      }
    }
  }

  // 2. Next Planetary Oppositions
  for (const planet of ['Mars', 'Jupiter', 'Saturn', 'Uranus']) {
    const opp = calculateNextOpposition(planet, currentDate);
    if (opp.dateObj) {
      const diffDays = (opp.dateObj.getTime() - currentDate.getTime()) / 86400000;
      events.push({
        id: `opp-${planet.toLowerCase()}-${opp.dateObj.getFullYear()}`,
        name: `${planet} at Opposition`,
        date: opp.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: 'All Night Visible',
        timestamp: opp.dateObj.getTime(),
        type: 'planet',
        description: `${planet} is directly opposite the Sun, shining at its brightest and closest approach to Earth this orbit.`,
        difficulty: planet === 'Saturn' || planet === 'Jupiter' ? 'easy' : 'hard',
        points: 150,
        completed: false,
        countdownDays: Math.ceil(diffDays),
        isToday: Math.abs(diffDays) < 1
      });
    }
  }

  // 3. Venus Greatest Elongation
  const venusElong = calculateNextGreatestElongation('Venus', currentDate);
  events.push({
    id: `elong-venus-${venusElong.dateStr.replace(/\s+/g, '-')}`,
    name: `Venus Greatest ${venusElong.isEvening ? 'Eastern' : 'Western'} Elongation`,
    date: venusElong.dateStr,
    time: venusElong.isEvening ? 'Evening Sky (Sunset)' : 'Morning Sky (Dawn)',
    timestamp: currentDate.getTime() + 30 * 86400000,
    type: 'planet',
    description: `Venus reaches maximum angular separation (${venusElong.elongationDeg}°) from the Sun, offering peak telescope visibility.`,
    difficulty: 'medium',
    points: 100,
    completed: false,
    countdownDays: 30,
    isToday: false
  });

  // 4. Upcoming Equinoxes and Solstices
  for (const year of [currentYear, currentYear + 1]) {
    for (const s of getSolsticesAndEquinoxes(year)) {
      const diffDays = (s.date.getTime() - currentDate.getTime()) / 86400000;
      if (diffDays >= 0 && diffDays <= 365) {
        events.push({
          id: `season-${s.name.toLowerCase().replace(/\s+/g, '-')}-${year}`,
          name: s.name,
          date: s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: s.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC',
          timestamp: s.date.getTime(),
          type: 'mission',
          description: s.description,
          difficulty: 'easy',
          points: 50,
          completed: false,
          countdownDays: Math.ceil(diffDays),
          isToday: Math.abs(diffDays) < 1
        });
      }
    }
  }

  // Sort chronologically by timestamp
  events.sort((a, b) => a.timestamp - b.timestamp);

  return events;
}
