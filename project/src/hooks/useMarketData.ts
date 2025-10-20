import { useState, useEffect } from 'react';
import { mockMarketPairs } from '../data/mockData';

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
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setMarketPairs(mockMarketPairs);
    setLoading(false);
  }, []);

  const getTopGainers = () =>
    [...marketPairs].filter(p => p.price_change_24h > 0).sort((a, b) => b.price_change_24h - a.price_change_24h).slice(0, 5);

  const getTopLosers = () =>
    [...marketPairs].filter(p => p.price_change_24h < 0).sort((a, b) => a.price_change_24h - b.price_change_24h).slice(0, 5);

  const getTopVolume = () =>
    [...marketPairs].sort((a, b) => b.volume_24h - a.volume_24h).slice(0, 5);

  const getMarketPairBySymbol = (symbol: string) =>
    marketPairs.find(p => p.symbol === symbol);

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