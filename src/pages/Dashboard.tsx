import React from 'react'
import { useAccount } from 'wagmi'

interface Trade {
  id: string
  asset: string
  amount: number
  direction: 'up' | 'down'
  status: 'active' | 'won' | 'lost'
  createdAt: string
  expiresAt: string
}

const mockTrades: Trade[] = [
  {
    id: '1',
    asset: 'BTC',
    amount: 100,
    direction: 'up',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: '2',
    asset: 'ETH',
    amount: 50,
    direction: 'down',
    status: 'won',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    expiresAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

const Dashboard: React.FC = () => {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to view your dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Your Trades</h2>
      
      <div className="grid gap-4">
        {mockTrades.map((trade) => (
          <div key={trade.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{trade.asset}/USD</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Amount: {trade.amount} USDC
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    trade.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : trade.status === 'won'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {trade.direction === 'up' ? '↑ Up' : '↓ Down'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard