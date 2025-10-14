import React, { createContext, useContext } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useMarketData } from '../hooks/useMarketData';
import { useUserBalances } from '../hooks/useUserBalances';
import { useUserPortfolio } from '../hooks/useUserPortfolio';
import { useTrading } from '../hooks/useTrading';
import { useNews } from '../hooks/useNews';
import { usePosts } from '../hooks/usePosts';
import { useNotifications } from '../hooks/useNotifications';

// We can define a simplified state structure for pages to consume
interface AppState {
  properties: ReturnType<typeof useProperties>['properties'];
  marketPairs: ReturnType<typeof useMarketData>['marketPairs'];
  userBalances: ReturnType<typeof useUserBalances>['balances'];
  userPortfolio: ReturnType<typeof useUserPortfolio>['portfolioMap'];
  news: ReturnType<typeof useNews>['news'];
  posts: ReturnType<typeof usePosts>['posts'];
  notifications: ReturnType<typeof useNotifications>['notifications'];
  trades: any[]; // from useTrading
}

interface AppContextType {
  state: AppState;
  loading: boolean;
  // Functions from hooks
  getPropertyById: ReturnType<typeof useProperties>['getPropertyById'];
  getMarketPairBySymbol: ReturnType<typeof useMarketData>['getMarketPairBySymbol'];
  createOrder: ReturnType<typeof useTrading>['createOrder'];
  getOrderBook: ReturnType<typeof useTrading>['getOrderBook'];
  getRecentTrades: ReturnType<typeof useTrading>['getRecentTrades'];
  createPost: ReturnType<typeof usePosts>['createPost'];
  likePost: ReturnType<typeof usePosts>['likePost'];
  markAsRead: ReturnType<typeof useNotifications>['markAsRead'];
  markAllAsRead: ReturnType<typeof useNotifications>['markAllAsRead'];
  updateUserBalance: ReturnType<typeof useUserBalances>['updateUserBalance'];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const properties = useProperties();
  const marketData = useMarketData();
  const balances = useUserBalances();
  const portfolio = useUserPortfolio();
  const trading = useTrading();
  const news = useNews();
  const posts = usePosts();
  const notifications = useNotifications();

  const state: AppState = {
    properties: properties.properties,
    marketPairs: marketData.marketPairs,
    userBalances: balances.balances,
    userPortfolio: portfolio.portfolioMap,
    news: news.news,
    posts: posts.posts,
    notifications: notifications.notifications,
    trades: [], // Placeholder, can be fetched via useTrading if needed
  };

  const loading =
    properties.loading ||
    marketData.loading ||
    balances.loading ||
    portfolio.loading ||
    trading.loading ||
    news.loading ||
    posts.loading ||
    notifications.loading;

  const value: AppContextType = {
    state,
    loading,
    getPropertyById: properties.getPropertyById,
    getMarketPairBySymbol: marketData.getMarketPairBySymbol,
    createOrder: trading.createOrder,
    getOrderBook: trading.getOrderBook,
    getRecentTrades: trading.getRecentTrades,
    createPost: posts.createPost,
    likePost: posts.likePost,
    markAsRead: notifications.markAsRead,
    markAllAsRead: notifications.markAllAsRead,
    updateUserBalance: balances.updateUserBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};