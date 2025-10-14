import { TrendingUp, TrendingDown, ChevronDown, Info, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';

export default function TradePage() {
  const { user } = useAuth();
  const { state, getMarketPairBySymbol, getOrderBook, getRecentTrades, createOrder } = useApp();
  const [selectedPair, setSelectedPair] = useState('RESID-BRL');
  const [orderType, setOrderType] = useState(0);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderFormData, setOrderFormData] = useState({ price: '', amount: '', total: '' });
  const [orderBook, setOrderBook] = useState({ buyOrders: [], sellOrders: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const orderTypes = ['Limite', 'Mercado', 'Stop-Limit'];
  const currentPair = getMarketPairBySymbol(selectedPair);
  const brlBalance = state.userBalances.find(b => b.currency === 'BRL')?.available_balance || 0;

  const loadData = useCallback(async () => {
    if (currentPair) {
      setLoading(true);
      const book = await getOrderBook(currentPair.id);
      const trades = await getRecentTrades(currentPair.id);
      setOrderBook(book);
      setRecentTrades(trades);
      setLoading(false);
    }
  }, [currentPair, getOrderBook, getRecentTrades]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPair || !user) return;

    setLoading(true);

    const price = parseFloat(orderFormData.price);
    const amount = parseFloat(orderFormData.amount);
    const total = parseFloat(orderFormData.total);

    await createOrder({
      market_pair_id: currentPair.id,
      order_type: 'limit', // Simplified for now
      side: orderSide,
      price: price,
      amount: amount,
      total: total,
    });
    
    setOrderFormData({ price: '', amount: '', total: '' });
    await loadData();
    setLoading(false);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">RS</span>
            </div>
            <div className="text-left">
              <p className="font-semibold">{currentPair?.symbol || '...'}</p>
              <p className="text-xs text-gray-400">Residencial Sunset</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Preço Atual</p>
            <p className="text-2xl font-bold">{currentPair ? formatCurrency(currentPair.current_price) : '...'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">24h Variação</p>
            {currentPair && <p className={`text-xl font-bold ${currentPair.price_change_24h > 0 ? 'price-up' : 'price-down'}`}>{formatPercentage(currentPair.price_change_24h)}</p>}
          </div>
        </div>
      </div>

      <div className="binance-card">
        <div className="border-b border-gray-800"><div className="flex gap-1 p-2">
          <button onClick={() => setOrderSide('buy')} className={`flex-1 py-2 rounded font-semibold transition-colors ${orderSide === 'buy' ? 'bg-[#02C076] text-white' : 'bg-[#2B3139] text-gray-400 hover:text-white'}`}>COMPRAR</button>
          <button onClick={() => setOrderSide('sell')} className={`flex-1 py-2 rounded font-semibold transition-colors ${orderSide === 'sell' ? 'bg-[#F6465D] text-white' : 'bg-[#2B3139] text-gray-400 hover:text-white'}`}>VENDER</button>
        </div></div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2 border-b border-gray-800">{orderTypes.map((type, i) => (<button key={type} onClick={() => setOrderType(i)} className={`pb-2 px-3 text-sm font-medium transition-colors ${orderType === i ? 'tab-active' : 'text-gray-400'}`}>{type}</button>))}</div>
          <form onSubmit={handleOrderSubmit} className="space-y-3">
            <div className="flex items-center justify-between text-sm"><label className="text-gray-400">Disponível</label><span className="font-medium">{formatCurrency(brlBalance)}</span></div>
            {orderType === 0 && <div><label className="text-sm text-gray-400 mb-2 block">Preço</label><div className="flex items-center gap-2"><input type="number" step="0.01" value={orderFormData.price} onChange={(e) => setOrderFormData({ ...orderFormData, price: e.target.value })} className="binance-input flex-1" placeholder="0,00" required /><span className="text-sm text-gray-400">BRL</span></div></div>}
            <div><label className="text-sm text-gray-400 mb-2 block">Quantidade</label><div className="flex items-center gap-2"><input type="number" step="1" value={orderFormData.amount} onChange={(e) => setOrderFormData({ ...orderFormData, amount: e.target.value })} className="binance-input flex-1" placeholder="0" required /><span className="text-sm text-gray-400">Cotas</span></div></div>
            {orderType === 0 && <div><label className="text-sm text-gray-400 mb-2 block">Total</label><input type="number" step="0.01" value={orderFormData.total} onChange={(e) => setOrderFormData({ ...orderFormData, total: e.target.value })} className="binance-input w-full" placeholder="0,00" required /></div>}
            <button type="submit" disabled={loading} className={`w-full py-3 font-semibold rounded transition-colors disabled:opacity-50 ${orderSide === 'buy' ? 'binance-btn-success' : 'binance-btn-danger'}`}>{loading ? 'Processando...' : `${orderSide === 'buy' ? 'Comprar' : 'Vender'} ${selectedPair}`}</button>
          </form>
        </div>
      </div>

      <div className="binance-card">
        <div className="p-4 border-b border-gray-800"><h3 className="font-semibold">Livro de Ofertas</h3></div>
        <div className="divide-y divide-gray-800">
          <div className="p-4"><div className="flex items-center justify-between text-xs text-gray-400 mb-2"><span>Preço (BRL)</span><span>Quantidade</span></div><div className="space-y-1">{orderBook.sellOrders.slice(0,5).map((order) => (<div key={order.id} className="w-full flex items-center justify-between text-sm py-0.5 relative"><div className="absolute inset-y-0 right-0 bg-[#F6465D]/10" style={{width: `${(order.remaining_amount / 500) * 100}%`}}/><span className="text-[#F6465D] z-10">{formatCurrency(order.price)}</span><span className="z-10">{order.remaining_amount}</span></div>))}</div></div>
          <div className="p-4"><div className="flex items-center justify-center gap-2 py-2 mb-2"><span className="text-xl font-bold">{currentPair ? formatCurrency(currentPair.current_price) : 'N/A'}</span>{currentPair && (currentPair.price_change_24h > 0 ? <TrendingUp className="w-5 h-5 price-up" /> : <TrendingDown className="w-5 h-5 price-down" />)}</div><div className="space-y-1">{orderBook.buyOrders.slice(0,5).map((order) => (<div key={order.id} className="w-full flex items-center justify-between text-sm py-0.5 relative"><div className="absolute inset-y-0 right-0 bg-[#02C076]/10" style={{width: `${(order.remaining_amount / 500) * 100}%`}}/><span className="text-[#02C076] z-10">{formatCurrency(order.price)}</span><span className="z-10">{order.remaining_amount}</span></div>))}</div></div>
        </div>
      </div>

      <div className="binance-card">
        <div className="p-4 border-b border-gray-800"><h3 className="font-semibold">Negociações Recentes</h3></div>
        <div className="divide-y divide-gray-800">{recentTrades.slice(0,10).map((trade) => (<div key={trade.id} className="flex items-center justify-between p-3 text-sm"><span className={trade.side === 'buy' ? 'price-up' : 'price-down'}>{formatCurrency(trade.price)}</span><span>{trade.amount}</span><span className="text-gray-400">{new Date(trade.executed_at).toLocaleTimeString('pt-BR')}</span></div>))}</div>
      </div>
    </div>
  );
}