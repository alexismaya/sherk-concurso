import React from 'react';
import { useContest } from '../context/ContestContext';
import { useConnection } from '../context/ConnectionContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/layout/Header';
import QrPanel from '../components/qr/QrPanel';
import AdminControls from '../components/admin/AdminControls';
import RegistrationPage from '../components/registration/RegistrationPage';
import ParadePage from '../components/parade/ParadePage';
import VotingPage from '../components/voting/VotingPage';
import ResultsPage from '../components/results/ResultsPage';

export default function AdminView() {
  const { phase, participants } = useContest();
  const { isOnline } = useConnection();

  return (
    <div className="min-h-screen pb-40">
      {/* Admin specific header indicator */}
      <div className="bg-shrek-green/20 text-center py-2 border-b border-shrek-green/30 backdrop-blur-md">
        <span className="text-sm font-bold tracking-[0.3em] text-shrek-green-dark drop-shadow-sm uppercase">
          MODO ADMINISTRADOR (PROYECTOR) 🧅
        </span>
      </div>

      {phase === 'registration' && (
        <ErrorBoundary fallbackTitle="¡Error en el registro del pantano!">
          <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 items-center justify-center animate-fade-in">
            <div className="flex-1 max-w-xl">
               <QrPanel />
            </div>
            <div className="flex-1 bg-onion-cream/5 p-8 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-sm max-w-xl">
              <h3 className="text-3xl text-fairytale-gold font-luckiest mb-6 drop-shadow-lg uppercase italic">
                 OGROS EN ESPERA 🌿
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                 {Object.values(participants).map((p) => (
                   <div key={p.id} className="relative group animate-slide-up">
                      <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-shrek-green text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-bg-dark">
                        🧅
                      </div>
                   </div>
                 ))}
                 {Object.keys(participants).length === 0 && (
                   <div className="col-span-full py-10 text-center text-white/20 italic">
                      Esperando invitados... 🍂
                   </div>
                 )}
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )}

      {phase === 'parade' && (
        <ErrorBoundary fallbackTitle="¡El desfile del pantano se tropezó!">
          <ParadePage />
        </ErrorBoundary>
      )}

      {phase === 'voting' && (
        <ErrorBoundary fallbackTitle="¡Las urnas del pantano fallaron!">
          <VotingPage isAdmin={true} isOnline={isOnline} />
        </ErrorBoundary>
      )}

      {phase === 'results' && (
        <ErrorBoundary fallbackTitle="¡Los resultados se perdieron en el pantano!">
          <ResultsPage />
        </ErrorBoundary>
      )}

      <AdminControls />
    </div>
  );
}
