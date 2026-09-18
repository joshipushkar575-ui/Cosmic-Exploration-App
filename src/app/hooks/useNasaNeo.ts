import { useCallback, useEffect, useState } from 'react';
import { fetchNasaNeo, type NasaNeoData } from '../services/api/nasaService';

export function useNasaNeo() {
  const [data, setData] = useState<NasaNeoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNeo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const neo = await fetchNasaNeo();
      setData(neo);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load NASA Near-Earth Object data'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNeo();
  }, [loadNeo]);

  return {
    data,
    isLoading,
    error,
    refresh: loadNeo,
  };
}
