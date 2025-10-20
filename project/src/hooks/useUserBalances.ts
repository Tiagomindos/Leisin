import { useState, useEffect } from 'react';
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

const balancesKey = (id: string) => `t3_balances_${id}`;

const defaultBalances = (userId: string): UserBalance[] => {
  const now = new Date().toISOString();
  return [
    { id: `bal-${userId}-brl`, user_id: userId, currency: 'BRL', available_balance: 50000, locked_balance: 0, total_balance: 50000, updated_at: now },
    { id: `bal-${userId}-usdt`, user_id: userId, currency: 'USDT', available_balance: 1000, locked_balance: 0, total_balance: 1000, updated_at: now },
    { id: `bal-${userId}-btc`, user_id: userId, currency: 'BTC', available_balance: 0.1, locked_balance: 0, total_balance: 0.1, updated_at: now },
  ];
};

export const useUserBalances = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<UserBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBalances([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const key = balancesKey(user.id);
    const raw = localStorage.getItem(key);
    if (raw) {
      setBalances(JSON.parse(raw) as UserBalance[]);
      setLoading(false);
      return;
    }
    const initial = defaultBalances(user.id);
    localStorage.setItem(key, JSON.stringify(initial));
    setBalances(initial);
    setLoading(false);
  }, [user]);

  const getBalance = (currency: string) => {
    return balances.find(b => b.currency === currency) || {
      id: '',
      user_id: user?.id || '',
      currency,
      available_balance: 0,
      locked_balance: 0,
      total_balance: 0,
      updated_at: new Date().toISOString(),
    };
  };

  const getTotalBalanceInBRL = () => {
    const brl = getBalance('BRL').total_balance;
    const usdt = getBalance('USDT').total_balance;
    const btc = getBalance('BTC').total_balance;
    return brl + usdt * 5.2 + btc * 285000; // rates mock
  };

  return {
    balances,
    loading,
    error,
    getBalance,
    getTotalBalanceInBRL,
  };
};