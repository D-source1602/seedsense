import { useEffect, useState } from 'react';
import type { LocationSelection } from '../types';

const KEY = 'selectedLocation';

/**
 * Persists the user's chosen state/location across pages
 * (matches the original sessionStorage 'selectedLocation' contract).
 */
export function useSelectedLocation() {
  const [location, setLocation] = useState<LocationSelection | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as LocationSelection) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (location) {
      sessionStorage.setItem(KEY, JSON.stringify(location));
    }
  }, [location]);

  const clear = () => {
    sessionStorage.removeItem(KEY);
    setLocation(null);
  };

  return { location, setLocation, clear };
}

/** Used by the Recommendations page to read the saved location once. */
export function readSavedLocation(): LocationSelection | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocationSelection) : null;
  } catch {
    return null;
  }
}
