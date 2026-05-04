import React from 'react';
import { useContest } from '../context/ContestContext';
import { useConnection } from '../context/ConnectionContext';
import ErrorBoundary from '../components/ErrorBoundary';
import RegistrationPage from '../components/registration/RegistrationPage';
import VotingPage from '../components/voting/VotingPage';
import ResultsPage from '../components/results/ResultsPage';
import Header from '../components/layout/Header';

export default function ParticipantView() {
  const { phase } = useContest();
  const { isOnline } = useConnection();

  switch (phase) {
    case 'registration':
      return (
        <ErrorBoundary fallbackTitle="¡Error en el registro del pantano!">
          <RegistrationPage isOnline={isOnline} />
        </ErrorBoundary>
      );
    case 'parade':
      return (
        <ErrorBoundary fallbackTitle="¡El desfile del pantano se tropezó!">
          <WaitingScreen />
        </ErrorBoundary>
      );
    case 'voting':
      return (
        <ErrorBoundary fallbackTitle="¡Las urnas del pantano fallaron!">
          <VotingPage isOnline={isOnline} />
        </ErrorBoundary>
      );
    case 'results':
      return (
        <ErrorBoundary fallbackTitle="¡Los resultados se perdieron en el pantano!">
          <ResultsPage />
        </ErrorBoundary>
      );
    default:
      return (
        <ErrorBoundary fallbackTitle="¡Error en el registro del pantano!">
          <RegistrationPage isOnline={isOnline} />
        </ErrorBoundary>
      );
  }
}

function WaitingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-12 animate-fade-in overflow-hidden">
      <Header />
      <div className="flex flex-col items-center gap-6 p-12 rounded-[4rem] bg-onion-cream/10 border-4 border-shrek-green/20 backdrop-blur-xl shadow-2xl relative">
        <div className="absolute -top-10 -left-10 text-8xl animate-bounce-slow">🌿</div>
        <div className="absolute -bottom-10 -right-10 text-8xl animate-bounce-slow delay-700">🧅</div>
        
        <span className="text-[10rem] animate-pulse drop-shadow-[0_0_30px_rgba(90,138,0,0.4)]">🌿</span>
        <div className="space-y-4">
          <h2 className="text-5xl text-fairytale-gold font-luckiest uppercase tracking-widest drop-shadow-lg">
            ¡EL DESFILE ESTÁ EN CURSO! 🎬
          </h2>
          <p className="text-2xl text-onion-cream font-bold opacity-80 leading-relaxed">
            Disfruta la pasarela en la pantalla grande. <br />
            Te avisaremos cuando se abran las urnas...
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-3 h-3 bg-shrek-green rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-shrek-green rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-shrek-green rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
