export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatAmount = (
  amount: number,
  decimals: number = 2,
  currency: string = 'USDC'
): string => {
  return `${amount.toFixed(decimals)} ${currency}`
}