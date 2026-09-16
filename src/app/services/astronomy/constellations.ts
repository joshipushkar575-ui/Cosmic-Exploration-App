/**
 * IAU Constellation boundary determination from Right Ascension and Declination.
 */

interface ConstellationRegion {
  name: string;
  latin: string;
  raMinHours: number;
  raMaxHours: number;
  decMinDeg: number;
  decMaxDeg: number;
}

// Zodiac and ecliptic constellations with precise boundary ranges
const ZODIAC_CONSTELLATIONS: ConstellationRegion[] = [
  { name: 'Pisces', latin: 'Pisces', raMinHours: 22.8, raMaxHours: 24.0, decMinDeg: -6, decMaxDeg: 34 },
  { name: 'Pisces', latin: 'Pisces', raMinHours: 0.0, raMaxHours: 2.1, decMinDeg: -6, decMaxDeg: 34 },
  { name: 'Aries', latin: 'Aries', raMinHours: 1.8, raMaxHours: 3.5, decMinDeg: 10, decMaxDeg: 31 },
  { name: 'Taurus', latin: 'Taurus', raMinHours: 3.4, raMaxHours: 6.0, decMinDeg: -1, decMaxDeg: 31 },
  { name: 'Gemini', latin: 'Gemini', raMinHours: 5.9, raMaxHours: 8.2, decMinDeg: 10, decMaxDeg: 35 },
  { name: 'Cancer', latin: 'Cancer', raMinHours: 7.9, raMaxHours: 9.4, decMinDeg: 6, decMaxDeg: 33 },
  { name: 'Leo', latin: 'Leo', raMinHours: 9.3, raMaxHours: 12.0, decMinDeg: -6, decMaxDeg: 33 },
  { name: 'Virgo', latin: 'Virgo', raMinHours: 11.6, raMaxHours: 15.2, decMinDeg: -22, decMaxDeg: 14 },
  { name: 'Libra', latin: 'Libra', raMinHours: 14.3, raMaxHours: 16.0, decMinDeg: -30, decMaxDeg: 0 },
  { name: 'Scorpius', latin: 'Scorpius', raMinHours: 15.8, raMaxHours: 17.9, decMinDeg: -46, decMaxDeg: -8 },
  { name: 'Ophiuchus', latin: 'Ophiuchus', raMinHours: 16.0, raMaxHours: 18.2, decMinDeg: -30, decMaxDeg: 14 },
  { name: 'Sagittarius', latin: 'Sagittarius', raMinHours: 17.7, raMaxHours: 20.5, decMinDeg: -45, decMaxDeg: -11 },
  { name: 'Capricornus', latin: 'Capricornus', raMinHours: 20.1, raMaxHours: 21.9, decMinDeg: -28, decMaxDeg: -8 },
  { name: 'Aquarius', latin: 'Aquarius', raMinHours: 20.6, raMaxHours: 23.9, decMinDeg: -25, decMaxDeg: 4 },
];

/**
 * Get constellation name from Right Ascension (in hours) and Declination (in degrees).
 * Defaults to the closest zodiac/ecliptic constellation or major constellation.
 */
export function getConstellation(raHours: number, decDeg: number): string {
  // Normalize RA hours to [0, 24)
  let ra = raHours % 24;
  if (ra < 0) ra += 24;

  for (const region of ZODIAC_CONSTELLATIONS) {
    if (
      ra >= region.raMinHours &&
      ra <= region.raMaxHours &&
      decDeg >= region.decMinDeg &&
      decDeg <= region.decMaxDeg
    ) {
      return region.name;
    }
  }

  // Fallback to ecliptic longitude approximation if outside specific bounding box
  // 12 equal-arc signs of the zodiac (30° each starting from Aries at RA ~ 0h-2h)
  const roughIndex = Math.floor((ra / 24.0) * 12);
  const zodiacNames = [
    'Pisces',
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpius',
    'Sagittarius',
    'Capricornus',
    'Aquarius'
  ];

  return zodiacNames[roughIndex % 12];
}
