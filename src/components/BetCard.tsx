import React from 'react';

interface BetCardProps {
    sender: string;
    receiver: string;
    amount: bigint;
    fee: bigint;
    success: boolean;
    confirmations: bigint;
    timestamp: bigint;
}

const BetCard: React.FC<BetCardProps> = ({
    sender,
    receiver,
    amount,
    fee,
    success,
    confirmations,
    timestamp,
}) => {
    return (

        <div className="card dark:bg-stone-800 grow">
            <div className="space-y-2 mb-4">
                <div className='space-y-2 mb-4'>
                    <p className="text-sm text-gray-300">
                        <strong>Sender:</strong> {sender}
                    </p>
                    <p className="text-sm text-gray-300">
                        <strong>Receiver:</strong> {receiver}
                    </p>
                    <p className="text-sm text-gray-300">
    <strong>Amount:</strong> {(amount / BigInt(10 ** 6)).toString()} (Fee: {fee.toString()})
</p>

                    <p className="text-sm text-gray-300">
                        <strong>Status:  </strong>
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${success
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}
                        >
                            {success ? 'Success' : 'Failed'}
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        <strong>Confirmations:</strong> {confirmations.toString()}
                    </p>
                    <p className="text-sm text-gray-300">
                        <strong>Timestamp:</strong> {new Date(Number(timestamp)).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
            </div>
        </div>

    );
};

export default BetCard;
