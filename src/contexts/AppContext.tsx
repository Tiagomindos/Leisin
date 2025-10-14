import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockProperties, mockMarketPairs, mockOrders, mockTrades, mockNews, mockPosts, mockNotifications } from '../data/mockData';

// Types
interface Property {
  id: string;
  name: string;
  description: string;
  property_type: 'residential' | 'commercial' | 'land' | 'mixed';
  address: any;
  coordinates: any;
  total_area: number;
  total_units: number;
  construction_status: 'planning' | 'construction' | 'completed';
  total_value: number;
  token_symbol: string;
  total_tokens: number;
  available_tokens: number;
  price_per_token: number;
  min_investment: number;
  expected_yield: number;
  rental_status: 'none' | 'partial' | 'full';
  images: string[];
  documents: any[];
  vyner_3d_url: string | null;
  listed_at: string;
  created_at: string;
  updated_at: string;
}

interface MarketPair {
  id: string;
  symbol: string;
  base_asset: string;
  quote_asset: string;
  asset_type: 'property' | 'crypto' | 'hybrid' | 'fund';
  property_id: string | null;
  current_price: number;
  price_change_24h: number;
  volume_24h: number;
  high_24h: number | null;
  low_24h: number | null;
  liquidity_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  user_id: string;
  market_pair_id: string;
  order_type: 'limit' | 'market' | 'stop_limit';
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  filled_amount: number;
  remaining_amount: number;
  total: number;
  status: 'open' | 'partial' | 'filled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface Trade {
  id: string;
  market_pair_id: string;
  buy_order_id: string;
  sell_order_id: string;
  buyer_id: string;
  seller_id: string;
  price: number;
  amount: number;
  total: number;
  fee: number;
  executed_at: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: 'real_estate' | 'crypto' | 'economy' | 'construction' | 'market';
  author: string;
  source_url: string;
  image_url: string;
  views_count: number;
  published_at: string;
  created_at: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  images: string[];
  post_type: 'general' | 'analysis' | 'news' | 'question';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'trade' | 'payment' | 'kyc' | 'social' | 'news' | 'alert';
  is_read: boolean;
  action_url: string;
  created_at: string;
}

interface AppState {
  properties: Property[];
  marketPairs: MarketPair[];
  orders: Order[];
  trades: Trade[];
  news: News[];
  posts: Post[];
  notifications: Notification[];
  userBalances: { [currency: string]: number };
  userPortfolio: { [propertyId: string]: number };
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_MARKET_PRICES' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'ADD_TRADE'; payload: Trade }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<Post> } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_USER_BALANCE'; payload: { currency: string; amount: number } }
  | { type: 'UPDATE_USER_PORTFOLIO'; payload: { propertyId: string; amount: number } };

const initialState: AppState = {
  properties: mockProperties,
  marketPairs: mockMarketPairs,
  orders: mockOrders,
  trades: mockTrades,
  news: mockNews,
  posts: mockPosts,
  notifications: mockNotifications,
  userBalances: {
    BRL: 50000,
    USDT: 1000,
    BTC: 0.1
  },
  userPortfolio: {
    'prop-1': 100,
    'prop-2': 50
  },
  loading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_MARKET_PRICES':
      return {
        ...state,
        marketPairs: state.marketPairs.map(pair => ({
          ...pair,
          current_price: pair.current_price * (0.98 + Math.random() * 0.04), // ±2% variation
          price_change_24h: (Math.random() - 0.5) * 20, // -10% to +10%
          volume_24h: pair.volume_24h * (0.8 + Math.random() * 0.4), // ±20% volume variation
          updated_at: new Date().toISOString()
        }))
      };
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order
        )
      };
    
    case 'ADD_TRADE':
      return { ...state, trades: [action.payload, ...state.trades] };
    
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.updates }
            : post
        )
      };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload
            ? { ...notif, is_read: true }
            : notif
        )
      };
    
    case 'UPDATE_USER_BALANCE':
      return {
        ...state,
        userBalances: {
          ...state.userBalances,
          [action.payload.currency]: action.payload.amount
        }
      };
    
    case 'UPDATE_USER_PORTFOLIO':
      return {
        ...state,
        userPortfolio: {
          ...state.userPortfolio,
          [action.payload.propertyId]: action.payload.amount
        }
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  getPropertyById: (id: string) => Property | undefined;
  getMarketPairBySymbol: (symbol: string) => MarketPair | undefined;
  getUserOrders: (userId: string) => Order[];
  getOrderBook: (marketPairId: string) => { buyOrders: Order[]; sellOrders: Order[] };
  getRecentTrades: (marketPairId: string) => Trade[];
  createOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => void;
  createPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => void;
  likePost: (postId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  updateUserBalance: (currency: string, amount: number) => void;
  updateUserPortfolio: (propertyId: string, amount: number) => void;
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
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_MARKET_PRICES' });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const getPropertyById = (id: string) => {
    return state.properties.find(prop => prop.id === id);
  };

  const getMarketPairBySymbol = (symbol: string) => {
    return state.marketPairs.find(pair => pair.symbol === symbol);
  };

  const getUserOrders = (userId: string) => {
    return state.orders.filter(order => order.user_id === userId);
  };

  const getOrderBook = (marketPairId: string) => {
    const orders = state.orders.filter(order => 
      order.market_pair_id === marketPairId && order.status === 'open'
    );
    
    return {
      buyOrders: orders
        .filter(order => order.side === 'buy')
        .sort((a, b) => b.price - a.price)
        .slice(0, 10),
      sellOrders: orders
        .filter(order => order.side === 'sell')
        .sort((a, b) => a.price - b.price)
        .slice(0, 10)
    };
  };

  const getRecentTrades = (marketPairId: string) => {
    return state.trades
      .filter(trade => trade.market_pair_id === marketPairId)
      .sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime())
      .slice(0, 20);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    
    // Simulate order matching (in real app, this would be server-side)
    setTimeout(() => {
      if (Math.random() > 0.7) { // 30% chance of immediate execution
        const trade: Trade = {
          id: `trade-${Date.now()}`,
          market_pair_id: orderData.market_pair_id,
          buy_order_id: orderData.side === 'buy' ? newOrder.id : `order-${Date.now()}-1`,
          sell_order_id: orderData.side === 'sell' ? newOrder.id : `order-${Date.now()}-2`,
          buyer_id: orderData.side === 'buy' ? orderData.user_id : `user-${Math.floor(Math.random() * 1000)}`,
          seller_id: orderData.side === 'sell' ? orderData.user_id : `user-${Math.floor(Math.random() * 1000)}`,
          price: orderData.price || state.marketPairs.find(p => p.id === orderData.market_pair_id)?.current_price || 0,
          amount: orderData.amount,
          total: orderData.total,
          fee: orderData.total * 0.001, // 0.1% fee
          executed_at: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_TRADE', payload: trade });
        dispatch({ type: 'UPDATE_ORDER', payload: { id: newOrder.id, updates: { status: 'filled' } } });
        
        // Add notification
        addNotification({
          user_id: orderData.user_id,
          title: 'Ordem executada',
          message: `Sua ordem de ${orderData.side === 'buy' ? 'compra' : 'venda'} foi executada`,
          notification_type: 'trade',
          is_read: false,
          action_url: '/trade'
        });
      }
    }, 2000);
  };

  const createPost = (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_POST', payload: newPost });
  };

  const likePost = (postId: string) => {
    dispatch({
      type: 'UPDATE_POST',
      payload: {
        id: postId,
        updates: {
          likes_count: state.posts.find(p => p.id === postId)?.likes_count || 0 + 1
        }
      }
    });
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const updateUserBalance = (currency: string, amount: number) => {
    dispatch({ type: 'UPDATE_USER_BALANCE', payload: { currency, amount } });
  };

  const updateUserPortfolio = (propertyId: string, amount: number) => {
    dispatch({ type: 'UPDATE_USER_PORTFOLIO', payload: { propertyId, amount } });
  };

  const value: AppContextType = {
    state,
    dispatch,
    getPropertyById,
    getMarketPairBySymbol,
    getUserOrders,
    getOrderBook,
    getRecentTrades,
    createOrder,
    createPost,
    likePost,
    addNotification,
    updateUserBalance,
    updateUserPortfolio
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};