import React from 'react';
import { Participant } from '../../types';

interface PodiumCardProps {
  participant?: Participant;
  place: 1 | 2 | 3;
}

export default function PodiumCard({ participant, place }: PodiumCardProps) {
  const heightClass = place === 1 ? 'h-64 md:h-80' : place === 2 ? 'h-48 md:h-64' : 'h-40 md:h-56';
  const colorClass = place === 1 ? 'bg-fairytale-gold' : place === 2 ? 'bg-gray-300' : 'bg-swamp-brown';
  const borderClass = place === 1 ? 'border-fairytale-gold/50' : place === 2 ? 'border-gray-200/50' : 'border-swamp-brown/50';

  if (!participant) return (
    <div className={`flex flex-col items-center justify-end w-full max-w-[200px] opacity-40 animate-pulse`}>
      <div className={`${heightClass} ${colorClass} w-full rounded-t-[3rem] border-x-4 border-t-4 ${borderClass} shadow-2xl flex items-center justify-center`}>
        <span className="text-4xl text-white font-luckiest">{place}</span>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-end w-full max-w-[200px] gap-4 ${place === 1 ? 'z-10 -translate-y-4' : ''}`}>
      <div className="relative group">
        <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-8 ${place === 1 ? 'border-fairytale-gold animate-bounce shadow-[0_0_40px_rgba(232,160,32,0.3)]' : 'border-swamp-brown/50'} shadow-xl transition-transform hover:scale-110`}>
          <img 
            src={participant.photoUrl} 
            alt={participant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        {place === 1 && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg scale-150">👑</div>
        )}
      </div>

      <div className="text-center w-full px-2">
        <h4 className="text-xl md:text-2xl font-luckiest text-white truncate max-w-full drop-shadow-md">
          {participant.name}
        </h4>
        <span className="text-sm font-bold opacity-80 decoration-shrek-green underline tracking-widest uppercase">
          {participant.votes} VOTOS {participant.votes === 1 ? '🧅' : '🧅s'}
        </span>
      </div>

      <div className={`${heightClass} ${colorClass} w-full rounded-t-[3.5rem] border-x-4 border-t-4 ${borderClass} shadow-[0_-5px_30px_rgba(0,0,0,0.4)] flex flex-col items-center gap-2 pt-6`}>
        <span className="text-6xl md:text-8xl text-white font-luckiest drop-shadow-md">
          {place}
        </span>
      </div>
    </div>
  );
}
