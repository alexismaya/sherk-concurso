import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Pure helpers (exported for independent testing) ───────────────────────

/** Clamp a duration value to the valid range [5, 30]. */
export function clampDuration(value: number): number {
  if (value < 5) return 5;
  if (value > 30) return 30;
  return value;
}

/**
 * Calculate progress as a ratio in [0, 1].
 * Returns 0 when totalDuration is <= 0 to avoid division by zero.
 */
export function calculateProgress(timeRemaining: number, totalDuration: number): number {
  if (totalDuration <= 0) return 0;
  const raw = timeRemaining / totalDuration;
  if (raw < 0) return 0;
  if (raw > 1) return 1;
  return raw;
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ParadeTimerState {
  timeRemaining: number;   // seconds remaining
  progress: number;        // 0-1 for progress bar
  isRunning: boolean;
  isPaused: boolean;
}

export interface UseParadeTimerReturn {
  state: ParadeTimerState;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setDuration: (seconds: number) => void;
}

interface UseParadeTimerConfig {
  durationSeconds: number;
  currentParadeIndex: number;
  paradeQueueLength: number;
  onAdvance: () => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useParadeTimer({
  durationSeconds,
  currentParadeIndex,
  paradeQueueLength,
  onAdvance,
}: UseParadeTimerConfig): UseParadeTimerReturn {
  const clampedDuration = clampDuration(durationSeconds);

  const [duration, setDurationState] = useState<number>(clampedDuration);
  const [timeRemaining, setTimeRemaining] = useState<number>(clampedDuration);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Keep a ref to onAdvance so the interval always calls the latest version
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;

  // Track whether we already fired onAdvance for the current index
  const hasFiredRef = useRef(false);

  // ── Reset when currentParadeIndex changes ──
  useEffect(() => {
    hasFiredRef.current = false;

    // Stop if we've reached the end of the queue
    if (currentParadeIndex >= paradeQueueLength - 1) {
      setIsRunning(false);
      setIsPaused(false);
      setTimeRemaining(duration);
      return;
    }

    setTimeRemaining(duration);
    setIsRunning(true);
    setIsPaused(false);
  }, [currentParadeIndex, paradeQueueLength, duration]);

  // ── Interval tick (100ms for smooth progress) ──
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          clearInterval(interval);
          if (!hasFiredRef.current) {
            hasFiredRef.current = true;
            // Fire onAdvance asynchronously to avoid state updates during render
            queueMicrotask(() => onAdvanceRef.current());
          }
          return 0;
        }
        return parseFloat(next.toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // ── Actions ──

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const reset = useCallback(() => {
    hasFiredRef.current = false;
    setTimeRemaining(duration);
    setIsRunning(true);
    setIsPaused(false);
  }, [duration]);

  const setDuration = useCallback((seconds: number) => {
    const clamped = clampDuration(seconds);
    setDurationState(clamped);
    setTimeRemaining(clamped);
    hasFiredRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const progress = calculateProgress(timeRemaining, duration);

  return {
    state: { timeRemaining, progress, isRunning, isPaused },
    pause,
    resume,
    reset,
    setDuration,
  };
}
