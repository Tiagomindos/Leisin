import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, Settings, Eye, EyeOff, Plus, Minus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function WalletPage() {
  const { user } = useAuth();
  const { state, updateUserBalance } = useApp();
  const [showBalances, setShowBalances] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'BRL':
        return 'R$';
      case 'USDT':
        return '₮';
      case 'BTC':
        return '₿';
      case 'ETH':
        return 'Ξ';
      default:
        return currency;
    }
  };

  const getCurrencyName = (currency: string) => {
    switch (currency) {
      case 'BRL':
        return 'Real Brasileiro';
      case 'USDT':
        return 'Tether USD';
      case 'BTC':
        return 'Bitcoin';
      case 'ETH':
        return 'Ethereum';
      default:
        return currency;
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'BRL':
        return 'text-green-400';
      case 'USDT':
        return 'text-blue-400';
      case 'BTC':
        return 'text-orange-400';
      case 'ETH':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      updateUserBalance(selectedCurrency, state.userBalances[selectedCurrency] + amount);
      setDepositAmount('');
      setShowDeposit(false);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= state.userBalances[selectedCurrency]) {
      updateUserBalance(selectedCurrency, state.userBalances[selectedCurrency] - amount);
      setWithdrawAmount('');
      setShowWithdraw(false);
    }
  };

  const mockTransactions = [
    {
      id: '1',
      type: 'deposit',
      currency: 'BRL',
      amount: 10000,
      status: 'completed',
      date: '2024-10-14T10:30:00Z',
      description: 'Depósito via PIX'
    },
    {
      id: '2',
      type: 'trade',
      currency: 'RESID',
      amount: 100,
      status: 'completed',
      date: '2024-10-14T09:15:00Z',
      description: 'Compra de cotas - Residencial Sunset'
    },
    {
      id: '3',
      type: 'withdraw',
      currency: 'BRL',
      amount: 5000,
      status: 'pending',
      date: '2024-10-13T16:45:00Z',
      description: 'Saque via PIX'
    },
    {
      id: '4',
      type: 'dividend',
      currency: 'BRL',
      amount: 250,
      status: 'completed',
      date: '2024-10-13T08:00:00Z',
      description: 'Dividendos - Shopping Central'
    }
  ];

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      {/* Header */}
      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-[#FCD535]" />
            <h1 className="text-xl font-bold">Carteira Digital</h1>
          </div>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="text-gray-400 hover:text-white"
          >
            {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Total Balance */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-2">Saldo Total</p>
          {showBalances ? (
            <h2 className="text-3xl font-bold">
              {formatCurrency(
                Object.entries(state.userBalances).reduce((total, [currency, amount]) => {
                  if (currency === 'BRL') return total + amount;
                  if (currency === 'USDT') return total + (amount * 5.2);
                  if (currency === 'BTC') return total + (amount * 285000);
                  return total;
                }, 0)
              )}
            </h2>
          ) : (
            <h2 className="text-3xl font-bold">••••••</h2>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowDeposit(true)}
            className="flex items-center justify-center gap-2 py-3 bg-[#02C076] hover:bg-[#019760] text-white rounded font-semibold transition-colors"
          >
            <ArrowDownLeft className="w-5 h-5" />
            <span>Depositar</span>
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex items-center justify-center gap-2 py-3 bg-[#F6465D] hover:bg-[#E53E3E] text-white rounded font-semibold transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
            <span>Sacar</span>
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Saldos por Moeda</h3>
        <div className="space-y-3">
          {Object.entries(state.userBalances).map(([currency, amount]) => (
            <div key={currency} className="flex items-center justify-between p-3 bg-[#2B3139] rounded">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getCurrencyColor(currency)}`}>
                  {getCurrencyIcon(currency)}
                </div>
                <div>
                  <p className="font-medium">{getCurrencyName(currency)}</p>
                  <p className="text-sm text-gray-400">{currency}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {showBalances ? formatCurrency(amount, currency) : '••••••'}
                </p>
                <p className="text-sm text-gray-400">
                  {currency === 'BRL' ? 'Disponível' : 'Em carteira'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-2 p-3 bg-[#2B3139] hover:bg-[#3A4048] rounded transition-colors">
            <CreditCard className="w-5 h-5 text-[#FCD535]" />
            <span className="text-sm">Cartão Virtual</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-[#2B3139] hover:bg-[#3A4048] rounded transition-colors">
            <History className="w-5 h-5 text-blue-400" />
            <span className="text-sm">Histórico</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-[#2B3139] hover:bg-[#3A4048] rounded transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm">Configurações</span>
          </button>
          <button className="flex items-center gap-2 p-3 bg-[#2B3139] hover:bg-[#3A4048] rounded transition-colors">
            <Wallet className="w-5 h-5 text-purple-400" />
            <span className="text-sm">Endereços</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Transações Recentes</h3>
        <div className="space-y-3">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#2B3139] rounded">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                  transaction.type === 'withdraw' ? 'bg-red-500/20 text-red-400' :
                  transaction.type === 'trade' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {transaction.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> :
                   transaction.type === 'withdraw' ? <ArrowUpRight className="w-4 h-4" /> :
                   transaction.type === 'trade' ? <Wallet className="w-4 h-4" /> :
                   <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(transaction.date).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction.type === 'deposit' || transaction.type === 'dividend' ? 'text-green-400' :
                  transaction.type === 'withdraw' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {transaction.type === 'deposit' || transaction.type === 'dividend' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
                <p className={`text-xs ${
                  transaction.status === 'completed' ? 'text-green-400' :
                  transaction.status === 'pending' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {transaction.status === 'completed' ? 'Concluído' :
                   transaction.status === 'pending' ? 'Pendente' :
                   'Falhou'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="binance-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Depositar</h3>
              <button
                onClick={() => setShowDeposit(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Moeda</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="binance-input w-full"
                >
                  <option value="BRL">Real Brasileiro (BRL)</option>
                  <option value="USDT">Tether USD (USDT)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Valor</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="binance-input w-full"
                  placeholder="0,00"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className="p-2 bg-[#2B3139] hover:bg-[#FCD535]/20 hover:text-[#FCD535] rounded text-sm transition-colors"
                  >
                    {amount.toLocaleString()}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeposit(false)}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeposit}
                  className="flex-1 binance-btn-primary py-2"
                >
                  Depositar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="binance-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sacar</h3>
              <button
                onClick={() => setShowWithdraw(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Moeda</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="binance-input w-full"
                >
                  <option value="BRL">Real Brasileiro (BRL)</option>
                  <option value="USDT">Tether USD (USDT)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Valor</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="binance-input w-full"
                  placeholder="0,00"
                  max={state.userBalances[selectedCurrency]}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Disponível: {formatCurrency(state.userBalances[selectedCurrency], selectedCurrency)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setWithdrawAmount((state.userBalances[selectedCurrency] * 0.25).toString())}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  25%
                </button>
                <button
                  onClick={() => setWithdrawAmount((state.userBalances[selectedCurrency] * 0.5).toString())}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  50%
                </button>
                <button
                  onClick={() => setWithdrawAmount((state.userBalances[selectedCurrency] * 0.75).toString())}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  75%
                </button>
                <button
                  onClick={() => setWithdrawAmount(state.userBalances[selectedCurrency].toString())}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  100%
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 binance-btn-danger py-2"
                >
                  Sacar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}