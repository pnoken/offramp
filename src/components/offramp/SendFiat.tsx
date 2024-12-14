import React, { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { ethers, parseUnits, BrowserProvider } from "ethers";
import TetherTokenABI from "@/abis/TetherToken.json"; // Ensure this ABI matches the USDT contract
import toast from "react-hot-toast";

interface SendFiatProps {
  remainingLimit: number; // Prop to receive the remaining monthly limit
}

const SendFiat: React.FC<SendFiatProps> = ({ remainingLimit }) => {
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();
  const [amount, setAmount] = useState("");
  const [stablecoin, setStablecoin] = useState<"USDC" | "UST" | "DAI">("USDC"); // Default stablecoin

  const liskSepoliaChainId = "0x106A"; // 4202 in hexadecimal
  const recipientAddress = "0x1731D34B07CA2235E668c7B0941d4BfAB370a2d0"; // Address to send tokens

  const handleSendFiat = async () => {
    // Check if MetaMask or Web3 wallet is installed
    if (typeof window.ethereum === "undefined") {
      toast.error(
        "MetaMask or a compatible wallet is required to use this feature."
      );
      return;
    }

    // Check if the user is on the correct chain
    const provider = new BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const currentChainId = await provider
      .getNetwork()
      .then((network) => network.chainId.toString());

    if (currentChainId !== liskSepoliaChainId) {
      // Switch to Lisk Sepolia chain
      try {
        await switchChain({ chainId: parseInt(liskSepoliaChainId, 16) }); // Switch chain using Wagmi
      } catch (error) {
        console.error("Error switching chain:", error);
        alert("Failed to switch to the Lisk Sepolia chain.");
        return;
      }
    }

    // Proceed with sending fiat
    try {
      // Instantiate the USDT contract
      const usdtContract = new ethers.Contract(
        "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168", // USDT contract address
        TetherTokenABI.abi,
        await signer
      );

      // Parse the amount to the correct decimals (USDT uses 6 decimals)
      const parsedAmount = parseUnits(amount, 6);

      // Call the `transfer` function to send tokens
      const tx = await usdtContract.transfer(recipientAddress, parsedAmount);

      // Wait for the transaction to complete
      await tx.wait();

      console.log(`Successfully sent ${amount} USDT to ${recipientAddress}`);
      alert(`Successfully sent ${amount} USDT to ${recipientAddress}`);
    } catch (error) {
      console.error("Error sending fiat:", error);
      alert("Failed to send fiat. Please check the console for details.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Send Fiat</h2>
      <p className="mb-4">
        Your remaining monthly limit: <strong>{remainingLimit} GHS</strong>
      </p>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="stablecoin"
        >
          Select Stablecoin
        </label>
        <select
          id="stablecoin"
          value={stablecoin}
          onChange={(e) =>
            setStablecoin(e.target.value as "USDC" | "UST" | "DAI")
          }
          className="w-full p-2 border rounded"
        >
          <option value="USDC">USDC</option>
          <option value="UST">UST</option>
          <option value="DAI">DAI</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Enter amount to send
        </label>
        <input
          id="amount"
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSendFiat}
        className="bg-green-500 text-white py-2 rounded w-full"
      >
        Send Fiat
      </button>
    </div>
  );
};

export default SendFiat;
