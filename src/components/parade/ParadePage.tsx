import React from 'react';
import { useContest, useContestActions } from '../../context/ContestContext';
import ParadeCard from './ParadeCard';
import ParadeTimer from './ParadeTimer';
import Header from '../layout/Header';

export default function ParadePage() {
  const { participants, paradeQueue, currentParadeIndex, paradeTimer } = useContest();
  const actions = useContestActions();

  const durationSeconds = paradeTimer?.duration ?? 10;

  const currentParticipantId = paradeQueue[currentParadeIndex];
  const participant = currentParticipantId ? participants[currentParticipantId] : null;

  const handleAdvance = () => {
    actions.nextParadeStep(currentParadeIndex);
  };

  const handleDurationChange = (seconds: number) => {
    actions.setParadeTimerDuration(seconds);
  };

  if (!participant && paradeQueue.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8 animate-fade-in bg-gradient-to-b from-bg-dark to-shrek-green-dark/30">
        <h2 className="text-7xl text-fairytale-gold font-luckiest drop-shadow-2xl">¡El Desfile Terminó! 🏁</h2>
        <p className="text-4xl text-onion-cream font-bold opacity-80 decoration-shrek-green underline-offset-8 underline">
          ¡A prepararse para votar! 🧅
        </p>
        <button
          onClick={() => actions.setPhase('voting')}
          className="btn-primary text-4xl px-12 py-6 rounded-[2rem] hover:scale-110 active:scale-95 transition-transform"
        >
          🗳️ Abrir Urnas 🗳️
        </button>
      </div>
    );
  }

  if (paradeQueue.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg-dark text-center gap-6">
        <h2 className="text-4xl text-fairytale-gold font-luckiest">No hay nadie en el pantano... 🌿</h2>
        <button
          onClick={() => actions.setPhase('registration')}
          className="btn-secondary text-2xl"
        >
          Regresar a Registro
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark/20 relative overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-12 p-8 mb-20">
        <div className="absolute top-4 right-10 flex flex-col items-end gap-2 p-4 bg-onion-cream/10 rounded-2xl border border-white/10 backdrop-blur-md">
          <span className="text-2xl text-fairytale-gold font-luckiest drop-shadow-sm uppercase opacity-90">
            PASARELA {currentParadeIndex + 1} de {paradeQueue.length}
          </span>
          <div className="h-4 w-64 bg-bg-dark/50 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-shrek-green transition-all duration-700 ease-out shadow-[0_0_15px_rgba(90,138,0,0.5)]"
              style={{ width: `${((currentParadeIndex + 1) / paradeQueue.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Parade Timer — between counter and participant card */}
        <ParadeTimer
          isAdmin={true}
          currentParadeIndex={currentParadeIndex}
          paradeQueueLength={paradeQueue.length}
          durationSeconds={durationSeconds}
          onAdvance={handleAdvance}
          onDurationChange={handleDurationChange}
        />

        {participant && <ParadeCard participant={participant} key={participant.id} />}

        <div className="fixed bottom-12 left-0 right-0 flex justify-center px-8 z-50">
          <div className="bg-bg-dark/80 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-8 ring-4 ring-shrek-green/20">
            <button
              onClick={() => actions.nextParadeStep(currentParadeIndex)}
              className="group btn-primary px-16 py-6 text-4xl flex items-center gap-6 hover:shadow-[0_0_30px_rgba(90,138,0,0.4)]"
            >
              🚀 SIGUIENTE OGRO
              <span className="group-hover:translate-x-3 transition-transform">➡️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
