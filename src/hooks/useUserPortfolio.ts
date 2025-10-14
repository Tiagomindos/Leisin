import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface PortfolioItem {
  id: string;
  user_id: string;
  property_id: string;
  token_symbol: string;
  quantity: number;
  average_price: number;
  updated_at: string;
}

export const useUserPortfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPortfolio([]);
      setLoading(false);
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('user_portfolio')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setPortfolio(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar portfólio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  const portfolioMap = portfolio.reduce((acc, item) => {
    acc[item.property_id] = item.quantity;
    return acc;
  }, {} as { [propertyId: string]: number });

  return { portfolio, portfolioMap, loading, error };
};