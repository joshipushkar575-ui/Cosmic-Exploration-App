export interface ObserverLocation {
  latitude: number;
  longitude: number;
  altitude?: number; // meters above sea level
  timezone: string;
  cityName?: string;
  source: 'gps' | 'ip' | 'preset' | 'default';
}

export interface HorizontalCoordinates {
  altitude: number; // in degrees (-90 to +90)
  azimuth: number;  // in degrees (0 to 360, 0 = North, 90 = East)
}

export interface EquatorialCoordinates {
  rightAscension: number; // in hours (0 to 24) or degrees
  declination: number;    // in degrees (-90 to +90)
  distanceAU: number;     // distance from Earth in AU
}

export interface HeliocentricCoordinates {
  longitude: number; // heliocentric ecliptic longitude in degrees (0 to 360)
  latitude: number;  // heliocentric ecliptic latitude in degrees
  radiusAU: number;  // distance from Sun in AU
}

export interface PlanetaryTelemetry {
  name: string;
  color: string;
  image: string;
  facts: string[];
  hasFeature?: 'rings' | 'great-red-spot';
  size: number;
  orbitRadius: number; // relative visual radius for 2D/3D views
  
  // Real astronomical calculated values
  distanceFromEarth: string;     // e.g. "1.24 AU" (or km for close objects)
  distanceFromEarthNumAU: number;
  distanceFromSun: string;       // e.g. "0.39 AU"
  distanceFromSunNumAU: number;
  magnitude: string;             // apparent visual magnitude, e.g. "-4.2"
  magnitudeNum: number;
  constellation: string;         // IAU constellation, e.g. "Virgo"
  visibility: string;            // e.g. "Evening Star", "Visible (Altitude 34°)", "Below Horizon"
  isVisibleNow: boolean;         // currently above horizon
  altitude: number;              // current topocentric altitude in degrees
  azimuth: number;               // current topocentric azimuth in degrees
  nextOpposition: string;        // upcoming opposition date or "N/A"
  riseTime: string;              // formatted local time, e.g. "06:45"
  setTime: string;               // formatted local time, e.g. "19:30"
  transitTime: string;           // meridian transit time
  angularSize: string;           // apparent angular diameter, e.g. "18.4\""
  angularSizeArcsec: number;
  phase: string;                 // illuminated fraction, e.g. "84%"
  phaseFraction: number;         // 0 to 1
  heliocentricLongitude: number; // true heliocentric orbital position in degrees (0 to 360)
  
  // Explorer-specific physical and orbital data
  orbitalPeriodDays: number;
  realDiameterKm: number;
  moonsCount: number;
  type: 'terrestrial' | 'gas-giant' | 'ice-giant';
}

export interface SolarTelemetry {
  altitude: number;
  azimuth: number;
  riseTime: string;
  setTime: string;
  solarNoonTime: string;
  daylightDuration: string;
  civilDawn: string;
  civilDusk: string;
  constellation: string;
  distanceAU: number;
  isDaytime: boolean;
}

export interface LunarTelemetry {
  altitude: number;
  azimuth: number;
  riseTime: string;
  setTime: string;
  distanceKm: number;
  distanceAU: number;
  illumination: number;        // 0 to 100 percentage
  phaseAngle: number;          // phase angle in degrees
  phaseName: string;           // "New Moon", "Waxing Crescent", etc.
  phaseEmoji: string;          // 🌑, 🌓, 🌕, etc.
  ageDays: number;             // days into the synodic month (~0 to 29.53)
  constellation: string;
}

export interface AstronomicalEvent {
  id: string;
  name: string;
  date: string;               // e.g. "Oct 14"
  time: string;               // e.g. "21:30 UTC" or local
  timestamp: number;          // Unix epoch timestamp
  type: 'meteor' | 'eclipse' | 'planet' | 'mission' | 'moon';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  countdownDays: number;
  isToday: boolean;
}

export interface AstronomyDataState {
  planets: PlanetaryTelemetry[];
  sun: SolarTelemetry;
  moon: LunarTelemetry;
  location: ObserverLocation;
  lastUpdated: Date;
  isLoading: boolean;
  isOffline: boolean;
  error: string | null;
}
