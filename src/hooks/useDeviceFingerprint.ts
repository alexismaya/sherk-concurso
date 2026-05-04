import { useState, useEffect } from 'react';
import { generateFingerprint } from '../utils/fingerprint';

export interface UseDeviceFingerprintReturn {
  fingerprint: string;
  isReady: boolean;
}

/** In-memory cache so we only compute the fingerprint once per session. */
let cachedFingerprint: string | null = null;

/**
 * Hook that generates a device fingerprint on mount and caches it in memory.
 * Returns the fingerprint string and a readiness flag.
 */
export function useDeviceFingerprint(): UseDeviceFingerprintReturn {
  const [fingerprint, setFingerprint] = useState<string>(cachedFingerprint ?? '');
  const [isReady, setIsReady] = useState<boolean>(cachedFingerprint !== null);

  useEffect(() => {
    // If we already have a cached value, no need to recompute
    if (cachedFingerprint !== null) {
      setFingerprint(cachedFingerprint);
      setIsReady(true);
      return;
    }

    let cancelled = false;

    generateFingerprint().then((fp) => {
      if (!cancelled) {
        cachedFingerprint = fp;
        setFingerprint(fp);
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { fingerprint, isReady };
}
