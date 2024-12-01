import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { Trade } from '../types/trade';
import { formatAddress } from '../utils/wallet';
import { formatDateTime, formatDuration } from '../utils/date';
import { formatAmount } from '../utils/wallet';

interface TradeCardProps {
  trade: Trade;
  onChallenge: (tradeId: string, amount: number) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, onChallenge }) => {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState(trade.amount);

  const handleChallenge = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onChallenge(trade.id, amount);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{trade.asset}/USD</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created by {formatAddress(trade.creator)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            trade.direction === 'up'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {trade.direction === 'up' ? '↑ Up' : '↓ Down'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Amount: </span>
          {formatAmount(trade.amount)}
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Duration: </span>
          {formatDuration(trade.duration)}
        </p>
        <p className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Expires: </span>
          {formatDateTime(trade.expiresAt)}
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="number"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border rounded-lg dark:bg-gray-700"
          placeholder="Enter amount to challenge"
        />
        <button
          onClick={handleChallenge}
          className="w-full btn-primary"
          disabled={!isConnected}
        >
          Challenge Trade
        </button>
      </div>
    </div>
  );
};

export default TradeCard;