import React from 'react';
import { Participant } from '../../types';

interface VoteCardProps {
  participant: Participant;
  hasVotedInCategory: boolean;
  onVote: (id: string) => void;
  isVotedByMe: boolean;
  disabled?: boolean;
}

export default function VoteCard({ participant, hasVotedInCategory, onVote, isVotedByMe, disabled }: VoteCardProps) {
  return (
    <div 
      className={`card flex flex-col gap-4 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-4 ${
        isVotedByMe ? 'border-fairytale-gold shadow-[0_0_20px_rgba(232,160,32,0.5)] bg-onion-cream' : 'border-swamp-brown/20'
      } ${hasVotedInCategory && !isVotedByMe ? 'opacity-60 grayscale-[0.3]' : ''}`}
      onClick={() => !hasVotedInCategory && !disabled && onVote(participant.id)}
    >
      <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-swamp-brown/20 relative">
        <img 
          src={participant.photoUrl} 
          alt={participant.name} 
          className="w-full h-full object-cover"
        />
        {isVotedByMe && (
          <div className="absolute inset-0 bg-fairytale-gold/20 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-6xl text-fairytale-gold drop-shadow-lg animate-bounce-slow">✅</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <h4 className="text-2xl font-luckiest text-bg-dark leading-tight uppercase tracking-tight">
          {participant.name}
        </h4>
        <button
          disabled={hasVotedInCategory || disabled}
          className={`w-full py-3 rounded-xl font-bold transition-all shadow-md ${
            isVotedByMe 
              ? 'bg-fairytale-gold text-white cursor-default' 
              : hasVotedInCategory || disabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-shrek-green hover:bg-shrek-green-dark text-white active:scale-95'
          }`}
        >
          {isVotedByMe ? '❤️ ¡Votado!' : hasVotedInCategory ? 'Voto Cerrado' : '❤️ Votar'}
        </button>
      </div>
    </div>
  );
}
