import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  cpf_cnpj: string | null;
  user_type: 'investor' | 'developer' | 'admin';
  kyc_status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  risk_score: number;
  reputation_score: number;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const profileKey = (id: string) => `t3_profile_${id}`;

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const load = () => {
      setLoading(true);
      const key = profileKey(user.id);
      const raw = localStorage.getItem(key);
      if (raw) {
        const p = JSON.parse(raw) as UserProfile;
        setProfile(p);
        setLoading(false);
        return;
      }
      const now = new Date().toISOString();
      const defaultProfile: UserProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        phone: null,
        cpf_cnpj: null,
        user_type: 'investor',
        kyc_status: 'pending',
        risk_score: 0,
        reputation_score: 0,
        avatar_url: null,
        bio: null,
        created_at: now,
        updated_at: now,
      };
      localStorage.setItem(key, JSON.stringify(defaultProfile));
      setProfile(defaultProfile);
      setLoading(false);
    };

    load();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { error: new Error('No user or profile') };
    const next = { ...profile, ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(profileKey(user.id), JSON.stringify(next));
    setProfile(next);
    return { error: null };
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};