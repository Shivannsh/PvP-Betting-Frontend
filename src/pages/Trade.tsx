import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import CreateTradeForm, { TradeFormData } from '../components/CreateTradeForm';
import TradingViewChart from '../components/TradingViewChart';
import OpenTradesList from '../components/OpenTradesList';
import { getOpenTrades } from '../services/tradeService';
import { Trade } from '../types/trade';

const Trade: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const openTrades = await getOpenTrades();
        setTrades(openTrades);
      } catch (error) {
        console.error('Failed to load trades:', error);
        toast.error('Failed to load open trades');
      }
    };

    loadTrades();
  }, []);

  const handleCreateTrade = (formData: TradeFormData) => {
    console.log('Creating trade with data:', formData);
    // TODO: Implement contract interaction
  };

  const handleChallenge = async (tradeId: string, amount: number) => {
    // try {
    //   await challengeTrade(tradeId, amount);
    //   toast.success('Challenge submitted successfully!');
    // } catch (error) {
    //   console.error('Failed to challenge trade:', error);
    //   toast.error('Failed to submit challenge');
    // }
  };

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Create New Trade</h2>
          <CreateTradeForm 
            onSubmit={handleCreateTrade}
            onAssetChange={(asset) => setSelectedAsset(asset)}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Price Chart</h2>
          <TradingViewChart 
            symbol={selectedAsset}
            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Open Trades</h2>
        <OpenTradesList trades={trades} onChallenge={handleChallenge} />
      </div>
    </div>
  );
};

export default Trade;