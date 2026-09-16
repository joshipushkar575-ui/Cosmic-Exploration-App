import { ObserverLocation } from './astronomy/types';

export const PRESET_CITIES: Record<string, ObserverLocation> = {
  Mumbai: {
    latitude: 19.0760,
    longitude: 72.8777,
    altitude: 14,
    timezone: 'Asia/Kolkata',
    cityName: 'Mumbai, India',
    source: 'preset'
  },
  'New York': {
    latitude: 40.7128,
    longitude: -74.0060,
    altitude: 10,
    timezone: 'America/New_York',
    cityName: 'New York, USA',
    source: 'preset'
  },
  London: {
    latitude: 51.5074,
    longitude: -0.1278,
    altitude: 25,
    timezone: 'Europe/London',
    cityName: 'London, UK',
    source: 'preset'
  },
  Tokyo: {
    latitude: 35.6762,
    longitude: 139.6503,
    altitude: 40,
    timezone: 'Asia/Tokyo',
    cityName: 'Tokyo, Japan',
    source: 'preset'
  },
  Sydney: {
    latitude: -33.8688,
    longitude: 151.2093,
    altitude: 19,
    timezone: 'Australia/Sydney',
    cityName: 'Sydney, Australia',
    source: 'preset'
  },
  Cairo: {
    latitude: 30.0444,
    longitude: 31.2357,
    altitude: 23,
    timezone: 'Africa/Cairo',
    cityName: 'Cairo, Egypt',
    source: 'preset'
  }
};

const DEFAULT_LOCATION: ObserverLocation = PRESET_CITIES.Mumbai;
const STORAGE_KEY = 'vyom_observer_location';

class LocationService {
  private currentLocation: ObserverLocation;
  private listeners: Array<(loc: ObserverLocation) => void> = [];

  constructor() {
    this.currentLocation = this.loadStoredLocation() || DEFAULT_LOCATION;
  }

  private loadStoredLocation(): ObserverLocation | null {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        return JSON.parse(item) as ObserverLocation;
      }
    } catch (e) {
      console.warn('Failed to load observer location from localStorage', e);
    }
    return null;
  }

  private saveLocation(loc: ObserverLocation): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      console.warn('Failed to save observer location to localStorage', e);
    }
  }

  public getLocation(): ObserverLocation {
    return this.currentLocation;
  }

  public setLocation(loc: ObserverLocation): void {
    this.currentLocation = loc;
    this.saveLocation(loc);
    this.notifyListeners();
  }

  public setPreset(cityName: string): void {
    const preset = PRESET_CITIES[cityName];
    if (preset) {
      this.setLocation(preset);
    }
  }

  public async requestBrowserLocation(): Promise<ObserverLocation> {
    if (!navigator.geolocation) {
      return this.currentLocation;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const detectedLoc: ObserverLocation = {
            latitude: parseFloat(pos.coords.latitude.toFixed(4)),
            longitude: parseFloat(pos.coords.longitude.toFixed(4)),
            altitude: pos.coords.altitude || 10,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            cityName: 'Local Coordinates',
            source: 'gps'
          };
          this.setLocation(detectedLoc);
          resolve(detectedLoc);
        },
        (err) => {
          console.warn('Geolocation failed or denied, using cached/preset location:', err.message);
          resolve(this.currentLocation);
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    });
  }

  public subscribe(listener: (loc: ObserverLocation) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn(this.currentLocation));
  }
}

export const locationService = new LocationService();
