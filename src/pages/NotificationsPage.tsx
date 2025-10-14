import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

export default function NotificationsPage() {
  const { state, markAsRead, markAllAsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = filter === 'unread' 
    ? state.notifications.filter(n => !n.is_read)
    : state.notifications;

  const deleteNotification = (id: string) => {
    // In a real app, this would call an API
    console.log('Delete notification:', id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade': return '💰';
      case 'payment': return '💳';
      case 'kyc': return '📋';
      case 'social': return '👥';
      case 'news': return '📰';
      case 'alert': return '⚠️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trade': return 'text-[#02C076]';
      case 'payment': return 'text-[#FCD535]';
      case 'kyc': return 'text-blue-400';
      case 'social': return 'text-purple-400';
      case 'news': return 'text-orange-400';
      case 'alert': return 'text-[#F6465D]';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="binance-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#FCD535]" />
            <h1 className="text-xl font-bold">Notificações</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-[#FCD535] text-black'
                  : 'bg-[#2B3139] text-gray-400 hover:text-white'
              }`}
            >
              {filter === 'unread' ? 'Não lidas' : 'Todas'}
            </button>
            {state.notifications.some(n => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 bg-[#02C076] hover:bg-[#019760] text-white rounded text-sm font-medium transition-colors"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.is_read
                    ? 'bg-[#2B3139] border-gray-800'
                    : 'bg-[#2B3139]/50 border-[#FCD535]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${getNotificationColor(notification.notification_type)}`}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          notification.is_read ? 'text-gray-300' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          notification.is_read ? 'text-gray-400' : 'text-gray-300'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>
                            {new Date(notification.created_at).toLocaleString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            notification.is_read 
                              ? 'bg-gray-700 text-gray-400' 
                              : 'bg-[#FCD535]/20 text-[#FCD535]'
                          }`}>
                            {notification.is_read ? 'Lida' : 'Nova'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-[#02C076] transition-colors"
                            title="Marcar como lida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        {notification.action_url && (
                          <button
                            className="p-1.5 text-gray-400 hover:text-[#FCD535] transition-colors"
                            title="Ver detalhes"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-[#F6465D] transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </h3>
              <p className="text-sm text-gray-500">
                {filter === 'unread' 
                  ? 'Você está em dia com suas notificações!'
                  : 'As notificações aparecerão aqui quando você receber.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="binance-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-[#FCD535]" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold">{state.notifications.length}</p>
        </div>
        
        <div className="binance-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-[#F6465D] rounded-full flex items-center justify-center">
              <span className="text-xs text-white">!</span>
            </div>
            <span className="text-sm text-gray-400">Não lidas</span>
          </div>
          <p className="text-2xl font-bold text-[#F6465D]">
            {state.notifications.filter(n => !n.is_read).length}
          </p>
        </div>
      </div>
    </div>
  );
}