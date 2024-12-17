import Link from "next/link";
import React, { useState } from "react";
import { useAccount } from "wagmi";

const NeedGas: React.FC = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(address);

  const handleRequestGas = () => {
    const tweetText = `I am requesting 0.01 ETH @fiatsend offramp.fiatsend.com on @lisk Sepolia chain. My address: ${address}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold">Need Gas?</h2>
      <div className="flex flex-col mt-4">
        <Link
          href={"https://sepolia-bridge.lisk.com/bridge/lisk-sepolia-testnet"}
          target="_blank"
          className="mb-2 text-center py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Bridge to Lisk Sepolia
        </Link>
        {<div className="text-center">OR</div>}
        <button
          onClick={() => setIsRequesting(!isRequesting)}
          className="py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
        >
          Request Gas
        </button>
      </div>

      {isRequesting && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
          <h3 className="text-lg font-semibold">Request Gas</h3>
          <p className="text-gray-600">Please enter your address:</p>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.startsWith("0x") || inputValue === "") {
                setWalletAddress(inputValue as `0x${string}` | undefined);
              }
            }}
            placeholder="Enter your address"
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
          <button
            onClick={handleRequestGas}
            disabled={!address}
            className={`mt-4 w-full py-2 rounded-lg text-white ${
              address
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Request
          </button>
        </div>
      )}
    </div>
  );
};

export default NeedGas;
