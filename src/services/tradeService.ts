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

const provider = new ethers.JsonRpcProvider("https://1rpc.io/MZULgES5tTVJtSBP/glmr");
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
        asset: "ETH",
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
      if (!challengeBetOrder) {
        throw new Error('Challenge bet order function not available');
      }
      
      const tx = await challengeBetOrder({ args: [parseInt(tradeId)] });
      console.log('Challenge transaction:', tx);
      
      console.log('Trade challenged successfully!');
      toast.success('Challenge submitted successfully!');
    } catch (error) {
      console.error('Failed to challenge trade:', error);
      toast.error('Failed to submit challenge');
      throw error; // Re-throw to handle in component
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
  console.log('userHistory:', data);
  return data;
};

type ProxyResult = [bigint, bigint, bigint, bigint];

function extractFields(input: any): ProxyResult {
    const [field0, field1, field2, field3] = input;

    if (
        typeof field0 !== "bigint" ||
        typeof field1 !== "bigint" ||
        typeof field2 !== "bigint" ||
        typeof field3 !== "bigint"
    ) {
        throw new Error("Invalid input structure");
    }

    return [field0, field1, field2, field3];
}

export const getUserBetStats = async (userAddress: Address) => {
    const data = await contract.getUserBetStats(userAddress);
    console.log('userStats:', data);
    
    try {
        const extractedStats = extractFields(data);
        return extractedStats;
    } catch (error) {
        console.error("Error extracting fields:", (error as Error).message);
        throw error; // Rethrow the error for further handling
    }
};
