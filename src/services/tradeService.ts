import { Trade } from '../types/trade';
import { ethers } from "ethers";
import { abi } from "../helpers/abi";
import CONTRACT_ADDRESS from "../helpers/deployed_address"; // Changed to default import
import { Address, useAccount, useContractWrite } from 'wagmi'
import { toast } from 'react-hot-toast'
import { useChallengeTrade } from '../hooks/useChallengeOrder';
import {USDC_ABI} from '../helpers/usdc_abi' // Import USDC ABI
import USDC_ADDRESS from '../helpers/usdc_address' // Import USDC contract address


const contractABI = abi;
const contractAddress = CONTRACT_ADDRESS;

// Ethereum Provider (Replace with your provider, e.g., Infura, Alchemy, etc.)
const provider = new ethers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/44VAXHBaUMjTDOeGL0wSxN7MqjM5jSP1");

// Initialize the smart contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Define the mockTrades array
let mockTrades: Trade[] = [];

async function fetchTrades(): Promise<Trade[]> {
  try {
    // Call the smart contract function
    const [orderIds, orders] = await contract.getAllPendingOrders();

    // Deserialize the data
    const trades: Trade[] = orders.map((order: any, index: number) => {
      const targetPrice = parseFloat(ethers.formatUnits(order[3],6)); // Adjust decimals if needed
      const direction: 'up' | 'down' = order[4] ? 'up' : 'down'; // Assuming true = "up", false = "down"
      const duration = Number(order[5]); // Convert BigInt to number
      const createdAt = new Date(Number(order[6]) * 1000).toISOString(); // Convert to ISO string
      const expiresAt = new Date(Number(order[6]) * 1000 + duration * 60 * 1000).toISOString();

      return {
        id: orderIds[index].toString(), // Convert BigInt to string
        creator: order[0],
        targetPrice,
        asset: "Asset Name", // Replace with logic to map asset (e.g., based on token address)
        amount: parseFloat(ethers.formatUnits(order[2],6)), // Adjust decimals if needed
        direction,
        duration,
        createdAt,
        expiresAt,
        status: 'open', // Assuming "open" based on pending orders
      };
    });

    // Update the mockTrades array
    mockTrades = trades;

    // Log trades for debugging
    console.log('Fetched and populated mockTrades:', mockTrades);

    return trades;
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
}


// Call fetchTrades to populate mockTrades
fetchTrades().then(() => {
  console.log('mockTrades populated successfully!');
  console.log('Fetched and populated mockTrades:', mockTrades);
}).catch((err) => {
  console.error('Error populating mockTrades:', err);
});

// getOpenTrades function remains unchanged
export const getOpenTrades = async (): Promise<Trade[]> => {
  // TODO: Replace with actual API call
  return mockTrades.filter(trade => trade.status === 'open');
};

export const useTradeService = () => {
  const { write: challengeBetOrder } = useChallengeTrade();

  const challengeTrade = async (tradeId: string, amount: number): Promise<void> => {
    console.log('Challenging trade:', tradeId, 'with amount:', amount);

    const { write: approveUSDC } = useContractWrite({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, amount * Math.pow(10, 6)], // Approve the contract to spend USDC
    });

    try {
      await approveUSDC();
      toast.success('USDC approved successfully!');

      await challengeBetOrder({ args: [parseInt(tradeId)] }); // Ensure correct argument structure
      toast.success('Challenge submitted successfully!');
    } catch (error) {
      console.error('Failed to challenge trade:', error);
      toast.error('Failed to submit challenge');
    }
  };

  return { challengeTrade };
};

export const getUserBetHistory = async (userAddress: Address) => {
  const data = await contract.getUserBetHistory(userAddress);
  console.log('userHistory nhbgbhmgbhkmjhgcfyvgbuhnjmnedfgh', data);
};

export const getUserBetStats = async (userAddress: Address) => {
  const data =  await contract.getUserBetStats(userAddress);
  console.log('userHistory hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', data);
};
