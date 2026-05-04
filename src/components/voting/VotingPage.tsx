import React, { useState, useEffect } from 'react';
import { useContest, useContestActions } from '../../context/ContestContext';
import { Category } from '../../types';
import { useDeviceFingerprint } from '../../hooks/useDeviceFingerprint';
import { useRateLimiter } from '../../hooks/useRateLimiter';
import Header from '../layout/Header';
import VoteCard from './VoteCard';

interface VotingPageProps {
  isAdmin?: boolean;
  isOnline?: boolean;
}

export default function VotingPage({ isAdmin, isOnline = true }: VotingPageProps) {
  const { participants, votedDevices } = useContest();
  const actions = useContestActions();
  const { fingerprint, isReady: isFingerprintReady } = useDeviceFingerprint();
  const [activeCategory, setActiveCategory] = useState<Category>('kids');

  // Async operation state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate limiter per category
  const kidsLimiter = useRateLimiter({ cooldownMs: 2000, key: 'vote-kids' });
  const adultsLimiter = useRateLimiter({ cooldownMs: 2000, key: 'vote-adults' });
  const rateLimiter = activeCategory === 'kids' ? kidsLimiter : adultsLimiter;

  // Local state for immediate UI feedback before sync
  const [localVoted, setLocalVoted] = useState<Record<Category, string | null>>({
    kids: null,
    adults: null,
  });

  // Check sync from Firebase for this device fingerprint on load
  useEffect(() => {
    if (!isFingerprintReady || !fingerprint) return;
    if (votedDevices?.[fingerprint]) {
      const dbVotes = votedDevices[fingerprint];
      setLocalVoted((prev) => ({
        kids: dbVotes?.kids ? prev.kids ?? 'unknown' : prev.kids,
        adults: dbVotes?.adults ? prev.adults ?? 'unknown' : prev.adults,
      }));
    }
  }, [votedDevices, fingerprint, isFingerprintReady]);

  const handleVote = async (participantId: string) => {
    if (localVoted[activeCategory]) return;
    if (!isOnline) return;
    if (!isFingerprintReady) return;

    setError(null);

    const doVote = async () => {
      setIsLoading(true);
      try {
        await actions.castVote(participantId, activeCategory, fingerprint);
        setLocalVoted((prev) => ({ ...prev, [activeCategory]: participantId }));
      } catch (err) {
        console.error('Error casting vote:', err);
        setError('Error al enviar tu voto. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    // Use the rate limiter for the active category
    const limiter = activeCategory === 'kids' ? kidsLimiter : adultsLimiter;
    await limiter.execute(doVote);
  };

  const filteredParticipants = Object.values(participants).filter(
    (p) => p.category === activeCategory,
  );

  const isVoteDisabled = !isOnline || isLoading || !isFingerprintReady || rateLimiter.isLimited;

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl text-fairytale-gold drop-shadow-lg font-luckiest uppercase tracking-wider">
            🗳️ ¡Vota por tu Favorito! 🗳️
          </h2>
          <p className="text-xl text-onion-cream opacity-80 font-bold max-w-lg mx-auto leading-relaxed">
            Puedes votar por un <span className="text-shrek-green">Niño</span> y un{' '}
            <span className="text-shrek-green">Adulto</span>. ¡Elige bien!
          </p>
        </div>

        {/* Offline message */}
        {!isOnline && (
          <div className="text-center bg-red-900/40 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-300 font-bold">
              📡 Sin conexión — No puedes votar en este momento
            </p>
          </div>
        )}

        {/* Error message with retry */}
        {error && (
          <div className="text-center bg-red-900/40 border border-red-500/30 rounded-2xl p-4 flex flex-col items-center gap-2">
            <p className="text-red-300 font-bold">⚠️ {error}</p>
            <button
              onClick={() => setError(null)}
              className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
            >
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 bg-bg-dark/40 p-2 rounded-[2.5rem] backdrop-blur-md border border-white/10 ring-2 ring-white/5 sticky top-4 z-40">
          <button
            onClick={() => setActiveCategory('kids')}
            className={`flex-1 py-4 px-8 rounded-[2rem] text-xl font-luckiest transition-all ${
              activeCategory === 'kids'
                ? 'bg-shrek-green text-white shadow-xl shadow-shrek-green/20 scale-105'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            👦 NIÑOS {localVoted.kids && '✅'}
          </button>
          <button
            onClick={() => setActiveCategory('adults')}
            className={`flex-1 py-4 px-8 rounded-[2rem] text-xl font-luckiest transition-all ${
              activeCategory === 'adults'
                ? 'bg-shrek-green text-white shadow-xl shadow-shrek-green/20 scale-105'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            🧔 ADULTOS {localVoted.adults && '✅'}
          </button>
        </div>

        {/* Loading spinner overlay */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="w-10 h-10 border-4 border-shrek-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Voting Grid */}
        {filteredParticipants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {filteredParticipants.map((p) => (
              <VoteCard
                key={p.id}
                participant={p}
                hasVotedInCategory={!!localVoted[activeCategory]}
                isVotedByMe={localVoted[activeCategory] === p.id}
                onVote={handleVote}
                disabled={isVoteDisabled}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
            <span className="text-6xl text-white/20">🍃</span>
            <p className="text-white/50 mt-4 text-xl">
              Nadie registrado en esta categoría aún...
            </p>
          </div>
        )}
      </div>

      {localVoted.kids && localVoted.adults && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-fairytale-gold text-bg-dark px-10 py-5 rounded-[2.5rem] font-luckiest text-2xl shadow-2xl animate-bounce shadow-fairytale-gold/30 z-50 ring-4 ring-white/20">
          🎉 ¡Gracias por votar! 🎉
        </div>
      )}
    </div>
  );
}
