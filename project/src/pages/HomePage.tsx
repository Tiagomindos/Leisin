import { ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, Building2, TrendingUp, DollarSign, Plus, Loader2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const { state, getPropertyById, updateUserBalance } = useApp();
  const [showBalance, setShowBalance] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  const totalBalance = Object.entries(state.userBalances).reduce((total, [currency, amount]) => {
    if (currency === 'BRL') return total + amount;
    if (currency === 'USDT') return total + (amount * 5.2); // Mock conversion rate
    if (currency === 'BTC') return total + (amount * 285000); // Mock BTC price
    return total;
  }, 0);

  const featuredProperties = state.properties.slice(0, 3);
  const userPortfolio = state.userPortfolio;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="binance-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-400">Saldo Total Estimado</p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              {showBalance ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalBalance)}</h2>
                  <span className="text-xs sm:text-sm text-gray-400">≈ ${(totalBalance / 5.2).toFixed(2)}</span>
                </>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold">••••••</h2>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 price-up" />
              <span className="price-up text-sm font-medium">+12,34% (24h)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowAddFunds(true)}
            className="binance-btn-primary px-4 py-2 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center justify-center py-3 rounded hover:bg-[#2B3139] transition-colors">
            <ArrowDownLeft className="w-5 h-5 text-[#02C076] mb-1" />
            <span className="text-xs">Depósito</span>
          </button>
          <button className="flex flex-col items-center justify-center py-3 rounded hover:bg-[#2B3139] transition-colors">
            <ArrowUpRight className="w-5 h-5 text-[#F6465D] mb-1" />
            <span className="text-xs">Pix</span>
          </button>
          <button className="flex flex-col items-center justify-center py-3 rounded hover:bg-[#2B3139] transition-colors">
            <CreditCard className="w-5 h-5 text-[#FCD535] mb-1" />
            <span className="text-xs">Cartão</span>
          </button>
          <button className="flex flex-col items-center justify-center py-3 rounded hover:bg-[#2B3139] transition-colors">
            <DollarSign className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-xs">Pagar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="binance-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#FCD535]" />
            <span className="text-xs text-gray-400">Conta</span>
          </div>
          <p className="text-lg font-bold">{formatCurrency(state.userBalances.BRL)}</p>
          <p className="text-xs text-gray-500">Disponível</p>
        </div>

        <div className="binance-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Imóveis</span>
          </div>
          <p className="text-lg font-bold">
            {formatCurrency(
              Object.entries(userPortfolio).reduce((total, [propertyId, amount]) => {
                const property = getPropertyById(propertyId);
                return total + (property ? property.price_per_token * amount : 0);
              }, 0)
            )}
          </p>
          <p className="text-xs price-up">+8.5%</p>
        </div>

        <div className="binance-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#02C076]" />
            <span className="text-xs text-gray-400">Cripto</span>
          </div>
          <p className="text-lg font-bold">
            {formatCurrency(
              (state.userBalances.USDT * 5.2) + (state.userBalances.BTC * 285000)
            )}
          </p>
          <p className="text-xs price-down">-2.1%</p>
        </div>
      </div>

      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Carteira Imobiliária</h3>
          <button className="text-[#FCD535] text-sm">Ver tudo</button>
        </div>

        <div className="space-y-3">
          {Object.entries(userPortfolio).map(([propertyId, tokens]) => {
            const property = getPropertyById(propertyId);
            if (!property) return null;
            
            const marketPair = state.marketPairs.find(p => p.property_id === propertyId);
            const currentValue = property.price_per_token * tokens;
            const change = marketPair?.price_change_24h || 0;
            
            return (
              <button 
                key={propertyId} 
                className="w-full flex items-center gap-3 p-3 rounded hover:bg-[#2B3139] transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{property.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{tokens} cotas</span>
                    <span>•</span>
                    <span className="text-[#02C076]">Yield {property.expected_yield}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(currentValue)}</p>
                  <p className={`text-xs ${change > 0 ? 'price-up' : 'price-down'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Criptomoedas</h3>
          <button className="text-[#FCD535] text-sm">Ver tudo</button>
        </div>

        <div className="space-y-3">
          {[
            { 
              name: 'Bitcoin', 
              symbol: 'BTC', 
              icon: '₿', 
              amount: state.userBalances.BTC,
              marketPair: state.marketPairs.find(p => p.symbol === 'BTC-BRL')
            },
            { 
              name: 'Ethereum', 
              symbol: 'ETH', 
              icon: 'Ξ', 
              amount: 0, // User doesn't have ETH yet
              marketPair: state.marketPairs.find(p => p.symbol === 'ETH-BRL')
            },
            { 
              name: 'USDT', 
              symbol: 'USDT', 
              icon: '₮', 
              amount: state.userBalances.USDT,
              marketPair: null // USDT doesn't have a market pair in our mock data
            },
          ].map((crypto) => {
            const currentPrice = crypto.marketPair?.current_price || (crypto.symbol === 'USDT' ? 5.2 : 0);
            const change = crypto.marketPair?.price_change_24h || 0;
            const value = currentPrice * crypto.amount;
            
            return (
              <button 
                key={crypto.symbol} 
                className="w-full flex items-center gap-3 p-3 rounded hover:bg-[#2B3139] transition-colors"
              >
                <div className="w-10 h-10 bg-[#2B3139] rounded-full flex items-center justify-center text-lg font-bold">
                  {crypto.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{crypto.name}</p>
                  <p className="text-xs text-gray-400">{crypto.amount} {crypto.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(value)}</p>
                  <p className={`text-xs ${change > 0 ? 'price-up' : change < 0 ? 'price-down' : 'text-gray-400'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Proventos do Mês</h3>
          <span className="text-[#02C076] font-semibold">+R$ 1.234,50</span>
        </div>

        <div className="h-32 flex items-end gap-1">
          {[45, 62, 38, 75, 52, 88, 65, 92, 78, 85, 70, 95].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-[#02C076] to-transparent rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="binance-card p-4 bg-gradient-to-r from-[#FCD535]/10 to-transparent border-[#FCD535]/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Academia T3</h3>
            <p className="text-sm text-gray-400">Aprenda sobre investimentos imobiliários e cripto</p>
          </div>
          <button className="binance-btn-primary px-4 py-2 text-sm">
            Começar
          </button>
        </div>
      </div>

      {/* Modal de Adicionar Fundos */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="binance-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Adicionar Fundos</h3>
              <button
                onClick={() => setShowAddFunds(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Valor (BRL)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="binance-input w-full"
                  placeholder="0,00"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAddAmount(amount.toString())}
                    className="p-2 bg-[#2B3139] hover:bg-[#FCD535]/20 hover:text-[#FCD535] rounded text-sm transition-colors"
                  >
                    R$ {amount.toLocaleString()}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddFunds(false)}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const amount = parseFloat(addAmount);
                    if (amount > 0) {
                      updateUserBalance('BRL', state.userBalances.BRL + amount);
                      setAddAmount('');
                      setShowAddFunds(false);
                    }
                  }}
                  className="flex-1 binance-btn-primary py-2"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
