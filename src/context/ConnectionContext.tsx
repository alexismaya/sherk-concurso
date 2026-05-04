import { createContext, useContext, ReactNode } from 'react';
import { useConnectionMonitor } from '../hooks/useConnectionMonitor';
import ConnectionBanner from '../components/ConnectionBanner';

interface ConnectionContextValue {
  isOnline: boolean;
}

const ConnectionContext = createContext<ConnectionContextValue>({ isOnline: true });

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { isOnline } = useConnectionMonitor();

  return (
    <ConnectionContext.Provider value={{ isOnline }}>
      <ConnectionBanner isOnline={isOnline} />
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = () => useContext(ConnectionContext);
