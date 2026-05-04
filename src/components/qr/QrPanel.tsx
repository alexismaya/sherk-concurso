import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// This URL would be the Firebase Hosting URL.
// The user will need to update this after the first deploy if needed, 
// but we set a default as per instructions.
const PARTICIPANT_URL = window.location.origin;

export default function QrPanel() {
  return (
    <div className="card flex flex-col items-center gap-4 max-w-sm mx-auto my-8 border-4 border-shrek-green/30">
      <h3 className="text-2xl text-swamp-brown">📱 ¡Súmate al baile!</h3>
      <div className="bg-white p-4 rounded-2xl shadow-inner shadow-black/10">
        <QRCodeSVG
          value={PARTICIPANT_URL}
          size={200}
          bgColor="#F5EDD0" // onion-cream
          fgColor="#1C2910" // bg-dark
          level="M"
          includeMargin={false}
        />
      </div>
      <p className="qr-url font-bold text-shrek-green-dark break-all text-center">
        {PARTICIPANT_URL}
      </p>
      <p className="qr-hint text-sm italic text-swamp-brown">
        Escanea para registrarte 🌿
      </p>
    </div>
  );
}
