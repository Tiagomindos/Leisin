import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, Settings, Eye, EyeOff, Plus } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === 'BTC' ? 8 : 2,
    }).format(value);
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USDT': return '₮';
      case 'BTC': return '₿';
      default: return currency;
    }
  };

  const getCurrencyName = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'Real Brasileiro';
      case 'USDT': return 'Tether USD';
      case 'BTC': return 'Bitcoin';
      default: return currency;
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'text-green-400';
      case 'USDT': return 'text-blue-400';
      case 'BTC': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setIsSubmitting(true);
      await updateUserBalance(selectedCurrency, amount);
      setDepositAmount('');
      setShowDeposit(false);
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const balance = state.userBalances.find(b => b.currency === selectedCurrency)?.total_balance || 0;
    if (amount > 0 && amount <= balance) {
      setIsSubmitting(true);
      await updateUserBalance(selectedCurrency, -amount);
      setWithdrawAmount('');
      setShowWithdraw(false);
      setIsSubmitting(false);
    }
  };

  const totalBalance = state.userBalances.reduce((total, balance) => {
    if (balance.currency === 'BRL') return total + balance.total_balance;
    if (balance.currency === 'USDT') return total + (balance.total_balance * 5.2);
    if (balance.currency === 'BTC') return total + (balance.total_balance * 285000);
    return total;
  }, 0);

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><Wallet className="w-6 h-6 text-[#FCD535]" /><h1 className="text-xl font-bold">Carteira Digital</h1></div>
          <button onClick={() => setShowBalances(!showBalances)} className="text-gray-400 hover:text-white">{showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-2">Saldo Total</p>
          <h2 className="text-3xl font-bold">{showBalances ? formatCurrency(totalBalance) : '••••••'}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowDeposit(true)} className="flex items-center justify-center gap-2 py-3 bg-[#02C076] hover:bg-[#019760] text-white rounded font-semibold transition-colors"><ArrowDownLeft className="w-5 h-5" /><span>Depositar</span></button>
          <button onClick={() => setShowWithdraw(true)} className="flex items-center justify-center gap-2 py-3 bg-[#F6465D] hover:bg-[#E53E3E] text-white rounded font-semibold transition-colors"><ArrowUpRight className="w-5 h-5" /><span>Sacar</span></button>
        </div>
      </div>

      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Saldos por Moeda</h3>
        <div className="space-y-3">
          {state.userBalances.map((balance) => (
            <div key={balance.currency} className="flex items-center justify-between p-3 bg-[#2B3139] rounded">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getCurrencyColor(balance.currency)}`}>{getCurrencyIcon(balance.currency)}</div>
                <div><p className="font-medium">{getCurrencyName(balance.currency)}</p><p className="text-sm text-gray-400">{balance.currency}</p></div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{showBalances ? formatCurrency(balance.total_balance, balance.currency) : '••••••'}</p>
                <p className="text-sm text-gray-400">Disponível</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="binance-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Depositar</h3><button onClick={() => setShowDeposit(false)} className="text-gray-400 hover:text-white">✕</button></div>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2">Moeda</label><select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="binance-input w-full"><option value="BRL">Real Brasileiro (BRL)</option><option value="USDT">Tether USD (USDT)</option><option value="BTC">Bitcoin (BTC)</option></select></div>
              <div><label className="block text-sm text-gray-400 mb-2">Valor</label><input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="binance-input w-full" placeholder="0,00" /></div>
              <div className="flex gap-2"><button onClick={() => setShowDeposit(false)} className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors">Cancelar</button><button onClick={handleDeposit} disabled={isSubmitting} className="flex-1 binance-btn-primary py-2 disabled:opacity-50">{isSubmitting ? 'Depositando...' : 'Depositar'}</button></div>
            </div>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="binance-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Sacar</h3><button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-white">✕</button></div>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2">Moeda</label><select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="binance-input w-full"><option value="BRL">Real Brasileiro (BRL)</option><option value="USDT">Tether USD (USDT)</option><option value="BTC">Bitcoin (BTC)</option></select></div>
              <div><label className="block text-sm text-gray-400 mb-2">Valor</label><input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="binance-input w-full" placeholder="0,00" max={state.userBalances.find(b => b.currency === selectedCurrency)?.total_balance || 0} /><p className="text-xs text-gray-400 mt-1">Disponível: {formatCurrency(state.userBalances.find(b => b.currency === selectedCurrency)?.total_balance || 0, selectedCurrency)}</p></div>
              <div className="flex gap-2"><button onClick={() => setShowWithdraw(false)} className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors">Cancelar</button><button onClick={handleWithdraw} disabled={isSubmitting} className="flex-1 binance-btn-danger py-2 disabled:opacity-50">{isSubmitting ? 'Sacando...' : 'Sacar'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}