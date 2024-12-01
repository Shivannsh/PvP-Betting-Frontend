import React from 'react';
import { Trade } from '../types/trade';
import TradeCard from './TradeCard';

interface OpenTradesListProps {
  trades: Trade[];
  onChallenge: (tradeId: string, amount: number) => void;
}

const OpenTradesList: React.FC<OpenTradesListProps> = ({ trades, onChallenge }) => {
  if (trades.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        No open trades available
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trades.map((trade) => (
        <TradeCard
          key={trade.id}
          trade={trade}
          onChallenge={onChallenge}
        />
      ))}
    </div>
  );
};

export default OpenTradesList;