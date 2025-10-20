import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface SessionLike {
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  session: SessionLike | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; phone?: string }) => Promise<{ error: { message: string } | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const USER_STORAGE_KEY = 't3_local_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<SessionLike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as AuthUser;
      setUser(saved);
      setSession({ user: saved });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password || password.length < 6) {
      return { error: { message: 'Credenciais inválidas (senha mínima de 6 caracteres).' } };
    }
    const existing = (localStorage.getItem(USER_STORAGE_KEY));
    const nextUser: AuthUser = existing ? JSON.parse(existing) : {
      id: `local-${Date.now()}`,
      email,
      user_metadata: { full_name: email.split('@')[0] }
    };
    // Atualiza email se mudou
    nextUser.email = email;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setSession({ user: nextUser });
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email || !password || password.length < 6) {
      return { error: { message: 'Preencha email e senha válida (mínimo 6 caracteres).' } };
    }
    const newUser: AuthUser = {
      id: `local-${Date.now()}`,
      email,
      user_metadata: { full_name: fullName }
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setSession({ user: newUser });
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateProfile = async (updates: { full_name?: string; phone?: string }) => {
    if (!user) return { error: { message: 'Nenhum usuário logado' } };
    const updated: AuthUser = {
      ...user,
      user_metadata: {
        ...(user.user_metadata || {}),
        full_name: updates.full_name ?? user.user_metadata?.full_name
      }
    };
    setUser(updated);
    setSession({ user: updated });
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return { error: null };
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};