import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getUserBetStats, getUserBetHistory } from '../services/tradeService'
import BetCard from '../components/BetCard'

// Define a type for the structure of each user history entry
interface UserHistory {
    sender: string;
    receiver: string;
    amount: bigint;
    fee: bigint;
    success: boolean;
    confirmations: bigint;
    timestamp: bigint;
}

// Function to extract user history from a proxy result
function extractUserHistory(proxyResult: any): UserHistory[] {
    const userHistory: UserHistory[] = [];

    for (let i = 0; i < proxyResult.length; i++) {
        const entry = proxyResult[i];

        if (entry && typeof entry === "object") {
            userHistory.push({
                sender: entry[0],
                receiver: entry[1],
                amount: entry[2],
                fee: entry[3],
                success: entry[4],
                confirmations: entry[5],
                timestamp: entry[6],
            });
        }
    }

    return userHistory;
}

const Dashboard: React.FC = () => {
    const { isConnected, address } = useAccount()
    const [betStats, setBetStats] = useState({
        totalBetsPlaced: 0,
        totalBetsWon: 0,
        totalAmountWon: 0,
        totalAmountBet: 0,
    })
    const [userHistory, setUserHistory] = useState<UserHistory[]>([])

    useEffect(() => {
        const fetchBetStats = async () => {
            if (isConnected && address) {
                const stats = await getUserBetStats(address)
                setBetStats({
                    totalBetsPlaced: Number(stats[0]),
                    totalBetsWon: Number(stats[1]),
                    totalAmountWon: Number(stats[2]) / Math.pow(10, 6),
                    totalAmountBet: Number(stats[3]) / Math.pow(10, 6),
                })

                const historyData = await getUserBetHistory(address)
                const extractedHistory = extractUserHistory(historyData)
                setUserHistory(extractedHistory)
            }
        }

        fetchBetStats()
    }, [isConnected, address])

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
            <h2 className="text-3xl font-bold">Your Trades</h2>
            <div className="grid gap-6">
                <div className="card dark:bg-stone-800">
                    <h3 className="text-lg font-semibold">Bet Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <p>Total Bets Placed: {betStats.totalBetsPlaced}</p>
                            <p>Total Bets Won: {betStats.totalBetsWon}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <p>Total Amount Won: {betStats.totalAmountWon} USDC</p>
                            <p>Total Amount Bet: {betStats.totalAmountBet} USDC</p>
                        </div>
                    </div>
                </div>


                <h2 className="text-2xl font-bold">User Bet History</h2>
                    {userHistory.length > 0 ? (
                        <div className='flex flex-row flex-wrap gap-6'>
                            {userHistory.map((entry, index) => (
                                <BetCard
                                    key={index}
                                    sender={entry.sender}
                                    receiver={entry.receiver}
                                    amount={entry.amount}
                                    fee={entry.fee}
                                    success={entry.success}
                                    confirmations={entry.confirmations}
                                    timestamp={entry.timestamp}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No bet history available.</p>
                    )}
                </div>
        </div>
    )
}

export default Dashboard