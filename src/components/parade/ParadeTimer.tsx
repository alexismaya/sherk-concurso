import React from 'react';
import { useParadeTimer } from '../../hooks/useParadeTimer';

interface ParadeTimerProps {
  isAdmin: boolean;
  currentParadeIndex: number;
  paradeQueueLength: number;
  onAdvance: () => void;
  durationSeconds: number;
  onDurationChange?: (seconds: number) => void;
}

/**
 * Visual timer component for the parade phase.
 *
 * Shows a progress bar that decreases as time runs out (green → yellow → red),
 * the remaining time in seconds, and optional admin controls for adjusting
 * duration and pausing/resuming.
 */
export default function ParadeTimer({
  isAdmin,
  currentParadeIndex,
  paradeQueueLength,
  onAdvance,
  durationSeconds,
  onDurationChange,
}: ParadeTimerProps) {
  const { state, pause, resume, setDuration } = useParadeTimer({
    durationSeconds,
    currentParadeIndex,
    paradeQueueLength,
    onAdvance,
  });

  const { timeRemaining, progress, isRunning, isPaused } = state;

  // Determine bar color based on progress (1 = full → 0 = empty)
  const barColor =
    progress > 0.5
      ? 'bg-shrek-green'
      : progress > 0.25
        ? 'bg-yellow-500'
        : 'bg-red-500';

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDuration(value);
    onDurationChange?.(value);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Progress bar */}
      <div className="relative h-5 bg-bg-dark/60 rounded-full overflow-hidden border border-white/10 shadow-inner">
        <div
          className={`h-full ${barColor} transition-all duration-100 ease-linear rounded-full shadow-[0_0_10px_rgba(90,138,0,0.4)]`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Time remaining */}
      <p className="text-center text-onion-cream font-luckiest text-lg tracking-wide">
        ⏱️ {timeRemaining.toFixed(1)}s
        {isPaused && (
          <span className="ml-2 text-fairytale-gold animate-pulse">⏸ Pausado</span>
        )}
        {!isRunning && !isPaused && (
          <span className="ml-2 text-white/50">— Detenido</span>
        )}
      </p>

      {/* Admin controls */}
      {isAdmin && (
        <div className="flex flex-col gap-3 bg-bg-dark/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Duration slider */}
          <label className="flex items-center gap-3 text-onion-cream/80 text-sm">
            <span className="whitespace-nowrap font-bold">Duración:</span>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={durationSeconds}
              onChange={handleDurationChange}
              className="flex-1 accent-shrek-green cursor-pointer"
            />
            <span className="w-10 text-right font-luckiest text-fairytale-gold">
              {durationSeconds}s
            </span>
          </label>

          {/* Pause / Resume button */}
          {isRunning && (
            <button
              onClick={handlePauseResume}
              className="px-6 py-2 rounded-xl font-luckiest text-sm transition-all hover:scale-105 active:scale-95 shadow-md
                bg-swamp-brown/60 hover:bg-swamp-brown text-onion-cream border border-white/10"
            >
              {isPaused ? '▶️ Reanudar' : '⏸️ Pausar'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
