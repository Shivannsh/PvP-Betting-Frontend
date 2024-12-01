import axios from 'axios'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export interface PriceData {
  prices: [number, number][] // [timestamp, price]
}

export const getHistoricalPrices = async (
  coinId: string,
  days: number = 1,
  interval: string = 'hourly'
): Promise<PriceData> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_BASE}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days,
          interval,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching price data:', error)
    throw error
  }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const calculatePriceChange = (
  startPrice: number,
  endPrice: number
): number => {
  return ((endPrice - startPrice) / startPrice) * 100
}