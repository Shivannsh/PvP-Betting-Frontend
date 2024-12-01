import { useQuery } from '@tanstack/react-query'
import { getHistoricalPrices } from '../utils/price'

export const usePriceData = (coinId: string, days: number = 1) => {
  return useQuery({
    queryKey: ['price', coinId, days],
    queryFn: () => getHistoricalPrices(coinId, days),
    refetchInterval: 60000, // Refetch every minute
  })
}