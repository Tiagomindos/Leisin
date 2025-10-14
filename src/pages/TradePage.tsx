import { TrendingUp, TrendingDown, ChevronDown, Info, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function TradePage() {
  const { user } = useAuth();
  const { state, getMarketPairBySymbol, getOrderBook, getRecentTrades, createOrder } = useApp();
  const [selectedPair, setSelectedPair] = useState('RESID-BRL');
  const [orderType, setOrderType] = useState(0);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderData, setOrderData] = useState({
    price: '',
    amount: '',
    total: '',
  });
  const [orderBook, setOrderBook] = useState({ buyOrders: [], sellOrders: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const orderTypes = ['Limite', 'Mercado', 'Stop-Limit'];
  const currentPair = getMarketPairBySymbol(selectedPair);
  const balance = state.userBalances.BRL;

  useEffect(() => {
    if (currentPair) {
      loadOrderBook();
      loadRecentTrades();
    }
  }, [currentPair]);

  const loadOrderBook = () => {
    if (currentPair) {
      const book = getOrderBook(currentPair.id);
      setOrderBook(book);
    }
  };

  const loadRecentTrades = () => {
    if (currentPair) {
      const trades = getRecentTrades(currentPair.id);
      setRecentTrades(trades);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPair || !user) return;

    setLoading(true);

    const orderData = {
      user_id: user.id,
      market_pair_id: currentPair.id,
      order_type: orderTypes[orderType].toLowerCase().replace('-', '_') as 'limit' | 'market' | 'stop_limit',
      side: orderSide,
      price: orderType === 0 ? parseFloat(orderData.price) : undefined,
      amount: parseFloat(orderData.amount),
      total: orderType === 0 ? parseFloat(orderData.total) : undefined,
    };

    createOrder(orderData);
    
    // Reset form
    setOrderData({ price: '', amount: '', total: '' });
    // Reload order book
    setTimeout(() => {
      loadOrderBook();
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">RS</span>
            </div>
            <div className="text-left">
              <p className="font-semibold">RESID/BRL</p>
              <p className="text-xs text-gray-400">Residencial Sunset</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button className="px-3 py-1.5 bg-[#2B3139] rounded text-sm">
            10x
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Preço Atual</p>
            {currentPair ? (
              <p className="text-2xl font-bold">{formatCurrency(currentPair.current_price)}</p>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-2xl font-bold">Carregando...</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">24h Variação</p>
            {currentPair ? (
              <p className={`text-xl font-bold ${currentPair.price_change_24h > 0 ? 'price-up' : 'price-down'}`}>
                {formatPercentage(currentPair.price_change_24h)}
              </p>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xl font-bold">Carregando...</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs">
          <div>
            <p className="text-gray-400 mb-1">24h Alta</p>
            <p className="font-semibold">{currentPair ? formatCurrency(currentPair.high_24h || 0) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">24h Baixa</p>
            <p className="font-semibold">{currentPair ? formatCurrency(currentPair.low_24h || 0) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Volume</p>
            <p className="font-semibold">{currentPair ? formatCurrency(currentPair.volume_24h) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Liquidez</p>
            <p className="text-[#02C076] font-semibold">{currentPair ? `${currentPair.liquidity_score}%` : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="binance-card">
        <div className="border-b border-gray-800">
          <div className="flex gap-1 p-2">
            <button 
              onClick={() => setOrderSide('buy')}
              className={`flex-1 py-2 rounded font-semibold transition-colors ${
                orderSide === 'buy' 
                  ? 'bg-[#02C076] text-white' 
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              COMPRAR
            </button>
            <button 
              onClick={() => setOrderSide('sell')}
              className={`flex-1 py-2 rounded font-semibold transition-colors ${
                orderSide === 'sell' 
                  ? 'bg-[#F6465D] text-white' 
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              VENDER
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2 border-b border-gray-800">
            {orderTypes.map((type, i) => (
              <button
                key={type}
                onClick={() => setOrderType(i)}
                className={`pb-2 px-3 text-sm font-medium transition-colors ${
                  orderType === i ? 'tab-active' : 'text-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleOrderSubmit}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Disponível</label>
                <span className="text-sm font-medium">{formatCurrency(balance.available_balance)}</span>
              </div>
            </div>

            {orderType === 0 && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Preço</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={orderData.price}
                    onChange={(e) => setOrderData({ ...orderData, price: e.target.value })}
                    className="binance-input flex-1"
                    placeholder="0,00"
                    required
                  />
                  <span className="text-sm text-gray-400">BRL</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Quantidade</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={orderData.amount}
                  onChange={(e) => setOrderData({ ...orderData, amount: e.target.value })}
                  className="binance-input flex-1"
                  placeholder="0"
                  required
                />
                <span className="text-sm text-gray-400">Cotas</span>
              </div>
            </div>

            <div className="flex gap-2">
              {['25%', '50%', '75%', '100%'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    const percentage = parseFloat(pct) / 100;
                    const maxAmount = balance.available_balance / (currentPair?.current_price || 1);
                    const amount = (maxAmount * percentage).toFixed(2);
                    setOrderData({ ...orderData, amount });
                  }}
                  className="flex-1 py-1.5 bg-[#2B3139] hover:bg-[#FCD535]/20 hover:text-[#FCD535] rounded text-sm transition-colors"
                >
                  {pct}
                </button>
              ))}
            </div>

            {orderType === 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Total</label>
                  <span className="text-sm font-medium">BRL</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={orderData.total}
                  onChange={(e) => setOrderData({ ...orderData, total: e.target.value })}
                  className="binance-input w-full"
                  placeholder="0,00"
                  required
                />
              </div>
            )}

            <div className="space-y-2 py-3 border-t border-b border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Taxa de transação</span>
                <span className="font-medium">0,1%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Preço estimado</span>
                <span className="font-medium">
                  {currentPair ? formatCurrency(currentPair.current_price) : 'N/A'}
                </span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                orderSide === 'buy' 
                  ? 'binance-btn-success' 
                  : 'binance-btn-danger'
              }`}
            >
              {loading ? 'Processando...' : `${orderSide === 'buy' ? 'Comprar' : 'Vender'} ${selectedPair}`}
            </button>
          </form>

          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-300">
              IA sugere preço médio ideal de R$ 124,80 com base na liquidez atual
            </p>
          </div>
        </div>
      </div>

      <div className="binance-card">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-semibold">Livro de Ofertas</h3>
        </div>

        <div className="divide-y divide-gray-800">
          <div className="p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Preço (BRL)</span>
              <span>Quantidade</span>
              <span>Total</span>
            </div>
            <div className="space-y-1">
              {orderBook.sellOrders.length > 0 ? (
                orderBook.sellOrders.map((order, i) => {
                  const pct = Math.min((order.remaining_amount / 1000) * 100, 100);
                  return (
                    <button
                      key={order.id}
                      className="w-full flex items-center justify-between text-sm py-1 hover:bg-[#F6465D]/10 rounded transition-colors relative"
                    >
                      <div
                        className="absolute inset-y-0 right-0 bg-[#F6465D]/10 rounded"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="text-[#F6465D] z-10">{formatCurrency(order.price)}</span>
                      <span className="z-10">{order.remaining_amount}</span>
                      <span className="text-gray-400 z-10">{formatCurrency(order.total)}</span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Nenhuma ordem de venda
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-center gap-2 py-2 mb-2">
              <span className="text-xl font-bold">
                {currentPair ? formatCurrency(currentPair.current_price) : 'N/A'}
              </span>
              {currentPair && (
                <>
                  {currentPair.price_change_24h > 0 ? (
                    <TrendingUp className="w-5 h-5 price-up" />
                  ) : (
                    <TrendingDown className="w-5 h-5 price-down" />
                  )}
                  <span className={`text-sm ${currentPair.price_change_24h > 0 ? 'price-up' : 'price-down'}`}>
                    ≈ ${(currentPair.current_price / 5.2).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="space-y-1">
              {orderBook.buyOrders.length > 0 ? (
                orderBook.buyOrders.map((order, i) => {
                  const pct = Math.min((order.remaining_amount / 1000) * 100, 100);
                  return (
                    <button
                      key={order.id}
                      className="w-full flex items-center justify-between text-sm py-1 hover:bg-[#02C076]/10 rounded transition-colors relative"
                    >
                      <div
                        className="absolute inset-y-0 right-0 bg-[#02C076]/10 rounded"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="text-[#02C076] z-10">{formatCurrency(order.price)}</span>
                      <span className="z-10">{order.remaining_amount}</span>
                      <span className="text-gray-400 z-10">{formatCurrency(order.total)}</span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Nenhuma ordem de compra
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="binance-card">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-semibold">Negociações Recentes</h3>
        </div>

        <div className="divide-y divide-gray-800">
          {recentTrades.length > 0 ? (
            recentTrades.map((trade, i) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-3 text-sm"
              >
                <span className={trade.side === 'buy' ? 'price-up' : 'price-down'}>
                  {formatCurrency(trade.price)}
                </span>
                <span>{trade.amount}</span>
                <span className="text-gray-400">
                  {new Date(trade.executed_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhuma negociação recente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}