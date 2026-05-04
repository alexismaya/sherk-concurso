import React, { useState, useRef } from 'react';
import { useContestActions } from '../../context/ContestContext';
import { Category } from '../../types';
import { compressImage } from '../../utils/compressImage';
import { useRateLimiter } from '../../hooks/useRateLimiter';

interface ParticipantFormProps {
  isOnline?: boolean;
}

export default function ParticipantForm({ isOnline = true }: ParticipantFormProps) {
  const actions = useContestActions();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('adults');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLimited, remainingMs, execute } = useRateLimiter({ cooldownMs: 5000, key: 'registration' });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const compressed = await compressImage(base64);
        setPhoto(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const doSubmit = async () => {
    if (!name || !photo) return;

    setError(null);
    setIsUploading(true);
    try {
      await actions.addParticipant({
        name,
        category,
        photoBase64: photo,
      });
      setIsRegistered(true);
    } catch (err) {
      console.error('Error registering participant:', err);
      setError('Error registrando participante. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !photo) return;
    if (!isOnline) return;

    await execute(doSubmit);
  };

  const isSubmitDisabled = !name || !photo || isUploading || !isOnline || isLimited;

  const getButtonText = () => {
    if (isUploading) return '🌿 Subiendo...';
    if (!isOnline) return '📡 Sin conexión';
    if (isLimited) {
      const secs = Math.ceil(remainingMs / 1000);
      return `Espera... (${secs}s)`;
    }
    return '🚀 ¡Registrar Disfraz!';
  };

  if (isRegistered) {
    return (
      <div className="success-screen p-8 bg-onion-cream rounded-3xl shadow-xl">
        <span className="text-7xl animate-bounce">🧅</span>
        <h2 className="text-3xl text-swamp-brown mt-4">¡Ya estás en el pantano, {name}! 🌿</h2>
        <p className="text-shrek-green-dark font-bold">
          Prepara tu mejor desfile. Te avisaremos cuando sea la hora de votar...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md mx-auto p-4 animate-fade-in">
      {/* Offline message */}
      {!isOnline && (
        <div className="bg-red-900/40 border border-red-500/30 rounded-2xl p-3 text-center">
          <p className="text-red-300 font-bold text-sm">
            📡 Sin conexión — No puedes registrarte en este momento
          </p>
        </div>
      )}

      {/* Error message with retry */}
      {error && (
        <div className="bg-red-900/40 border border-red-500/30 rounded-2xl p-3 flex flex-col items-center gap-2">
          <p className="text-red-300 font-bold text-sm">⚠️ {error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              doSubmit();
            }}
            className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xl font-luckiest text-fairytale-gold drop-shadow-md">¿Cómo te llamas?</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Escribe tu nombre de ogro..."
          className="input-field text-lg"
          required
          disabled={isUploading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-luckiest text-fairytale-gold drop-shadow-md">Categoría</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setCategory('kids')}
            className={`py-3 rounded-xl border-2 font-bold transition-all ${
              category === 'kids'
                ? 'bg-shrek-green border-shrek-green text-white scale-105 shadow-lg'
                : 'bg-white/20 border-white/30 text-white/70 hover:bg-white/30'
            }`}
            disabled={isUploading}
          >
            👦 Niños
          </button>
          <button
            type="button"
            onClick={() => setCategory('adults')}
            className={`py-3 rounded-xl border-2 font-bold transition-all ${
              category === 'adults'
                ? 'bg-shrek-green border-shrek-green text-white scale-105 shadow-lg'
                : 'bg-white/20 border-white/30 text-white/70 hover:bg-white/30'
            }`}
            disabled={isUploading}
          >
            🧔 Adultos
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-luckiest text-fairytale-gold drop-shadow-md">Tu Disfraz</label>
        <div
          className="relative aspect-square w-full rounded-2xl border-4 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-white/10 transition-colors"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {photo ? (
            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/50">
              <span className="text-5xl">📸</span>
              <p>Toca para tomar foto o subir</p>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-shrek-green border-t-transparent rounded-full animate-spin" />
              <p className="text-white mt-4 font-bold animate-pulse">Subiendo...</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="btn-primary flex items-center justify-center gap-3 py-4 text-xl mt-4"
      >
        {getButtonText()}
      </button>
    </form>
  );
}
