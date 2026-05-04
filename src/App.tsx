import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContestProvider } from './context/ContestContext';
import { ConnectionProvider } from './context/ConnectionContext';
import ErrorBoundary from './components/ErrorBoundary';
import ParticipantView from './views/ParticipantView';
import AdminView from './views/AdminView';
import SwampBackground from './components/background/SwampBackground';

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="¡El pantano se derrumbó!">
      <ContestProvider>
        <ConnectionProvider>
          <SwampBackground />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ParticipantView />} />
              <Route path="/admin" element={<AdminView />} />
            </Routes>
          </BrowserRouter>
        </ConnectionProvider>
      </ContestProvider>
    </ErrorBoundary>
  );
}
