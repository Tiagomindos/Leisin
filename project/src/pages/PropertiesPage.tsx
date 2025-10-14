import { MapPin, Calendar, Users, DollarSign, TrendingUp, Star, Filter, Search, Grid, List, Heart, Share2, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

export default function PropertiesPage() {
  const { state, getPropertyById } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏠' },
    { id: 'residential', name: 'Residencial', icon: '🏘️' },
    { id: 'commercial', name: 'Comercial', icon: '🏢' },
    { id: 'land', name: 'Loteamento', icon: '🌱' },
    { id: 'mixed', name: 'Misto', icon: '🏗️' },
  ];

  const sortOptions = [
    { id: 'newest', name: 'Mais Recentes' },
    { id: 'price_low', name: 'Menor Preço' },
    { id: 'price_high', name: 'Maior Preço' },
    { id: 'yield_high', name: 'Maior Yield' },
    { id: 'area_large', name: 'Maior Área' },
  ];

  const filteredProperties = state.properties
    .filter(property => {
      const matchesCategory = selectedCategory === 'all' || property.property_type === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.city.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.listed_at).getTime() - new Date(a.listed_at).getTime();
        case 'price_low':
          return a.price_per_token - b.price_per_token;
        case 'price_high':
          return b.price_per_token - a.price_per_token;
        case 'yield_high':
          return b.expected_yield - a.expected_yield;
        case 'area_large':
          return b.total_area - a.total_area;
        default:
          return 0;
      }
    });

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'construction':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'planning':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'construction':
        return 'Em Construção';
      case 'planning':
        return 'Em Planejamento';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      {/* Header */}
      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Propriedades Imobiliárias</h1>
            <p className="text-sm text-gray-400">Investa em imóveis tokenizados</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-[#2B3139] hover:bg-[#3A4048] rounded text-gray-400 hover:text-white transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-[#2B3139] hover:bg-[#3A4048] rounded text-gray-400 hover:text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar propriedades..."
            className="binance-input pl-10 w-full"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#FCD535] text-black'
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="binance-input text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="binance-card p-4">
          <h3 className="font-semibold mb-4">Filtros</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Preço Mínimo</label>
              <input
                type="number"
                placeholder="R$ 0"
                className="binance-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Preço Máximo</label>
              <input
                type="number"
                placeholder="R$ 1.000.000"
                className="binance-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Yield Mínimo</label>
              <input
                type="number"
                placeholder="0%"
                className="binance-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Status</label>
              <select className="binance-input w-full">
                <option value="">Todos</option>
                <option value="completed">Concluído</option>
                <option value="construction">Em Construção</option>
                <option value="planning">Em Planejamento</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredProperties.map((property) => {
          const isFavorite = favorites.has(property.id);
          const marketPair = state.marketPairs.find(p => p.property_id === property.id);
          
          return (
            <div key={property.id} className="binance-card overflow-hidden hover:border-[#FCD535]/30 transition-colors">
              {/* Image */}
              <div className="relative h-48 bg-gray-800">
                <img
                  src={property.images[0] || 'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(property.construction_status)}`}>
                    {getStatusText(property.construction_status)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`p-2 rounded-full backdrop-blur transition-colors ${
                      isFavorite 
                        ? 'bg-[#F6465D] text-white' 
                        : 'bg-black/50 text-white hover:bg-[#F6465D]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-black/50 text-white hover:bg-[#FCD535] backdrop-blur transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address.city}, {property.address.state}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{property.name}</h3>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FCD535]">
                      {formatCurrency(property.price_per_token)}
                    </p>
                    <p className="text-xs text-gray-400">por cota</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {property.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-gray-400">Yield</p>
                      <p className="font-semibold text-green-400">{property.expected_yield}% a.a.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-gray-400">Unidades</p>
                      <p className="font-semibold">{property.total_units}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-gray-400">Área Total</p>
                      <p className="font-semibold">{property.total_area.toLocaleString()} m²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-gray-400">Listado em</p>
                      <p className="font-semibold">{formatDate(property.listed_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                    <span className="text-sm text-gray-400">(127 avaliações)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>1.2K visualizações</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#2B3139] hover:bg-[#3A4048] text-white rounded transition-colors">
                    Ver Detalhes
                  </button>
                  <button className="flex-1 binance-btn-primary py-2">
                    Investir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-[#2B3139] rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            Nenhuma propriedade encontrada
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Tente ajustar os filtros ou buscar por outros termos
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="binance-btn-primary px-4 py-2"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="binance-card p-4 text-center">
          <div className="text-2xl font-bold text-[#FCD535] mb-1">
            {state.properties.length}
          </div>
          <div className="text-sm text-gray-400">Propriedades</div>
        </div>
        <div className="binance-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {state.properties.reduce((sum, p) => sum + p.total_value, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Valor Total (R$)</div>
        </div>
        <div className="binance-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {state.properties.reduce((sum, p) => sum + p.total_tokens, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Cotas Disponíveis</div>
        </div>
        <div className="binance-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {(state.properties.reduce((sum, p) => sum + p.expected_yield, 0) / state.properties.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Yield Médio</div>
        </div>
      </div>
    </div>
  );
}
