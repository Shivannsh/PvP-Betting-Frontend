import { Trade } from '../types/trade';
import { ethers } from "ethers";
import { abi } from "../helpers/abi";
import CONTRACT_ADDRESS from "../helpers/deployed_address";
import { Address, useAccount, useContractWrite } from 'wagmi'
import { toast } from 'react-hot-toast'
import { useChallengeTrade } from '../hooks/useChallengeOrder';
import { USDC_ABI } from '../helpers/usdc_abi';
import USDC_ADDRESS from '../helpers/usdc_address';

const contractABI = abi;
const contractAddress = CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/44VAXHBaUMjTDOeGL0wSxN7MqjM5jSP1");
const contract = new ethers.Contract(contractAddress, contractABI, provider);

let mockTrades: Trade[] = [];

async function fetchTrades(): Promise<Trade[]> {
  try {
    const [orderIds, orders] = await contract.getAllPendingOrders();
    const trades: Trade[] = orders.map((order: any, index: number) => {
      const targetPrice = parseFloat(ethers.formatUnits(order[3], 6));
      const direction: 'up' | 'down' = order[4] ? 'up' : 'down';
      const duration = Number(order[5]);
      const createdAt = new Date(Number(order[6]) * 1000).toISOString();
      const expiresAt = new Date(Number(order[6]) * 1000 + duration * 60 * 1000).toISOString();

      return {
        id: orderIds[index].toString(),
        creator: order[0],
        targetPrice,
        asset: "Asset Name",
        amount: parseFloat(ethers.formatUnits(order[2], 6)),
        direction,
        duration,
        createdAt,
        expiresAt,
        status: 'open',
      };
    });

    mockTrades = trades;
    console.log('Fetched and populated mockTrades:', mockTrades);
    return trades;
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
}

fetchTrades().then(() => {
  console.log('mockTrades populated successfully!');
}).catch((err) => {
  console.error('Error populating mockTrades:', err);
});

export const getOpenTrades = async (): Promise<Trade[]> => {
  return mockTrades.filter(trade => trade.status === 'open');
};

export const useTradeService = () => {
  const { write: challengeBetOrder } = useChallengeTrade();
  const { write: approveUSDC } = useContractWrite({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'approve'
  });

  const challengeTrade = async (tradeId: string, amount: number): Promise<void> => {
    console.log('Challenging trade:', tradeId, 'with amount:', amount);
    try {
      await challengeBetOrder({ args: [parseInt(tradeId)] });
      toast.success('Challenge submitted successfully!');
    } catch (error) {
      console.error('Failed to challenge trade:', error);
      toast.error('Failed to submit challenge');
    }
  };

  const approveUSDCToSpend = async (amount: number): Promise<void> => {
    try {
      const tx = await approveUSDC({ args: [CONTRACT_ADDRESS,amount] });

      toast.success('USDC approved successfully!');
    } catch (error) {
      console.error('Failed to approve USDC:', error);
      toast.error('Failed to approve USDC');
    }
  };

  return { challengeTrade, approveUSDCToSpend };
};

export const getUserBetHistory = async (userAddress: Address) => {
  const data = await contract.getUserBetHistory(userAddress);
  return data;
};

export const getUserBetStats = async (userAddress: Address) => {
  const data = await contract.getUserBetStats(userAddress);
  console.log('userStats: fgyhujikojiuhgyfd', data);
  return data;

};
