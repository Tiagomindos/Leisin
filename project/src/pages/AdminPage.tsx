import { BarChart3, Users, Building2, DollarSign, TrendingUp, Settings, Shield, Activity, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

export default function AdminPage() {
  const { state } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'properties', name: 'Propriedades', icon: Building2 },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'inactive':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const mockUsers = [
    { id: '1', name: 'João Silva', email: 'joao@email.com', status: 'active', joinDate: '2024-01-15', totalInvested: 50000 },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', status: 'active', joinDate: '2024-02-20', totalInvested: 75000 },
    { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', status: 'pending', joinDate: '2024-10-10', totalInvested: 0 },
    { id: '4', name: 'Ana Oliveira', email: 'ana@email.com', status: 'active', joinDate: '2024-03-05', totalInvested: 120000 },
  ];

  const mockTradingStats = {
    totalVolume: 2500000,
    totalTrades: 1250,
    activeOrders: 45,
    completedTrades: 1205,
    avgTradeSize: 2000,
    topPair: 'RESID-BRL',
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="binance-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-green-400">+12%</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{mockUsers.length}</h3>
          <p className="text-sm text-gray-400">Usuários Ativos</p>
        </div>

        <div className="binance-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Building2 className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-sm text-green-400">+8%</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{state.properties.length}</h3>
          <p className="text-sm text-gray-400">Propriedades</p>
        </div>

        <div className="binance-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-sm text-green-400">+15%</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(mockTradingStats.totalVolume)}</h3>
          <p className="text-sm text-gray-400">Volume Total</p>
        </div>

        <div className="binance-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-green-400">+23%</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatNumber(mockTradingStats.totalTrades)}</h3>
          <p className="text-sm text-gray-400">Trades Realizados</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {[
            { action: 'Novo usuário registrado', user: 'Pedro Costa', time: '2 min atrás', type: 'user' },
            { action: 'Ordem executada', user: 'João Silva', time: '5 min atrás', type: 'trade' },
            { action: 'Propriedade adicionada', user: 'Admin', time: '1 hora atrás', type: 'property' },
            { action: 'Depósito realizado', user: 'Maria Santos', time: '2 horas atrás', type: 'wallet' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#2B3139] rounded">
              <div className={`p-2 rounded-lg ${
                activity.type === 'user' ? 'bg-blue-500/20' :
                activity.type === 'trade' ? 'bg-green-500/20' :
                activity.type === 'property' ? 'bg-yellow-500/20' :
                'bg-purple-500/20'
              }`}>
                <Activity className={`w-4 h-4 ${
                  activity.type === 'user' ? 'text-blue-400' :
                  activity.type === 'trade' ? 'text-green-400' :
                  activity.type === 'property' ? 'text-yellow-400' :
                  'text-purple-400'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Usuários</h3>
        <button className="binance-btn-primary px-4 py-2 text-sm">
          Adicionar Usuário
        </button>
      </div>

      <div className="binance-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2B3139]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Usuário</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Data de Cadastro</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Total Investido</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#2B3139]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FCD535] to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      {user.status === 'active' ? 'Ativo' : user.status === 'pending' ? 'Pendente' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(user.totalInvested)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-[#FCD535] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Propriedades</h3>
        <button className="binance-btn-primary px-4 py-2 text-sm">
          Adicionar Propriedade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.properties.map((property) => (
          <div key={property.id} className="binance-card p-4">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold line-clamp-1">{property.name}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.construction_status)}`}>
                {property.construction_status === 'completed' ? 'Concluído' : 
                 property.construction_status === 'construction' ? 'Em Construção' : 'Planejamento'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Valor Total:</span>
                <span className="font-medium">{formatCurrency(property.total_value)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Preço por Cota:</span>
                <span className="font-medium">{formatCurrency(property.price_per_token)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Yield:</span>
                <span className="font-medium text-green-400">{property.expected_yield}% a.a.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cotas Disponíveis:</span>
                <span className="font-medium">{formatNumber(property.available_tokens)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#2B3139] hover:bg-[#3A4048] text-white rounded transition-colors text-sm">
                Editar
              </button>
              <button className="flex-1 py-2 bg-[#FCD535] hover:bg-[#F0B90B] text-black rounded transition-colors text-sm">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrading = () => (
    <div className="space-y-6">
      {/* Trading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="binance-card p-4">
          <h4 className="font-semibold mb-2">Volume Total</h4>
          <p className="text-2xl font-bold text-[#FCD535]">{formatCurrency(mockTradingStats.totalVolume)}</p>
        </div>
        <div className="binance-card p-4">
          <h4 className="font-semibold mb-2">Total de Trades</h4>
          <p className="text-2xl font-bold text-green-400">{formatNumber(mockTradingStats.totalTrades)}</p>
        </div>
        <div className="binance-card p-4">
          <h4 className="font-semibold mb-2">Ordens Ativas</h4>
          <p className="text-2xl font-bold text-blue-400">{mockTradingStats.activeOrders}</p>
        </div>
        <div className="binance-card p-4">
          <h4 className="font-semibold mb-2">Trades Concluídos</h4>
          <p className="text-2xl font-bold text-purple-400">{formatNumber(mockTradingStats.completedTrades)}</p>
        </div>
        <div className="binance-card p-4">
          <h4 className="font-semibold mb-2">Tamanho Médio</h4>
          <p className="text-2xl font-bold text-orange-400">{formatCurrency(mockTradingStats.avgTradeSize)}</p>
        </div>
        <div className="binance-card p-4">
          <h4 className="font-semibold mb-2">Par Mais Negociado</h4>
          <p className="text-2xl font-bold text-yellow-400">{mockTradingStats.topPair}</p>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Trades Recentes</h3>
        <div className="space-y-3">
          {state.trades.slice(0, 10).map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 bg-[#2B3139] rounded">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {trade.side === 'buy' ? 'B' : 'S'}
                </div>
                <div>
                  <p className="font-medium">{trade.market_pair_id}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(trade.executed_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(trade.price)}</p>
                <p className="text-sm text-gray-400">{trade.amount} cotas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Configurações Gerais</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Nome da Plataforma</label>
            <input
              type="text"
              defaultValue="T3 Core Bank"
              className="binance-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Taxa de Trading (%)</label>
            <input
              type="number"
              defaultValue="0.1"
              step="0.01"
              className="binance-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Taxa de Depósito (%)</label>
            <input
              type="number"
              defaultValue="0"
              step="0.01"
              className="binance-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Taxa de Saque (%)</label>
            <input
              type="number"
              defaultValue="0.5"
              step="0.01"
              className="binance-input w-full"
            />
          </div>
        </div>
      </div>

      <div className="binance-card p-4">
        <h3 className="font-semibold mb-4">Configurações de Segurança</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autenticação 2FA</p>
              <p className="text-sm text-gray-400">Requer autenticação de dois fatores</p>
            </div>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
              Ativado
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">KYC Obrigatório</p>
              <p className="text-sm text-gray-400">Requer verificação de identidade</p>
            </div>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
              Ativado
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Manutenção Programada</p>
              <p className="text-sm text-gray-400">Sistema em manutenção</p>
            </div>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
              Desativado
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      {/* Header */}
      <div className="binance-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-gray-400">Gerencie sua plataforma</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedTab === tab.id
                  ? 'bg-[#FCD535] text-black'
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'users' && renderUsers()}
      {selectedTab === 'properties' && renderProperties()}
      {selectedTab === 'trading' && renderTrading()}
      {selectedTab === 'settings' && renderSettings()}
    </div>
  );
}
