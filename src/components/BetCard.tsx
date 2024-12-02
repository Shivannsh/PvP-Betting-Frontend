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
        <div className="bg-black shadow-md rounded-lg p-4 mb-4 border">
            <h3 className="text-lg font-semibold">Bet Details</h3>
            <p><strong>Sender:</strong> {sender}</p>
            <p><strong>Receiver:</strong> {receiver}</p>
            <p><strong>Amount:</strong> {amount.toString()} (Fee: {fee.toString()})</p>
            <p><strong>Status:</strong> {success ? 'Success' : 'Failed'}</p>
            <p><strong>Confirmations:</strong> {confirmations.toString()}</p>
            <p><strong>Timestamp:</strong> {new Date(Number(timestamp)).toLocaleString()}</p>
        </div>
    );
};

export default BetCard;
