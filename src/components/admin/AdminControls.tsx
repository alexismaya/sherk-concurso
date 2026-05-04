import React, { useState } from 'react';
import { useContest, useContestActions } from '../../context/ContestContext';

export default function AdminControls() {
  const { phase, participants, paradeTimer } = useContest();
  const actions = useContestActions();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const participantCount = Object.keys(participants).length;
  const timerDuration = paradeTimer?.duration ?? 10;

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    actions.setParadeTimerDuration(value);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-50 animate-slide-up">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-bg-dark/90 backdrop-blur-2xl border-4 border-shrek-green/40 p-6 rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex items-center justify-between gap-4 ring-8 ring-shrek-green/10">
          
          <div className="flex flex-col gap-1 px-4">
            <span className="text-sm font-bold text-shrek-green/80 uppercase tracking-widest">ESTADO ACTUAL</span>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-shrek-green animate-pulse shadow-[0_0_10px_rgba(90,138,0,0.8)]" />
              <h3 className="text-2xl font-luckiest text-white uppercase tracking-wider">
                {phase === 'registration' ? '📝 REGISTRO' : 
                 phase === 'parade' ? '🎬 DESFILE' : 
                 phase === 'voting' ? '🗳️ VOTACIÓN' : '🏆 RESULTADOS'}
              </h3>
            </div>
            <p className="text-white/40 text-sm font-bold opacity-60">
              {participantCount} {participantCount === 1 ? 'OGRO' : 'OGROS'} EN EL PANTANO
            </p>
          </div>

          <div className="flex gap-4 items-center">
            {phase === 'registration' && (
              <button
                onClick={() => actions.setPhase('parade', participants)}
                disabled={participantCount === 0}
                className="btn-primary px-10 py-5 text-2xl group flex items-center gap-4 hover:scale-105 transition-transform"
              >
                🎬 INICIAR DESFILE
                <span className="group-hover:rotate-12 transition-transform">➡️</span>
              </button>
            )}

            {phase === 'parade' && (
              <>
                {/* Timer duration slider */}
                <div className="flex items-center gap-2 bg-bg-dark/60 px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-onion-cream/70 text-sm font-bold whitespace-nowrap">⏱️</span>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={timerDuration}
                    onChange={handleDurationChange}
                    className="w-24 accent-shrek-green cursor-pointer"
                  />
                  <span className="text-fairytale-gold font-luckiest text-sm w-8 text-right">
                    {timerDuration}s
                  </span>
                </div>

                <button
                  onClick={() => actions.setPhase('voting')}
                  className="btn-primary px-10 py-5 text-2xl flex items-center gap-4 bg-fairytale-gold hover:bg-fairytale-gold/80 hover:scale-105 transition-transform"
                >
                  🗳️ INICIAR VOTACIÓN
                </button>
              </>
            )}

            {phase === 'voting' && (
              <button
                onClick={() => actions.setPhase('results')}
                className="btn-primary px-10 py-5 text-2xl flex items-center gap-4 bg-fairytale-gold hover:bg-fairytale-gold/80 hover:scale-105 transition-transform"
              >
                📊 VER PODIO FINAL
              </button>
            )}

            {phase === 'results' && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-secondary px-8 py-5 text-xl flex items-center gap-3 hover:bg-red-900 border-2 border-transparent hover:border-red-500/50 transition-all"
              >
                🔄 REINICIAR TODO
              </button>
            )}
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-onion-cream p-12 rounded-[3.5rem] max-w-md border-8 border-swamp-brown shadow-2xl text-center space-y-8 animate-bounce-slow">
            <span className="text-8xl">🧅</span>
            <div className="space-y-4">
              <h2 className="text-4xl text-bg-dark font-luckiest">¿LIMPIAR EL PANTANO?</h2>
              <p className="text-xl text-bg-dark/70 font-bold leading-relaxed">
                Se borrarán todos los participantes y votos. No hay vuelta atrás...
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => { actions.reset(); setShowResetConfirm(false); }}
                className="flex-1 py-5 bg-red-700 text-white rounded-2xl font-luckiest text-2xl hover:bg-red-800 transition-colors shadow-lg"
              >
                SÍ, BORRAR
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-5 bg-swamp-brown text-white rounded-2xl font-luckiest text-2xl hover:opacity-90 transition-opacity shadow-lg"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
