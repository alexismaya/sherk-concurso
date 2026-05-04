import React, { useEffect, useState } from 'react';
import './SwampBackground.css';
import swampImg from '../../assets/swamp.png';

export default function SwampBackground() {
  const [fireflies, setFireflies] = useState<{ id: number; top: string; left: string; delay: string; duration: string }[]>([]);
  const [ripples, setRipples] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate fireflies with random positions and animation delays
    const newFireflies = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setFireflies(newFireflies);

    // Generate ripples
    const newRipples = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 30 + 70}%`,
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 5}s`,
    }));
    setRipples(newRipples);
  }, []);

  return (
    <div className="swamp-container">
      {/* Base Image Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img 
          src={swampImg} 
          className="w-full h-full object-cover opacity-40 scale-110 animate-slow-zoom" 
          alt="" 
        />
      </div>

      {/* Distant Mist */}
      <div className="mist-layer mist-2"></div>
      
      {/* Background Trees (SVG Silhouettes) */}
      <svg className="swamp-svg opacity-30" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <path d="M0,400 L0,300 Q50,250 100,320 T200,280 T300,350 T400,300 T500,380 T600,280 T700,320 T800,250 T900,350 T1000,300 L1000,400 Z" fill="#0a1a05" />
      </svg>

      {/* Mid Mist */}
      <div className="mist-layer mist-1"></div>

      {/* Mid Trees */}
      <svg className="swamp-svg opacity-60" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <path className="reeds" d="M100,400 Q120,200 140,400 M300,400 Q320,150 340,400 M500,400 Q520,250 540,400 M700,400 Q720,180 740,400 M900,400 Q920,220 940,400" stroke="#1a2e0a" strokeWidth="15" fill="none" />
        <path d="M0,400 L0,350 Q100,300 200,380 T400,320 T600,390 T800,310 T1000,380 L1000,400 Z" fill="#142608" />
      </svg>

      {/* Water Surface */}
      <div className="swamp-water">
        {ripples.map((r) => (
          <div
            key={r.id}
            className="ripple"
            style={{
              top: r.top,
              left: r.left,
              animationDelay: r.delay,
            }}
          />
        ))}
      </div>

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{
            top: f.top,
            left: f.left,
            animation: `moveFirefly ${f.duration} ease-in-out ${f.delay} infinite, flicker 3s ease-in-out ${f.delay} infinite`,
          }}
        />
      ))}

      {/* Foreground Reeds */}
      <svg className="swamp-svg" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <g className="reeds" style={{ animationDelay: '0.5s' }}>
          <path d="M50,400 Q70,100 90,400" stroke="#0a1a05" strokeWidth="10" fill="none" />
          <path d="M850,400 Q870,120 890,400" stroke="#0a1a05" strokeWidth="12" fill="none" />
        </g>
      </svg>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
