import { Trade } from '../types/trade';

// Mock data - Replace with actual API calls
const mockTrades: Trade[] = [
  {
    id: '1',
    creator: '0x1234...5678',
    asset: 'BTC',
    amount: 100,
    direction: 'up',
    duration: 5,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    status: 'open',
  },
  {
    id: '2',
    creator: '0xabcd...efgh',
    asset: 'ETH',
    amount: 50,
    direction: 'down',
    duration: 15,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    status: 'open',
  },
];

export const getOpenTrades = async (): Promise<Trade[]> => {
  // TODO: Replace with actual API call
  return mockTrades.filter(trade => trade.status === 'open');
};

export const challengeTrade = async (tradeId: string, amount: number): Promise<void> => {
  // TODO: Implement contract interaction
  console.log('Challenging trade:', tradeId, 'with amount:', amount);
};