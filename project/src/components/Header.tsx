import { Bell, Menu, Search, User, LogOut, Building2, Shield, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  onAuthClick: () => void;
  onNavigate?: (tab: string) => void;
}

export default function Header({ title, onAuthClick, onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { state } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#181A20] border-b border-gray-800 z-40">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">{title}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-400 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {state.notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F6465D] rounded-full text-xs flex items-center justify-center text-white">
                  {state.notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 binance-card p-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Notificações</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-2">
                  {state.notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded ${
                        notification.is_read ? 'bg-[#2B3139]' : 'bg-[#2B3139]/50'
                      }`}
                    >
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                  
                  {state.notifications.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Nenhuma notificação
                    </p>
                  )}
                </div>
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FCD535] to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 binance-card p-2">
                    <div className="px-3 py-2 border-b border-gray-800">
                      <p className="font-semibold text-sm">
                        {profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    
                    {onNavigate && (
                      <>
                        <button
                          onClick={() => {
                            onNavigate('wallet');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2B3139] rounded"
                        >
                          <Wallet className="w-4 h-4" />
                          <span>Carteira</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('properties');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2B3139] rounded"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>Propriedades</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('notifications');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2B3139] rounded"
                        >
                          <Bell className="w-4 h-4" />
                          <span>Notificações</span>
                          {state.notifications.filter(n => !n.is_read).length > 0 && (
                            <span className="ml-auto w-5 h-5 bg-[#F6465D] rounded-full text-xs flex items-center justify-center text-white">
                              {state.notifications.filter(n => !n.is_read).length}
                            </span>
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2B3139] rounded"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Painel Admin</span>
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2B3139] rounded"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 px-4 py-2 bg-[#FCD535] hover:bg-[#F0B90B] text-black rounded font-semibold transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}