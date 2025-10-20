import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface OrderData {
  market_pair_id: string;
  order_type: 'limit' | 'market' | 'stop_limit';
  side: 'buy' | 'sell';
  price?: number;
  amount: number;
  total?: number;
}

export const useTrading = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: OrderData) => {
    if (!user) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }
    setLoading(true);
    setError(null);
    const fake = {
      id: `order-${Date.now()}`,
      ...orderData,
      remaining_amount: orderData.amount,
      total: orderData.total || (orderData.price! * orderData.amount),
      status: 'open',
      created_at: new Date().toISOString(),
    };
    setLoading(false);
    return { success: true, data: fake };
  };

  const getOrderBook = async (_marketPairId: string) => {
    return { buyOrders: [], sellOrders: [] };
  };

  const getRecentTrades = async (_marketPairId: string) => {
    return [];
  };

  const getUserOrders = async () => {
    return [];
  };

  const cancelOrder = async (_orderId: string) => {
    return { success: true };
  };

  return {
    loading,
    error,
    createOrder,
    getOrderBook,
    getRecentTrades,
    getUserOrders,
    cancelOrder,
  };
};