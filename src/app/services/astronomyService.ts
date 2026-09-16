import { ObserverLocation, AstronomyDataState } from './astronomy/types';
import { getPlanetaryTelemetryList } from './astronomy/planetaryService';
import { getSolarTelemetry } from './astronomy/solar';
import { getLunarTelemetry } from './astronomy/lunar';
import { getUpcomingAstronomicalEvents } from './astronomy/events';
import { locationService } from './locationService';

const CACHE_KEY = 'vyom_astronomy_cache';

class AstronomyService {
  private cache: AstronomyDataState | null = null;
  private listeners: Array<(state: AstronomyDataState) => void> = [];

  constructor() {
    this.loadCache();
    // Subscribe to location updates
    locationService.subscribe(() => {
      this.recompute();
    });
  }

  private loadCache(): void {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        this.cache = parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached astronomy data', e);
    }
  }

  private saveCache(state: AstronomyDataState): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save astronomy cache', e);
    }
  }

  /**
   * Recomputes real astronomical data for current time and location.
   */
  public compute(location?: ObserverLocation, date?: Date): AstronomyDataState {
    const loc = location || locationService.getLocation();
    const now = date || new Date();

    const planets = getPlanetaryTelemetryList(loc, now);
    const sun = getSolarTelemetry(loc, now);
    const moon = getLunarTelemetry(loc, now);

    const state: AstronomyDataState = {
      planets,
      sun,
      moon,
      location: loc,
      lastUpdated: now,
      isLoading: false,
      isOffline: !navigator.onLine,
      error: null
    };

    this.cache = state;
    this.saveCache(state);
    this.notifyListeners(state);
    return state;
  }

  public getData(): AstronomyDataState {
    if (this.cache) {
      // Check if cache is reasonably recent (less than 10 minutes old)
      const ageMs = Date.now() - new Date(this.cache.lastUpdated).getTime();
      if (ageMs < 10 * 60 * 1000) {
        return this.cache;
      }
    }
    return this.compute();
  }

  public recompute(): AstronomyDataState {
    return this.compute();
  }

  public getEvents(date?: Date) {
    return getUpcomingAstronomicalEvents(date || new Date());
  }

  public subscribe(listener: (state: AstronomyDataState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(state: AstronomyDataState): void {
    this.listeners.forEach(fn => fn(state));
  }
}

export const astronomyService = new AstronomyService();
