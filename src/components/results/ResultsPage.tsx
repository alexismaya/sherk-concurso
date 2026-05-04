import React, { useState } from 'react';
import { useContest } from '../../context/ContestContext';
import { Category, Participant } from '../../types';
import Header from '../layout/Header';
import PodiumCard from './PodiumCard';

export default function ResultsPage() {
  const { participants } = useContest();
  const [activeCategory, setActiveCategory] = useState<Category>('kids');

  const allParticipants = Object.values(participants);
  const filtered = allParticipants
    .filter(p => p.category === activeCategory)
    .sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  // Reorder for podium: [2, 1, 3] layout
  const podiumLayout = [
    top3[1], // 2nd place
    top3[0], // 1st place
    top3[2], // 3rd place
  ];

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl space-y-12 animate-fade-in mt-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-7xl text-fairytale-gold font-luckiest drop-shadow-2xl uppercase italic tracking-tighter scale-110">
            🏆 ¡LOS REYES DEL PANTANO! 🏆
          </h2>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center gap-6 p-4 rounded-[3rem] bg-bg-dark/40 border border-white/10 backdrop-blur-md sticky top-6 z-50 shadow-2xl items-center">
          <button
            onClick={() => setActiveCategory('kids')}
            className={`flex-1 py-4 px-10 rounded-[2.5rem] text-2xl font-luckiest transition-all ${
              activeCategory === 'kids'
                ? 'bg-shrek-green text-white shadow-xl scale-110 shadow-shrek-green/30'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            👦 PEQUES
          </button>
          <button
            onClick={() => setActiveCategory('adults')}
            className={`flex-1 py-4 px-10 rounded-[2.5rem] text-2xl font-luckiest transition-all ${
              activeCategory === 'adults'
                ? 'bg-shrek-green text-white shadow-xl scale-110 shadow-shrek-green/30'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            🧔 ADULTOS
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-32">
            {/* Podium */}
            <div className="flex items-end justify-center gap-2 md:gap-8 min-h-[500px] mt-24">
              <PodiumCard participant={podiumLayout[0]} place={2} />
              <PodiumCard participant={podiumLayout[1]} place={1} />
              <PodiumCard participant={podiumLayout[2]} place={3} />
            </div>

            {/* Rest of the scores */}
            {rest.length > 0 && (
              <div className="bg-onion-cream p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-4 border-swamp-brown/20 space-y-8 max-w-3xl mx-auto ring-8 ring-bg-dark/10">
                <h3 className="text-4xl text-bg-dark font-luckiest text-center tracking-wide underline decoration-shrek-green-dark/30 decoration-8 underline-offset-8">
                   HONOR AL PANTANO 🧅
                </h3>
                <div className="space-y-6">
                  {rest.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-6 p-4 rounded-3xl bg-bg-dark/5 hover:bg-bg-dark/10 transition-colors border border-black/5">
                      <span className="text-3xl font-luckiest text-swamp-brown w-10">{i + 4}</span>
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-swamp-brown/20 flex-shrink-0 shadow-lg">
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-luckiest text-bg-dark opacity-90 truncate">{p.name}</p>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                           <div 
                             className="h-full bg-shrek-green shadow-[0_0_10px_rgba(90,138,0,0.5)]" 
                             style={{ width: `${Math.min(100, (p.votes / (top3[0].votes || 1)) * 100)}%` }}
                           />
                        </div>
                      </div>
                      <span className="text-xl font-bold text-shrek-green-dark min-w-[3rem] text-right">
                        {p.votes} 🧅
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-40 animate-pulse opacity-40">
             <span className="text-[10rem]">🐉</span>
             <p className="text-3xl font-luckiest text-white mt-10">¡BURRO ESTÁ CONTANDO LOS VOTOS!</p>
          </div>
        )}
      </div>
    </div>
  );
}
