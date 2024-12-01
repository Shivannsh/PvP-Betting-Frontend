export interface Trade {
  id: string;
  creator: string;
  asset: string;
  amount: number;
  direction: 'up' | 'down';
  duration: number;
  createdAt: string;
  expiresAt: string;
  status: 'open' | 'matched' | 'completed' | 'expired';
}

export interface ChallengeTradeData {
  tradeId: string;
  amount: number;
}