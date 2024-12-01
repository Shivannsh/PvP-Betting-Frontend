import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { toast } from 'react-hot-toast'

const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    onError(error) {
      toast.error(error.message)
    },
  })
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatAddress(address!)}
        </span>
        <button
          onClick={() => disconnect()}
          className="btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="btn-primary text-sm whitespace-nowrap"
          disabled={!connector.ready || isLoading}
        >
          {isLoading && connector.id === pendingConnector?.id
            ? 'Connecting...'
            : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  )
}

export default WalletConnect