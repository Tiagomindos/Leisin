import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MarketPair {
  id: string;
  symbol: string;
  base_asset: string;
  quote_asset: string;
  asset_type: 'property' | 'crypto' | 'hybrid' | 'fund';
  property_id: string | null;
  current_price: number;
  price_change_24h: number;
  volume_24h: number;
  high_24h: number | null;
  low_24h: number | null;
  liquidity_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMarketData = () => {
  const [marketPairs, setMarketPairs] = useState<MarketPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('market_pairs')
          .select('*')
          .eq('is_active', true)
          .order('volume_24h', { ascending: false });

        if (error) {
          throw error;
        }

        setMarketPairs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados de mercado');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const getTopGainers = () => {
    return marketPairs
      .filter(pair => pair.price_change_24h > 0)
      .sort((a, b) => b.price_change_24h - a.price_change_24h)
      .slice(0, 5);
  };

  const getTopLosers = () => {
    return marketPairs
      .filter(pair => pair.price_change_24h < 0)
      .sort((a, b) => a.price_change_24h - b.price_change_24h)
      .slice(0, 5);
  };

  const getTopVolume = () => {
    return marketPairs
      .sort((a, b) => b.volume_24h - a.volume_24h)
      .slice(0, 5);
  };

  const getMarketPairBySymbol = (symbol: string) => {
    return marketPairs.find(pair => pair.symbol === symbol);
  };

  return {
    marketPairs,
    loading,
    error,
    getTopGainers,
    getTopLosers,
    getTopVolume,
    getMarketPairBySymbol,
  };
};
