import { useState, useEffect } from 'react';
import { locationService, PRESET_CITIES } from '../services/locationService';
import { ObserverLocation } from '../services/astronomy/types';

export function useLocation() {
  const [location, setLocationState] = useState<ObserverLocation>(locationService.getLocation());
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const unsubscribe = locationService.subscribe((newLoc) => {
      setLocationState(newLoc);
    });
    return unsubscribe;
  }, []);

  const setLocation = (loc: ObserverLocation) => {
    locationService.setLocation(loc);
  };

  const setPreset = (cityName: string) => {
    locationService.setPreset(cityName);
  };

  const requestBrowserLocation = async () => {
    setIsDetecting(true);
    try {
      const loc = await locationService.requestBrowserLocation();
      setLocationState(loc);
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    location,
    setLocation,
    setPreset,
    requestBrowserLocation,
    isDetecting,
    presetCities: Object.keys(PRESET_CITIES)
  };
}
