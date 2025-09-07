// Core blockchain and trading types
export interface BlockchainAddress {
  id: string;
  address: string;
  name?: string;
  avatar?: string;
  isVerified: boolean;
  followers: number;
  totalProfit: number;
  roi: number;
  winRate: number;
  totalTrades: number;
  avgHoldTime: number;
  riskScore: number;
  chain: string;
  tags: string[];
  createdAt: string;
  lastActive: string;
}

export interface Transaction {
  id: string;
  hash: string;
  fromAddress: string;
  toAddress?: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  amount: number;
  usdValue: number;
  type: 'BUY' | 'SELL' | 'TRANSFER';
  profit?: number;
  profitPercent?: number;
  timestamp: string;
  blockNumber: number;
  gasUsed: number;
  gasPrice: number;
  chain: string;
  dexName?: string;
}

export interface CopyTradeConfig {
  id: string;
  userId: string;
  targetAddress: string;
  isActive: boolean;
  copyMethod: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'PROPORTIONAL';
  copyAmount: number;
  maxPositionSize: number;
  stopLossPercent?: number;
  takeProfitPercent?: number;
  delaySeconds: number;
  allowedTokens?: string[];
  excludedTokens?: string[];
  minLiquidity: number;
  slippageTolerance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  totalProfit: number;
  totalProfitPercent: number;
  dailyPnl: number;
  dailyPnlPercent: number;
  activePositions: number;
  totalTrades: number;
  winRate: number;
  followedAddresses: number;
  bestPerformer: string;
  worstPerformer: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  userId: string;
  targetAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  value: number;
  profit: number;
  profitPercent: number;
  openedAt: string;
  isOpen: boolean;
  copyTradeId: string;
  originalTxHash: string;
  chain: string;
}

export interface AddressAnalytics {
  address: string;
  performanceScore: number;
  consistencyScore: number;
  riskScore: number;
  diversificationScore: number;
  liquidityScore: number;
  recentPerformance: number;
  monthlyReturns: number[];
  topTokens: Array<{
    symbol: string;
    profit: number;
    trades: number;
  }>;
  tradingPatterns: {
    preferredTimeframes: string[];
    averagePositionSize: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  socialMetrics: {
    mentions: number;
    sentiment: number;
    followers: number;
  };
}

export interface MarketData {
  tokenAddress: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  lastUpdated: string;
}

export interface WebSocketMessage {
  type: 'TRANSACTION' | 'PRICE_UPDATE' | 'PORTFOLIO_UPDATE' | 'ALERT';
  data: any;
  timestamp: string;
  addressId?: string;
  userId?: string;
}

export interface UserSettings {
  userId: string;
  notifications: {
    trades: boolean;
    profits: boolean;
    losses: boolean;
    alerts: boolean;
  };
  trading: {
    defaultCopyAmount: number;
    maxDailyTrades: number;
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
    autoStopLoss: boolean;
    autoTakeProfit: boolean;
  };
  display: {
    currency: 'USD' | 'ETH' | 'BTC';
    theme: 'light' | 'dark' | 'system';
    refreshInterval: number;
  };
  chains: string[];
  apiKeys: {
    [key: string]: string;
  };
}

export interface Alert {
  id: string;
  userId: string;
  type: 'PROFIT_TARGET' | 'STOP_LOSS' | 'NEW_TRADE' | 'HIGH_VOLUME' | 'CUSTOM';
  title: string;
  message: string;
  addressId?: string;
  positionId?: string;
  isRead: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  data?: any;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AddressFilters {
  minRoi?: number;
  maxRoi?: number;
  minWinRate?: number;
  maxRiskScore?: number;
  chains?: string[];
  tags?: string[];
  minFollowers?: number;
  timeRange?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TransactionFilters {
  addressId?: string;
  tokenSymbol?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  chain?: string;
  profitOnly?: boolean;
  page?: number;
  limit?: number;
}

// Chart data types
export interface ChartData {
  timestamp: string;
  value: number;
  profit?: number;
  volume?: number;
  [key: string]: any;
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  volatility: number;
  beta: number;
}