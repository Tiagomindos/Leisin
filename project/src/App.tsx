import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AuthModal from './components/auth/AuthModal';
import HomePage from './pages/HomePage';
import MarketsPage from './pages/MarketsPage';
import TradePage from './pages/TradePage';
import NewsPage from './pages/NewsPage';
import SocialPage from './pages/SocialPage';
import NotificationsPage from './pages/NotificationsPage';
import WalletPage from './pages/WalletPage';
import PropertiesPage from './pages/PropertiesPage';
import AdminPage from './pages/AdminPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      home: 'T3 Core Bank',
      markets: 'Mercados',
      trade: 'Trade',
      news: 'Descubra',
      social: 'T3 Connect',
      notifications: 'Notificações',
      wallet: 'Carteira',
      properties: 'Propriedades',
      admin: 'Painel Admin',
    };
    return titles[activeTab] || 'T3';
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'markets':
        return <MarketsPage />;
      case 'trade':
        return <TradePage />;
      case 'news':
        return <NewsPage />;
      case 'social':
        return <SocialPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'properties':
        return <PropertiesPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#FCD535]" />
          <p className="text-gray-400">Carregando T3 Core Bank...</p>
        </div>
      </div>
    );
  }

  return (
        <div className="min-h-screen bg-[#0B0E11]">
          <Header 
            title={getPageTitle()} 
            onAuthClick={() => setShowAuthModal(true)}
            onNavigate={setActiveTab}
          />
          <main className="max-w-screen-xl mx-auto">
            {renderPage()}
          </main>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
