import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useUserBalances } from './useUserBalances';

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
  const { getBalance } = useUserBalances();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: OrderData) => {
    if (!user) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      // Validate balance for buy orders
      if (orderData.side === 'buy') {
        const balance = getBalance('BRL');
        const requiredAmount = orderData.total || (orderData.price! * orderData.amount);
        
        if (balance.available_balance < requiredAmount) {
          setError('Saldo insuficiente');
          return { success: false, error: 'Saldo insuficiente' };
        }
      }

      // Create order in database
      const { data, error: dbError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          ...orderData,
          remaining_amount: orderData.amount,
          total: orderData.total || (orderData.price! * orderData.amount),
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // In a real app, this would trigger order matching logic
      // For now, we'll just return success
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar ordem';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getOrderBook = async (marketPairId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          side,
          price,
          amount,
          remaining_amount,
          total,
          created_at
        `)
        .eq('market_pair_id', marketPairId)
        .eq('status', 'open')
        .order('price', { ascending: false });

      if (error) throw error;

      // Separate buy and sell orders
      const buyOrders = data?.filter(order => order.side === 'buy') || [];
      const sellOrders = data?.filter(order => order.side === 'sell') || [];

      return {
        buyOrders: buyOrders.slice(0, 10), // Top 10 buy orders
        sellOrders: sellOrders.slice(0, 10), // Top 10 sell orders
      };
    } catch (err) {
      console.error('Error fetching order book:', err);
      return { buyOrders: [], sellOrders: [] };
    }
  };

  const getRecentTrades = async (marketPairId: string) => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select(`
          id,
          price,
          amount,
          side,
          executed_at
        `)
        .eq('market_pair_id', marketPairId)
        .order('executed_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching recent trades:', err);
      return [];
    }
  };

  const getUserOrders = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          market_pair_id,
          order_type,
          side,
          price,
          amount,
          filled_amount,
          remaining_amount,
          total,
          status,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching user orders:', err);
      return [];
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar ordem';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
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
