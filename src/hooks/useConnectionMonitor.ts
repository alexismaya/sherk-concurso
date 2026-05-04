import { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export interface UseConnectionMonitorReturn {
  isOnline: boolean;
  isFirebaseConnected: boolean;
}

/**
 * Hook that monitors both browser connectivity and Firebase Realtime Database
 * connection status.
 *
 * - Uses `navigator.onLine` + `online`/`offline` events for browser connectivity.
 * - Uses Firebase `.info/connected` for database connectivity.
 * - Implements a 3-second delay on reconnection before reporting `isOnline: true`
 *   to avoid UI flicker from transient reconnects.
 */
export function useConnectionMonitor(): UseConnectionMonitorReturn {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Browser online/offline events ──
  useEffect(() => {
    const handleOnline = () => {
      // Delay reporting online to avoid flicker
      reconnectTimerRef.current = setTimeout(() => {
        setIsOnline(true);
        reconnectTimerRef.current = null;
      }, 3000);
    };

    const handleOffline = () => {
      // Cancel any pending reconnect timer
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, []);

  // ── Firebase .info/connected listener ──
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    const unsubscribe = onValue(connectedRef, (snapshot) => {
      setIsFirebaseConnected(snapshot.val() === true);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline, isFirebaseConnected };
}
