/**
 * Astronomy API Client Layer
 * Handles communication with backend astronomy services and external third-party endpoints.
 * Never exposes API keys or secrets directly in client bundles.
 */

export interface ApiResponse<T> {
  data: T | null;
  source: 'api' | 'calculation' | 'cache';
  error?: string;
}

class AstronomyApiClient {
  private backendBaseUrl: string;

  constructor() {
    // Uses optional backend proxy url from environment, otherwise operates in high-precision client calculation mode
    this.backendBaseUrl = (import.meta as any).env?.VITE_ASTRONOMY_API_URL || '';
  }

  /**
   * Fetches latest space telemetry or falls back to local high-precision computation.
   */
  public async fetchTelemetry<T>(endpoint: string, fallbackFn: () => T): Promise<ApiResponse<T>> {
    if (!this.backendBaseUrl) {
      return {
        data: fallbackFn(),
        source: 'calculation'
      };
    }

    try {
      const res = await fetch(`${this.backendBaseUrl}/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
      const data = await res.json();
      return {
        data,
        source: 'api'
      };
    } catch (err: any) {
      console.warn(`Falling back to local ephemeris computation:`, err.message);
      return {
        data: fallbackFn(),
        source: 'calculation',
        error: err.message
      };
    }
  }
}

export const astronomyApiClient = new AstronomyApiClient();
