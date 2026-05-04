import React from 'react';
import Header from '../layout/Header';
import ParticipantForm from './ParticipantForm';

interface RegistrationPageProps {
  isOnline?: boolean;
}

export default function RegistrationPage({ isOnline }: RegistrationPageProps) {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-bg-dark/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-inner shadow-white/5">
          <h2 className="text-3xl font-luckiest text-center text-fairytale-gold mb-8 drop-shadow-lg">
            🧅 ¡Regístrate para el Concurso! 🧅
          </h2>
          <ParticipantForm isOnline={isOnline} />
        </div>
      </div>
    </div>
  );
}
