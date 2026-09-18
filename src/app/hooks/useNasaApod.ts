import { useCallback, useEffect, useState } from 'react';
import { fetchNasaApod, type NasaApod } from '../services/api/nasaService';

export function useNasaApod() {
  const [data, setData] = useState<NasaApod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApod = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apod = await fetchNasaApod();
      setData(apod);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load NASA Astronomy Picture of the Day';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApod();
  }, [loadApod]);

  return {
    data,
    isLoading,
    error,
    refresh: loadApod,
  };
}
