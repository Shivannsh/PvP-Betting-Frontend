import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import {abi} from '../helpers/abi' // Import your contract ABI
import CONTRACT_ADDRESS from '../helpers/deployed_address' // Import your contract address
import {USDC_ABI} from '../helpers/usdc_abi' // Import USDC ABI
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
  { id: 'BTC', name: 'Bitcoin',address :'0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298' },
  { id: 'ETH', name: 'Ethereum',address: '0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1' }
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
      // Execute the approval transaction first
      await approveUSDC();
      // Then execute the trade creation transaction
    } catch (error) {
      console.error('Transaction failed:', error);
    }
    try{
      await createBetOrder(); 
      onSubmit(formData);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }

  const handleAssetChange = (asset: string) => {
    setFormData({ ...formData, asset })
    onAssetChange?.(asset)
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Asset</label>
        <select
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
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
        <label className="block text-sm font-medium mb-1">Amount (USDC)</label>
        <input
          type="number"
          step="1"
          className="w-full p-2 border rounded-lg dark:bg-gray-700"
          value={formData.amount}
          onChange={(e) => {
            const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
            setFormData({ ...formData, amount: value });
          }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price Prediction (USDC)</label>
        <input
          type="number"
          step="1"
          className="w-full p-2 border rounded-lg dark:bg-gray-700"
          value={formData.pricePrediction}
          onChange={(e) => {
            const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
            setFormData({ ...formData, pricePrediction: value });
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prediction</label>
        <div className="flex gap-4">
          <button
            type="button"
            className={`flex-1 p-2 rounded-lg border ${
              formData.direction === true
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-700'
            }`}
            onClick={() => setFormData({ ...formData, direction: true })}
          >
            Price Up
          </button>
          <button
            type="button"
            className={`flex-1 p-2 rounded-lg border ${
              formData.direction === false
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-700'
            }`}
            onClick={() => setFormData({ ...formData, direction: false })}
          >
            Price Down
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Duration</label>
        <select
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700"
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