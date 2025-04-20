import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, useContext, useState } from 'react';

type GlobalSessionContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

const GlobalSessionContext = createContext<GlobalSessionContextType | undefined>(undefined);

export const GlobalSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  return (
    <GlobalSessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </GlobalSessionContext.Provider>
  );
};

export const useGlobalSession = () => {
  const context = useContext(GlobalSessionContext);
  if (!context) {
    throw new Error('useGlobalSession must be used within a GlobalSessionProvider');
  }
  return context;
};
