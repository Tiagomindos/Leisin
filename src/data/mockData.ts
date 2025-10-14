// Mock data para desenvolvimento e testes
export const mockProperties = [
  {
    id: 'prop-1',
    name: 'Residencial Sunset Boulevard',
    description: 'Condomínio de luxo com 200 unidades, localizado na Zona Sul de São Paulo',
    property_type: 'residential',
    address: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    coordinates: { lat: -23.5615, lng: -46.6565 },
    total_area: 15000,
    total_units: 200,
    construction_status: 'completed',
    total_value: 25000000,
    token_symbol: 'RESID-BRL',
    total_tokens: 1000000,
    available_tokens: 750000,
    price_per_token: 125.50,
    min_investment: 1000,
    expected_yield: 12.5,
    rental_status: 'full',
    images: [
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    documents: [],
    vyner_3d_url: null,
    listed_at: '2024-01-15T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-10-14T00:00:00Z'
  },
  {
    id: 'prop-2',
    name: 'Shopping Central Plaza',
    description: 'Shopping center com 150 lojas e 3 pisos de estacionamento',
    property_type: 'commercial',
    address: {
      street: 'Rua Augusta, 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000'
    },
    coordinates: { lat: -22.9068, lng: -43.1729 },
    total_area: 25000,
    total_units: 150,
    construction_status: 'completed',
    total_value: 45000000,
    token_symbol: 'SHOP-BRL',
    total_tokens: 1800000,
    available_tokens: 1200000,
    price_per_token: 89.20,
    min_investment: 2000,
    expected_yield: 14.8,
    rental_status: 'full',
    images: [
      'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    documents: [],
    vyner_3d_url: null,
    listed_at: '2024-02-01T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-10-14T00:00:00Z'
  },
  {
    id: 'prop-3',
    name: 'Loteamento Bosque Real',
    description: 'Loteamento residencial com 500 lotes de 300m² cada',
    property_type: 'land',
    address: {
      street: 'Estrada do Bosque, Km 15',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13000-000'
    },
    coordinates: { lat: -22.9056, lng: -47.0608 },
    total_area: 150000,
    total_units: 500,
    construction_status: 'planning',
    total_value: 15000000,
    token_symbol: 'LOTE-BRL',
    total_tokens: 600000,
    available_tokens: 400000,
    price_per_token: 45.20,
    min_investment: 500,
    expected_yield: 8.2,
    rental_status: 'none',
    images: [
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    documents: [],
    vyner_3d_url: null,
    listed_at: '2024-03-01T00:00:00Z',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-10-14T00:00:00Z'
  }
];

export const mockMarketPairs = [
  {
    id: 'pair-1',
    symbol: 'RESID-BRL',
    base_asset: 'RESID',
    quote_asset: 'BRL',
    asset_type: 'property',
    property_id: 'prop-1',
    current_price: 125.50,
    price_change_24h: 18.5,
    volume_24h: 2500000,
    high_24h: 128.90,
    low_24h: 118.20,
    liquidity_score: 85,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-10-14T14:30:00Z'
  },
  {
    id: 'pair-2',
    symbol: 'SHOP-BRL',
    base_asset: 'SHOP',
    quote_asset: 'BRL',
    asset_type: 'property',
    property_id: 'prop-2',
    current_price: 89.20,
    price_change_24h: 15.2,
    volume_24h: 1800000,
    high_24h: 92.50,
    low_24h: 85.10,
    liquidity_score: 92,
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-10-14T14:30:00Z'
  },
  {
    id: 'pair-3',
    symbol: 'LOTE-BRL',
    base_asset: 'LOTE',
    quote_asset: 'BRL',
    asset_type: 'property',
    property_id: 'prop-3',
    current_price: 45.20,
    price_change_24h: -2.1,
    volume_24h: 800000,
    high_24h: 47.80,
    low_24h: 44.50,
    liquidity_score: 65,
    is_active: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-10-14T14:30:00Z'
  },
  {
    id: 'pair-4',
    symbol: 'BTC-BRL',
    base_asset: 'BTC',
    quote_asset: 'BRL',
    asset_type: 'crypto',
    property_id: null,
    current_price: 285000.00,
    price_change_24h: 3.2,
    volume_24h: 5000000,
    high_24h: 290000.00,
    low_24h: 275000.00,
    liquidity_score: 95,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-10-14T14:30:00Z'
  },
  {
    id: 'pair-5',
    symbol: 'ETH-BRL',
    base_asset: 'ETH',
    quote_asset: 'BRL',
    asset_type: 'crypto',
    property_id: null,
    current_price: 18500.00,
    price_change_24h: 5.8,
    volume_24h: 3200000,
    high_24h: 19200.00,
    low_24h: 17800.00,
    liquidity_score: 88,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-10-14T14:30:00Z'
  }
];

export const mockOrders = [
  {
    id: 'order-1',
    user_id: 'user-1',
    market_pair_id: 'pair-1',
    order_type: 'limit',
    side: 'buy',
    price: 125.00,
    amount: 100,
    filled_amount: 0,
    remaining_amount: 100,
    total: 12500.00,
    status: 'open',
    created_at: '2024-10-14T14:25:00Z',
    updated_at: '2024-10-14T14:25:00Z'
  },
  {
    id: 'order-2',
    user_id: 'user-2',
    market_pair_id: 'pair-1',
    order_type: 'limit',
    side: 'sell',
    price: 126.00,
    amount: 50,
    filled_amount: 0,
    remaining_amount: 50,
    total: 6300.00,
    status: 'open',
    created_at: '2024-10-14T14:20:00Z',
    updated_at: '2024-10-14T14:20:00Z'
  }
];

export const mockTrades = [
  {
    id: 'trade-1',
    market_pair_id: 'pair-1',
    buy_order_id: 'order-1',
    sell_order_id: 'order-2',
    buyer_id: 'user-1',
    seller_id: 'user-2',
    price: 125.50,
    amount: 25,
    total: 3137.50,
    fee: 3.14,
    executed_at: '2024-10-14T14:30:00Z'
  }
];

export const mockNews = [
  {
    id: 'news-1',
    title: 'Mercado imobiliário cresce 23% no primeiro trimestre de 2025',
    content: 'O mercado imobiliário brasileiro apresentou crescimento recorde...',
    summary: 'Crescimento de 23% no primeiro trimestre, impulsionado por investimentos em tokenização',
    category: 'real_estate',
    author: 'T3 Core News',
    source_url: 'https://t3core.com/news/mercado-imobiliario-cresce-23',
    image_url: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800',
    views_count: 15420,
    published_at: '2024-10-14T12:00:00Z',
    created_at: '2024-10-14T12:00:00Z'
  },
  {
    id: 'news-2',
    title: 'Bitcoin ultrapassa marca de $95.000 impulsionado por demanda institucional',
    content: 'O Bitcoin atingiu nova máxima histórica...',
    summary: 'BTC supera $95k com forte demanda institucional e adoção corporativa',
    category: 'crypto',
    author: 'Crypto News',
    source_url: 'https://cryptonews.com/bitcoin-95000',
    image_url: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800',
    views_count: 28450,
    published_at: '2024-10-14T10:30:00Z',
    created_at: '2024-10-14T10:30:00Z'
  }
];

export const mockPosts = [
  {
    id: 'post-1',
    user_id: 'user-1',
    content: 'Acabei de fazer análise completa do Residencial Sunset. ROI projetado de 18% ao ano com valorização + aluguel. Thread completo abaixo 👇',
    images: [],
    post_type: 'analysis',
    likes_count: 247,
    comments_count: 38,
    shares_count: 12,
    created_at: '2024-10-14T12:00:00Z',
    updated_at: '2024-10-14T12:00:00Z'
  },
  {
    id: 'post-2',
    user_id: 'user-2',
    content: 'Novidade! Lançamos hoje o Shopping Central Plaza com tokenização completa. 500 cotas disponíveis, yield projetado de 14,8% ao ano. Veja os detalhes:',
    images: ['https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=600'],
    post_type: 'announcement',
    likes_count: 512,
    comments_count: 89,
    shares_count: 45,
    created_at: '2024-10-14T10:00:00Z',
    updated_at: '2024-10-14T10:00:00Z'
  }
];

export const mockNotifications = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    title: 'Ordem executada',
    message: 'Sua ordem de compra de 100 RESID foi executada a R$ 125,50',
    notification_type: 'trade',
    is_read: false,
    action_url: '/trade',
    created_at: '2024-10-14T14:30:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    title: 'Novo ativo disponível',
    message: 'Loteamento Bosque Real agora está disponível para investimento',
    notification_type: 'news',
    is_read: false,
    action_url: '/markets',
    created_at: '2024-10-14T13:00:00Z'
  }
];