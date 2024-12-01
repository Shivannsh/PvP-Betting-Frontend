import React from 'react'

interface LeaderboardEntry {
  rank: number
  address: string
  wins: number
  totalTrades: number
  winRate: number
  totalEarnings: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    address: '0x1234...5678',
    wins: 45,
    totalTrades: 60,
    winRate: 75,
    totalEarnings: 1500,
  },
  {
    rank: 2,
    address: '0xabcd...efgh',
    wins: 38,
    totalTrades: 55,
    winRate: 69,
    totalEarnings: 1200,
  },
  {
    rank: 3,
    address: '0x9876...5432',
    wins: 35,
    totalTrades: 52,
    winRate: 67,
    totalEarnings: 1000,
  },
]

const Leaderboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Top Traders</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-right">Wins</th>
              <th className="px-4 py-2 text-right">Total Trades</th>
              <th className="px-4 py-2 text-right">Win Rate</th>
              <th className="px-4 py-2 text-right">Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((entry) => (
              <tr
                key={entry.address}
                className="border-b dark:border-gray-700"
              >
                <td className="px-4 py-2">#{entry.rank}</td>
                <td className="px-4 py-2">{entry.address}</td>
                <td className="px-4 py-2 text-right">{entry.wins}</td>
                <td className="px-4 py-2 text-right">{entry.totalTrades}</td>
                <td className="px-4 py-2 text-right">{entry.winRate}%</td>
                <td className="px-4 py-2 text-right">{entry.totalEarnings} USDC</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Leaderboard