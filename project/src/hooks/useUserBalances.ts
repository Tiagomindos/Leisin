import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserBalance {
  id: string;
  user_id: string;
  currency: string;
  available_balance: number;
  locked_balance: number;
  total_balance: number;
  updated_at: string;
}

export const useUserBalances = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<UserBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBalances([]);
      setLoading(false);
      return;
    }

    const fetchBalances = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', user.id)
          .order('currency');

        if (error) {
          throw error;
        }

        setBalances(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar saldos');
        console.error('Error fetching balances:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [user]);

  const getBalance = (currency: string) => {
    return balances.find(b => b.currency === currency) || {
      available_balance: 0,
      locked_balance: 0,
      total_balance: 0,
    };
  };

  const getTotalBalanceInBRL = () => {
    // This would need real-time conversion rates in production
    const brlBalance = getBalance('BRL');
    const usdtBalance = getBalance('USDT');
    
    // Mock conversion rate
    const usdtToBrl = 5.2;
    
    return brlBalance.total_balance + (usdtBalance.total_balance * usdtToBrl);
  };

  return {
    balances,
    loading,
    error,
    getBalance,
    getTotalBalanceInBRL,
  };
};
