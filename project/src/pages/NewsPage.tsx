import { Clock, TrendingUp, Sparkles, Play, BookOpen, AlertCircle, Search, Filter, Calendar, Heart, Share2, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

export default function NewsPage() {
  const { state } = useApp();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());

  const tabs = ['Descubra', 'Seguindo', 'Campanha', 'Anúncios', 'Popular'];
  const categories = ['all', 'real_estate', 'crypto', 'economy', 'construction', 'market'];

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'real_estate':
        return 'Imobiliário';
      case 'crypto':
        return 'Cripto';
      case 'economy':
        return 'Economia';
      case 'construction':
        return 'Construção';
      case 'market':
        return 'Mercado';
      default:
        return 'Todos';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'real_estate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'crypto':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'economy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'construction':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'market':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real_estate':
        return '🏠';
      case 'crypto':
        return '₿';
      case 'economy':
        return '📈';
      case 'construction':
        return '🏗️';
      case 'market':
        return '💹';
      default:
        return '📰';
    }
  };

  const filteredNews = state.news.filter(news => {
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLikeNews = (newsId: string) => {
    setLikedNews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}sem`;
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      {/* Search and Filter */}
      <div className="binance-card p-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar notícias..."
              className="binance-input pl-10 w-full"
            />
          </div>
          <button className="px-3 py-2 bg-[#2B3139] hover:bg-[#3A4048] rounded text-gray-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? getCategoryColor(category)
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              {getCategoryIcon(category)} {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-800">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(i)}
            className={`pb-3 px-3 whitespace-nowrap font-medium transition-colors ${
              i === selectedTab ? 'tab-active' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {filteredNews.length > 0 && (
        <div className="binance-card overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-700">
            <img
              src={filteredNews[0].image_url}
              alt="Featured"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-[#FCD535] text-black text-xs font-semibold rounded">
                  DESTAQUE
                </span>
                <span className={`px-2 py-1 backdrop-blur text-white text-xs rounded ${getCategoryColor(filteredNews[0].category)}`}>
                  {getCategoryName(filteredNews[0].category)}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1 line-clamp-2">
                {filteredNews[0].title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(filteredNews[0].published_at)}</span>
                <span>•</span>
                <span>5 min de leitura</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{filteredNews[0].views_count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="binance-card p-4 bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Insights da IA T3</h3>
            <p className="text-sm text-gray-400">
              Análise personalizada do seu portfólio disponível
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Ver
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Últimas Notícias</h3>
          <button className="text-[#FCD535] text-sm">Ver tudo</button>
        </div>

        {filteredNews.slice(1).map((news) => {
          const isLiked = likedNews.has(news.id);
          
          return (
            <div key={news.id} className="binance-card p-3 hover:border-[#FCD535]/30 transition-colors">
              <div className="flex gap-3">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded border ${getCategoryColor(news.category)}`}>
                      {getCategoryName(news.category)}
                    </span>
                    <span className="text-xs text-gray-400">{formatTimeAgo(news.published_at)}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {news.title}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye className="w-3 h-3" />
                        <span>{news.views_count.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleLikeNews(news.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          isLiked ? 'text-[#F6465D]' : 'text-gray-400 hover:text-[#F6465D]'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{Math.floor(Math.random() * 100)}</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FCD535] transition-colors">
                        <Share2 className="w-3 h-3" />
                        <span>Compartilhar</span>
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">Leia mais</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Videos */}
      <div className="space-y-3">
        <h3 className="font-semibold">Vídeos em Destaque</h3>

        {[
          {
            id: '1',
            title: 'Como investir em imóveis tokenizados: Guia completo 2025',
            duration: '12:34',
            views: '45K',
            thumbnail: 'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Educação'
          },
          {
            id: '2',
            title: 'Análise de mercado: Melhores oportunidades do mês',
            duration: '8:15',
            views: '32K',
            thumbnail: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: 'Análise'
          },
        ].map((video) => (
          <div key={video.id} className="binance-card overflow-hidden hover:border-[#FCD535]/30 transition-colors">
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-black ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur rounded text-xs font-semibold">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-[#FCD535] text-black text-xs font-semibold rounded">
                {video.category}
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm mb-2">{video.title}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{video.views} visualizações</span>
                <span>•</span>
                <span>Há 1 dia</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Academy */}
      <div className="binance-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#FCD535] rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="font-semibold">Academia T3</h3>
            <p className="text-xs text-gray-400">Aprenda e invista melhor</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Iniciante em Cripto', progress: 0, color: 'from-blue-500 to-purple-600' },
            { name: 'Análise Técnica', progress: 25, color: 'from-green-500 to-teal-600' },
            { name: 'Fundos Imobiliários', progress: 0, color: 'from-orange-500 to-red-600' },
            { name: 'Gestão de Risco', progress: 50, color: 'from-purple-500 to-pink-600' },
          ].map((course) => (
            <button
              key={course.name}
              className="p-3 bg-[#2B3139] hover:bg-[#FCD535]/20 hover:border-[#FCD535] border border-transparent rounded-lg text-sm transition-all relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${course.color} transition-all`}
                   style={{ width: `${course.progress}%` }} />
              <div className="relative">
                <p className="font-medium mb-1">{course.name}</p>
                <p className="text-xs text-gray-400">
                  {course.progress > 0 ? `${course.progress}% concluído` : 'Não iniciado'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="binance-card p-4">
        <h3 className="font-semibold mb-3">Tópicos em Alta</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Tokenização', trend: '+15%' },
            { name: 'Real Estate', trend: '+8%' },
            { name: 'DeFi', trend: '+23%' },
            { name: 'Construção Modular', trend: '+12%' },
            { name: 'ESG', trend: '+18%' },
            { name: 'Smart Contracts', trend: '+6%' },
            { name: 'Yield Farming', trend: '+31%' },
            { name: 'NFT Imobiliário', trend: '+4%' },
          ].map((topic) => (
            <button
              key={topic.name}
              className="px-3 py-1.5 bg-[#2B3139] hover:bg-[#FCD535]/20 hover:text-[#FCD535] rounded-full text-sm transition-colors flex items-center gap-1"
            >
              #{topic.name}
              <span className="text-xs text-green-400">{topic.trend}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}