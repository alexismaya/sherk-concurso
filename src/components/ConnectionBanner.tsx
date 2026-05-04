import React from 'react';

interface ConnectionBannerProps {
  isOnline: boolean;
}

/**
 * Persistent banner shown at the top of the screen when the device is offline.
 *
 * Renders nothing when `isOnline` is `true`. Uses a CSS transition for smooth
 * entry/exit animation.
 */
export default function ConnectionBanner({ isOnline }: ConnectionBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOnline ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'}
      `}
    >
      <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white text-sm md:text-base font-bold shadow-lg">
        <span className="text-xl" role="img" aria-label="antena">
          📡
        </span>
        <span>Sin conexión — Verifica tu internet</span>
      </div>
    </div>
  );
}
