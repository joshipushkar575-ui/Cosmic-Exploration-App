import { supabase } from '../../../lib/supabase';

export interface NasaApod {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version?: string;
  title: string;
  url: string;
}

interface NasaApodResponse {
  success: boolean;
  source: string;
  type: string;
  data: NasaApod;
  fetchedAt: string;
  error?: string;
}

export async function fetchNasaApod(): Promise<NasaApod> {
  const { data, error } = await supabase.functions.invoke('space-data', {
    body: {
      type: 'apod',
    },
  });

  if (error) {
    throw new Error(error.message || 'Unable to fetch NASA APOD');
  }

  const response = data as NasaApodResponse;

  if (!response?.success || !response?.data) {
    throw new Error(response?.error || 'NASA APOD data unavailable');
  }

  return response.data;
}

export interface NasaNeoObject {
  id: string;
  name: string;
  nasa_jpl_url?: string;
  absolute_magnitude_h?: number;
  is_potentially_hazardous_asteroid?: boolean;
  close_approach_data?: Array<{
    close_approach_date?: string;
    close_approach_date_full?: string;
    relative_velocity?: {
      kilometers_per_second?: string;
      kilometers_per_hour?: string;
    };
    miss_distance?: {
      astronomical?: string;
      lunar?: string;
      kilometers?: string;
    };
    orbiting_body?: string;
  }>;
}

export interface NasaNeoData {
  element_count: number;
  near_earth_objects: Record<string, NasaNeoObject[]>;
}

interface NasaNeoResponse {
  success: boolean;
  source: string;
  type: string;
  data: NasaNeoData;
  fetchedAt: string;
  error?: string;
}

export async function fetchNasaNeo(): Promise<NasaNeoData> {
  const { data, error } = await supabase.functions.invoke('space-data', {
    body: {
      type: 'neo',
    },
  });

  if (error) {
    throw new Error(error.message || 'Unable to fetch NASA NEO data');
  }

  const response = data as NasaNeoResponse;

  if (!response?.success || !response?.data) {
    throw new Error(response?.error || 'NASA NEO data unavailable');
  }

  return response.data;
}

export interface NasaSolarFlare {
  flrID?: string;
  beginTime?: string;
  peakTime?: string;
  endTime?: string;
  classType?: string;
  sourceLocation?: string;
  activeRegionNum?: number;
}

export interface NasaCme {
  activityID?: string;
  startTime?: string;
  note?: string;
  type?: string;
  sourceLocation?: string;
  linkedEvents?: Array<{
    activityID?: string;
  }>;
}

export interface NasaGeomagneticStorm {
  gstID?: string;
  startTime?: string;
  allKpIndex?: Array<{
    kpIndex?: number;
    source?: string;
  }>;
  linkedEvents?: Array<{
    activityID?: string;
  }>;
}

interface NasaDonkiResponse<T> {
  success: boolean;
  source: string;
  type: string;
  data: T;
  fetchedAt: string;
  error?: string;
}

export async function fetchNasaSolarFlares(): Promise<NasaSolarFlare[]> {
  const { data, error } = await supabase.functions.invoke('space-data', {
    body: {
      type: 'solar-flares',
    },
  });

  if (error) {
    throw new Error(error.message || 'Unable to fetch NASA solar flare data');
  }

  const response = data as NasaDonkiResponse<NasaSolarFlare[]>;

  if (!response?.success || !Array.isArray(response.data)) {
    throw new Error(response?.error || 'NASA solar flare data unavailable');
  }

  return response.data;
}

export async function fetchNasaCme(): Promise<NasaCme[]> {
  const { data, error } = await supabase.functions.invoke('space-data', {
    body: {
      type: 'cme',
    },
  });

  if (error) {
    throw new Error(error.message || 'Unable to fetch NASA CME data');
  }

  const response = data as NasaDonkiResponse<NasaCme[]>;

  if (!response?.success || !Array.isArray(response.data)) {
    throw new Error(response?.error || 'NASA CME data unavailable');
  }

  return response.data;
}

export async function fetchNasaGeomagneticStorms(): Promise<NasaGeomagneticStorm[]> {
  const { data, error } = await supabase.functions.invoke('space-data', {
    body: {
      type: 'storms',
    },
  });

  if (error) {
    throw new Error(error.message || 'Unable to fetch NASA geomagnetic storm data');
  }

  const response = data as NasaDonkiResponse<NasaGeomagneticStorm[]>;

  if (!response?.success || !Array.isArray(response.data)) {
    throw new Error(response?.error || 'NASA geomagnetic storm data unavailable');
  }

  return response.data;
}
