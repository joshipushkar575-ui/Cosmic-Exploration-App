import { useCallback, useEffect, useState } from 'react';
import {
  fetchNasaCme,
  fetchNasaGeomagneticStorms,
  fetchNasaSolarFlares,
  type NasaCme,
  type NasaGeomagneticStorm,
  type NasaSolarFlare,
} from '../services/api/nasaService';

export function useNasaDonki() {
  const [solarFlares, setSolarFlares] = useState<NasaSolarFlare[]>([]);
  const [cmes, setCmes] = useState<NasaCme[]>([]);
  const [storms, setStorms] = useState<NasaGeomagneticStorm[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDonki = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [flareData, cmeData, stormData] = await Promise.all([
        fetchNasaSolarFlares(),
        fetchNasaCme(),
        fetchNasaGeomagneticStorms(),
      ]);

      setSolarFlares(flareData);
      setCmes(cmeData);
      setStorms(stormData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load NASA space weather data'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonki();
  }, [loadDonki]);

  return {
    solarFlares,
    cmes,
    storms,
    isLoading,
    error,
    refresh: loadDonki,
  };
}
