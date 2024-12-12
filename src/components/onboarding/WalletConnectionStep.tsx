import React from "react";
import { usePrivy } from "@privy-io/react-auth";

interface WalletConnectionStepProps {
  onComplete: () => void;
}

const WalletConnectionStep: React.FC<WalletConnectionStepProps> = ({
  onComplete,
}) => {
  const { user } = usePrivy();

  const handleSetPrimaryWallet = async () => {
    // Implement wallet signing transaction
    // This could involve a contract call to set the primary wallet
    onComplete();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
      <p className="mb-4">Wallet Address: {user?.wallet?.address}</p>

      <button
        onClick={handleSetPrimaryWallet}
        className="w-full bg-purple-500 text-white py-2 rounded"
      >
        Set as Primary Wallet
      </button>
    </div>
  );
};

export default WalletConnectionStep;
