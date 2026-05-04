import { useState, useRef, useEffect, useCallback } from 'react';
import { RateLimiter } from '../utils/rateLimiter';

export interface RateLimiterConfig {
  cooldownMs: number;
  key: string;
}

export interface UseRateLimiterReturn {
  isLimited: boolean;
  remainingMs: number;
  execute: <T>(fn: () => Promise<T>) => Promise<T | null>;
}

/**
 * Hook that wraps the RateLimiter utility for use in React components.
 * Provides reactive `isLimited` / `remainingMs` state and an `execute` helper
 * that only runs the given async function when the cooldown has elapsed.
 */
export function useRateLimiter({ cooldownMs, key }: RateLimiterConfig): UseRateLimiterReturn {
  const limiterRef = useRef<RateLimiter>(new RateLimiter());

  const [isLimited, setIsLimited] = useState<boolean>(false);
  const [remainingMs, setRemainingMs] = useState<number>(0);

  // Tick interval that updates remaining time while limited
  useEffect(() => {
    if (!isLimited) return;

    const interval = setInterval(() => {
      const remaining = limiterRef.current.getRemainingMs(key, cooldownMs);
      setRemainingMs(remaining);
      if (remaining <= 0) {
        setIsLimited(false);
        setRemainingMs(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLimited, key, cooldownMs]);

  const execute = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      if (!limiterRef.current.canExecute(key, cooldownMs)) {
        return null;
      }

      limiterRef.current.recordExecution(key);
      setIsLimited(true);
      setRemainingMs(cooldownMs);

      return fn();
    },
    [key, cooldownMs],
  );

  return { isLimited, remainingMs, execute };
}
