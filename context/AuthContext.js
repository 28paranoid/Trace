import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import { MOCK_USER } from '@/constants/mockData';

const AuthContext = createContext({
  user: MOCK_USER,
  session: { access_token: 'demo-token' },
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);
  const [session, setSession] = useState({ access_token: 'demo-token' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to get Supabase session if configured, but default to demo user
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (activeSession) {
        setSession(activeSession);
        setUser(activeSession.user ?? MOCK_USER);
      }
    }).catch(() => {
      // Keep demo user
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, activeSession) => {
        if (activeSession) {
          setSession(activeSession);
          setUser(activeSession.user);
        } else {
          setSession({ access_token: 'demo-token' });
          setUser(MOCK_USER);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
