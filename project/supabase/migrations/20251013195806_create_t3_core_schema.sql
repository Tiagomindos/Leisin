/*
  # T3 Core Bank & Exchange - Complete Database Schema

  ## Overview
  Complete database structure for a super-app combining real estate tokenization,
  crypto exchange, digital banking, and social networking.

  ## New Tables

  ### 1. User Management
    - `profiles` - Extended user profiles with KYC data
    - `kyc_documents` - KYC verification documents
    - `user_balances` - Multi-currency wallet balances

  ### 2. Real Estate Assets
    - `properties` - Real estate properties/developments
    - `property_tokens` - Tokenized property shares
    - `property_transactions` - Buy/sell transactions
    - `spes` - Special Purpose Entities for developments

  ### 3. Market & Trading
    - `market_pairs` - Trading pairs (IMOB/BRL, BTC/USDT, etc)
    - `orders` - Order book entries
    - `trades` - Executed trades
    - `price_history` - Historical price data

  ### 4. Banking
    - `bank_accounts` - Digital bank accounts
    - `transactions` - All financial transactions (Pix, transfers, payments)
    - `cards` - Virtual and physical cards
    - `loans` - Credit lines and loans

  ### 5. Social Network
    - `posts` - Social feed posts
    - `comments` - Post comments
    - `likes` - Post and comment likes
    - `follows` - User follow relationships
    - `communities` - Investment groups/communities

  ### 6. News & Content
    - `news_articles` - Market news and analysis
    - `ai_insights` - AI-generated market insights
    - `notifications` - User notifications

  ## Security
    - RLS enabled on all tables
    - Policies for authenticated user access
    - Role-based access for different user types
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USER MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  cpf_cnpj text UNIQUE,
  user_type text DEFAULT 'investor' CHECK (user_type IN ('investor', 'developer', 'admin')),
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'reviewing', 'approved', 'rejected')),
  risk_score integer DEFAULT 50,
  reputation_score integer DEFAULT 0,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'proof_address', 'selfie', 'income_proof')),
  document_url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_balances (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  currency text NOT NULL,
  available_balance numeric(20, 8) DEFAULT 0 NOT NULL,
  locked_balance numeric(20, 8) DEFAULT 0 NOT NULL,
  total_balance numeric(20, 8) GENERATED ALWAYS AS (available_balance + locked_balance) STORED,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

-- ============================================================
-- REAL ESTATE ASSETS
-- ============================================================

CREATE TABLE IF NOT EXISTS spes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  description text,
  legal_documents jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  spe_id uuid REFERENCES spes(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  property_type text NOT NULL CHECK (property_type IN ('residential', 'commercial', 'land', 'mixed')),
  address jsonb NOT NULL,
  coordinates jsonb,
  total_area numeric(10, 2),
  total_units integer,
  construction_status text DEFAULT 'planning' CHECK (construction_status IN ('planning', 'construction', 'completed')),
  total_value numeric(20, 2) NOT NULL,
  token_symbol text UNIQUE NOT NULL,
  total_tokens bigint NOT NULL,
  available_tokens bigint NOT NULL,
  price_per_token numeric(20, 8) NOT NULL,
  min_investment numeric(20, 2) DEFAULT 100,
  expected_yield numeric(5, 2),
  rental_status text DEFAULT 'none' CHECK (rental_status IN ('none', 'partial', 'full')),
  images jsonb DEFAULT '[]'::jsonb,
  documents jsonb DEFAULT '[]'::jsonb,
  vyner_3d_url text,
  listed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tokens_owned bigint NOT NULL DEFAULT 0,
  average_price numeric(20, 8) NOT NULL,
  total_invested numeric(20, 2) NOT NULL,
  current_value numeric(20, 2) NOT NULL,
  total_yield numeric(20, 2) DEFAULT 0,
  acquired_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- ============================================================
-- MARKET & TRADING
-- ============================================================

CREATE TABLE IF NOT EXISTS market_pairs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol text UNIQUE NOT NULL,
  base_asset text NOT NULL,
  quote_asset text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('property', 'crypto', 'hybrid', 'fund')),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  current_price numeric(20, 8) NOT NULL,
  price_change_24h numeric(10, 4) DEFAULT 0,
  volume_24h numeric(20, 2) DEFAULT 0,
  high_24h numeric(20, 8),
  low_24h numeric(20, 8),
  liquidity_score integer DEFAULT 50,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  market_pair_id uuid REFERENCES market_pairs(id) ON DELETE CASCADE NOT NULL,
  order_type text NOT NULL CHECK (order_type IN ('limit', 'market', 'stop_limit')),
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  price numeric(20, 8),
  amount numeric(20, 8) NOT NULL,
  filled_amount numeric(20, 8) DEFAULT 0,
  remaining_amount numeric(20, 8) NOT NULL,
  total numeric(20, 8) NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'partial', 'filled', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_pair_id uuid REFERENCES market_pairs(id) ON DELETE CASCADE NOT NULL,
  buy_order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  sell_order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  price numeric(20, 8) NOT NULL,
  amount numeric(20, 8) NOT NULL,
  total numeric(20, 8) NOT NULL,
  fee numeric(20, 8) DEFAULT 0,
  executed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_pair_id uuid REFERENCES market_pairs(id) ON DELETE CASCADE NOT NULL,
  open_price numeric(20, 8) NOT NULL,
  high_price numeric(20, 8) NOT NULL,
  low_price numeric(20, 8) NOT NULL,
  close_price numeric(20, 8) NOT NULL,
  volume numeric(20, 8) NOT NULL,
  interval text NOT NULL CHECK (interval IN ('1m', '5m', '15m', '1h', '4h', '1d', '1w')),
  timestamp timestamptz NOT NULL,
  UNIQUE(market_pair_id, interval, timestamp)
);

-- ============================================================
-- BANKING
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_number text UNIQUE NOT NULL,
  account_type text DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings')),
  balance numeric(20, 2) DEFAULT 0 NOT NULL,
  currency text DEFAULT 'BRL',
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES bank_accounts(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('pix', 'transfer', 'payment', 'deposit', 'withdrawal', 'fee')),
  amount numeric(20, 2) NOT NULL,
  currency text DEFAULT 'BRL',
  description text,
  recipient_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_info jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES bank_accounts(id) ON DELETE CASCADE NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('virtual', 'physical')),
  card_number text UNIQUE NOT NULL,
  card_brand text DEFAULT 'mastercard',
  cvv text NOT NULL,
  expiry_date text NOT NULL,
  credit_limit numeric(20, 2) DEFAULT 0,
  available_credit numeric(20, 2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  loan_type text NOT NULL CHECK (loan_type IN ('personal', 'collateral', 'property_backed')),
  amount numeric(20, 2) NOT NULL,
  interest_rate numeric(5, 4) NOT NULL,
  installments integer NOT NULL,
  paid_installments integer DEFAULT 0,
  collateral_type text CHECK (collateral_type IN ('property_tokens', 'crypto', 'none')),
  collateral_value numeric(20, 2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'paid', 'defaulted')),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- SOCIAL NETWORK
-- ============================================================

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  post_type text DEFAULT 'general' CHECK (post_type IN ('general', 'analysis', 'news', 'question')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text CHECK (category IN ('residential', 'commercial', 'crypto', 'general', 'construction')),
  members_count integer DEFAULT 1,
  is_private boolean DEFAULT false,
  cover_image text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- ============================================================
-- NEWS & CONTENT
-- ============================================================

CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  category text NOT NULL CHECK (category IN ('real_estate', 'crypto', 'economy', 'construction', 'market')),
  author text,
  source_url text,
  image_url text,
  views_count integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_type text NOT NULL CHECK (insight_type IN ('market_analysis', 'property_alert', 'price_prediction', 'risk_alert')),
  title text NOT NULL,
  content text NOT NULL,
  confidence_score numeric(3, 2),
  related_property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  related_market_id uuid REFERENCES market_pairs(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('trade', 'payment', 'kyc', 'social', 'news', 'alert')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE spes ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User Balances
CREATE POLICY "Users can view own balances"
  ON user_balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own balances"
  ON user_balances FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own balances"
  ON user_balances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Properties (public read, developer write)
CREATE POLICY "Anyone can view listed properties"
  ON properties FOR SELECT
  TO authenticated
  USING (listed_at IS NOT NULL);

CREATE POLICY "Developers can manage own properties"
  ON properties FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM spes
      WHERE spes.id = properties.spe_id
      AND spes.developer_id = auth.uid()
    )
  );

-- Property Tokens
CREATE POLICY "Users can view own property tokens"
  ON property_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Market Pairs (public read)
CREATE POLICY "Anyone can view active market pairs"
  ON market_pairs FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Bank Accounts
CREATE POLICY "Users can view own bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cards
CREATE POLICY "Users can view own cards"
  ON cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Posts (public read, owner write)
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Likes
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- News Articles (public read)
CREATE POLICY "Anyone can view news articles"
  ON news_articles FOR SELECT
  TO authenticated
  USING (true);

-- Notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_properties_token_symbol ON properties(token_symbol);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listed_at ON properties(listed_at);
CREATE INDEX IF NOT EXISTS idx_market_pairs_symbol ON market_pairs(symbol);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_trades_market_pair_id ON trades(market_pair_id);
CREATE INDEX IF NOT EXISTS idx_trades_executed_at ON trades(executed_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, is_read);