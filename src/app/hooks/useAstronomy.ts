import { useState, useEffect, useCallback } from 'react';
import { astronomyService } from '../services/astronomyService';
import { AstronomyDataState } from '../services/astronomy/types';

export function useAstronomy() {
  const [data, setData] = useState<AstronomyDataState>(() => astronomyService.getData());

  useEffect(() => {
    // Subscribe to updates from location changes or manual recomputation
    const unsubscribe = astronomyService.subscribe((latest) => {
      setData(latest);
    });

    // Auto-refresh every 60 seconds to keep live positions, altitudes, and times updated
    const interval = setInterval(() => {
      setData(astronomyService.recompute());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const refresh = useCallback(() => {
    const updated = astronomyService.recompute();
    setData(updated);
  }, []);

  return {
    ...data,
    refresh
  };
}
