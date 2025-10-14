import { TrendingUp, TrendingDown, Building2, Star, Filter, Loader2, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

export default function MarketsPage() {
  const { state, getPropertyById, getMarketPairBySymbol } = useApp();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['Imóveis', 'Criptos', 'Híbridos', 'Fundos'];
  const categories = ['Todos', 'Residencial', 'Comercial', 'Loteamento'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Filter data based on selected tab and category
  const getFilteredData = () => {
    let filtered = state.marketPairs;

    // Filter by tab
    if (selectedTab === 0) { // Imóveis
      filtered = filtered.filter(pair => pair.asset_type === 'property');
    } else if (selectedTab === 1) { // Criptos
      filtered = filtered.filter(pair => pair.asset_type === 'crypto');
    } else if (selectedTab === 2) { // Híbridos
      filtered = filtered.filter(pair => pair.asset_type === 'hybrid');
    } else if (selectedTab === 3) { // Fundos
      filtered = filtered.filter(pair => pair.asset_type === 'fund');
    }

    // Filter by category (only for properties)
    if (selectedTab === 0 && selectedCategory > 0) {
      const categoryMap = ['', 'residential', 'commercial', 'land'];
      const category = categoryMap[selectedCategory];
      filtered = filtered.filter(pair => {
        const property = getPropertyById(pair.property_id || '');
        return property?.property_type === category;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pair => {
        const property = getPropertyById(pair.property_id || '');
        return pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
               property?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  };

  const getTopGainers = () => {
    return getFilteredData()
      .filter(pair => pair.price_change_24h > 0)
      .sort((a, b) => b.price_change_24h - a.price_change_24h)
      .slice(0, 5);
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(fav => fav !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(i)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedTab === i
                ? 'bg-[#FCD535] text-black'
                : 'bg-[#2B3139] text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(i)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === i
                  ? 'bg-[#FCD535]/20 text-[#FCD535] border border-[#FCD535]'
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="p-2 bg-[#2B3139] rounded-lg">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Destaques do Dia</h3>
            <p className="text-sm text-gray-400">Maiores valorizações</p>
          </div>
          <TrendingUp className="w-6 h-6 price-up" />
        </div>

        <div className="space-y-3">
          {getTopGainers().length > 0 ? (
            getTopGainers().slice(0, 2).map((pair) => {
              const property = getPropertyById(pair.property_id || '');
              return (
                <button
                  key={pair.symbol}
                  className="w-full binance-card p-4 hover:border-[#FCD535]/30 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                      {property?.property_type === 'residential' ? '🏠' : 
                       property?.property_type === 'commercial' ? '🏢' : '🏗️'}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{property?.name || pair.symbol}</h4>
                          <p className="text-xs text-gray-400">
                            {property?.address?.city || 'Localização não disponível'}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-[#FCD535]">
                          <Star className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                          {property?.property_type || pair.asset_type}
                        </span>
                        <span className="text-xs text-gray-400">{pair.symbol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Preço/Cota</p>
                      <p className="font-semibold">{formatCurrency(pair.current_price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">24h</p>
                      <p className="price-up font-semibold">{formatPercentage(pair.price_change_24h)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Yield</p>
                      <p className="text-[#02C076] font-semibold">
                        {property?.expected_yield ? `${property.expected_yield}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Liquidez</p>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 bg-[#2B3139] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#02C076] rounded-full"
                            style={{ width: `${pair.liquidity_score}%` }}
                          />
                        </div>
                        <span className="text-xs">{pair.liquidity_score}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhum ativo encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="binance-card overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-semibold">Todos os Ativos</h3>
        </div>

        <div className="divide-y divide-gray-800">
          {getFilteredData().length > 0 ? (
            getFilteredData().slice(0, 10).map((pair) => {
              const property = getPropertyById(pair.property_id || '');
              return (
                <button
                  key={pair.symbol}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#2B3139] transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{property?.name || pair.symbol}</p>
                      <span className="px-1.5 py-0.5 bg-[#2B3139] text-xs rounded">
                        {property?.construction_status || pair.asset_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{pair.symbol}</span>
                      <span>•</span>
                      <span>Vol {formatCurrency(pair.volume_24h)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold mb-1">{formatCurrency(pair.current_price)}</p>
                    <p
                      className={`text-sm font-medium ${
                        pair.price_change_24h > 0 ? 'price-up' : 'price-down'
                      }`}
                    >
                      {formatPercentage(pair.price_change_24h)}
                    </p>
                  </div>

                  {pair.price_change_24h > 0 ? (
                    <TrendingUp className="w-5 h-5 price-up" />
                  ) : (
                    <TrendingDown className="w-5 h-5 price-down" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhum ativo encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="binance-card p-4 bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Insights da IA</h3>
            <p className="text-sm text-gray-400">
              Residencial Sunset teve aumento de liquidez de 34% esta semana
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Ver
          </button>
        </div>
      </div>
    </div>
  );
}
