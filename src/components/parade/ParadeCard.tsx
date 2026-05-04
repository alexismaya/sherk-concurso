import React from 'react';
import { Participant } from '../../types';

interface ParadeCardProps {
  participant: Participant;
}

export default function ParadeCard({ participant }: ParadeCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in text-center">
      <div className="relative w-full max-w-2xl bg-onion-cream p-4 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-8 border-swamp-brown">
        <div className="absolute -top-12 -left-12 text-7xl animate-bounce-slow">🌿</div>
        <div className="absolute -bottom-12 -right-12 text-7xl animate-bounce-slow delay-700">🧅</div>
        
        <div className="aspect-[4/5] w-full bg-bg-dark rounded-[2.5rem] overflow-hidden border-4 border-swamp-brown/30">
          <img 
            src={participant.photoUrl} 
            alt={participant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="py-8 space-y-2">
          <h2 className="text-6xl md:text-8xl text-bg-dark font-luckiest drop-shadow-sm uppercase">
            {participant.name}
          </h2>
          <span className="inline-block px-8 py-2 bg-shrek-green text-white text-3xl rounded-full font-luckiest shadow-lg">
            {participant.category === 'kids' ? '👦 PEQUEÑO OGRO' : '🧔 OGRO MAYOR'}
          </span>
        </div>
      </div>
    </div>
  );
}
