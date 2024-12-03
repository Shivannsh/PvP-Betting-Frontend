import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAccount, useContractWrite } from 'wagmi'
import { abi } from '../helpers/abi' // Import your contract ABI
import CONTRACT_ADDRESS from '../helpers/deployed_address' // Import your contract address
import { USDC_ABI } from '../helpers/usdc_abi' // Import USDC ABI
import USDC_ADDRESS from '../helpers/usdc_address' // Import USDC contract address

interface CreateTradeFormProps {
  onSubmit: (data: TradeFormData) => void
  onAssetChange?: (asset: string) => void
}

export interface TradeFormData {
  asset: string
  amount: number
  pricePrediction: number
  direction: boolean
  duration: number
}

const SUPPORTED_ASSETS = [
  { id: 'BTC', name: 'Bitcoin', address: '0x8c4425e141979c66423A83bE2ee59135864487Eb' },
  { id: 'ETH', name: 'Ethereum', address: '0x9ce2388a1696e22F870341C3FC1E89710C7569B5' },
  {id: 'DOT' , name : 'DOT' , address : '0x1466b4bD0C4B6B8e1164991909961e0EE6a66d8c'}
]

const DURATIONS = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 60, label: '1 hour' }
]

const CreateTradeForm: React.FC<CreateTradeFormProps> = ({ onSubmit, onAssetChange }) => {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState<TradeFormData>({
    asset: 'BTC',
    amount: 100,
    pricePrediction: 0,
    direction: true,
    duration: 5,
  })

  const selectedAsset = SUPPORTED_ASSETS.find(asset => asset.id === formData.asset);

  const { write: createBetOrder } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'createBetOrder',
    args: [
      selectedAsset?.address, // Use the selected asset's address
      formData.amount * Math.pow(10, 6),
      formData.pricePrediction * Math.pow(10, 6),
      formData.direction,
      formData.duration * 60,
    ],
  })

  console.log(selectedAsset?.address);
  console.log(selectedAsset?.address);
  console.log(selectedAsset?.address);
  console.log(selectedAsset?.address);

  const { write: approveUSDC } = useContractWrite({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'approve',
    args: [CONTRACT_ADDRESS, formData.amount * Math.pow(10, 6)], // Approve the contract to spend USDC
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (formData.amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      // Execute both transactions in parallel
      const approvalPromise = approveUSDC();
      const tradePromise = createBetOrder();

      await Promise.all([approvalPromise, tradePromise]);

      toast.success('USDC approved and bet order created successfully!');
      onSubmit(formData);
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Failed to create bet order');
    }
  }

  const handleAssetChange = (asset: string) => {
    setFormData({ ...formData, asset })
    onAssetChange?.(asset)
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 dark:bg-stone-800">
      <div>
        <label className="block text-sm font-medium mb-1">Select Asset</label>
        <select
          className="w-full p-2 rounded-lg bg-white dark:bg-stone-700"
          value={formData.asset}
          onChange={(e) => handleAssetChange(e.target.value)}
        >
          {SUPPORTED_ASSETS.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-m font-medium mb-1">Amount (USDC)</label>
        <input
          type="number"
          step="0.1"
          className="w-full p-2 border-2 border-pink-500 rounded-lg dark:bg-pink-500 font-bold text-lg" 
          value={formData.amount}
          onChange={(e) => {
            const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
            setFormData({ ...formData, amount: value });
          }}
        />
      </div>
      
      <div>
  <label className="block text-sm font-medium mb-1">Prediction (More than or Less than)</label>
  <div className="flex gap-4">
    <button
      type="button"
      className={`flex-2 px-12 rounded-lg ${
        formData.direction === true
          ? 'bg-green-500 text-white'
          : 'bg-white dark:bg-gray-700'
      }`}
      onClick={() => setFormData({ ...formData, direction: true })}
    >
      More
    </button>
    <button
      type="button"
      className={`flex-2 px-12 rounded-lg ${
        formData.direction === false
          ? 'bg-red-500 text-white'
          : 'bg-white dark:bg-gray-700'
      }`}
      onClick={() => setFormData({ ...formData, direction: false })}
    >
      Less
    </button>
    <input
      type="number"  // Keep as number for better decimal support
      step="0.01"  // Allow decimal input
      className="flex-2 w-80 p-2 rounded-lg dark:bg-stone-700"
      value={formData.pricePrediction}
      onChange={(e) => {
        // Parse the input to a float to ensure we handle decimals
        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
        // Only update if value is a valid number (including decimals)
        if (!isNaN(value)) {
          setFormData({ ...formData, pricePrediction: value });
        }
      }}
      placeholder="Enter price prediction"
    />
  </div>
</div>




      <div>
        <label className="block text-sm font-medium mb-1">Duration</label>
        <select
          className="w-full p-2 rounded-lg bg-white dark:bg-stone-700"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
        >
          {DURATIONS.map((duration) => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full btn-primary"
        disabled={!isConnected}
      >
        Create Trade
      </button>
    </form>
  )
}

export default CreateTradeForm