import React, { useState } from "react";
import { useAccount, useSwitchChain, useContractWrite } from "wagmi";
import { ethers } from "ethers";
import TokenFaucetABI from "@/abis/TokenFaucet.json"; // Import your contract ABI

interface SendFiatProps {
  remainingLimit: number; // Prop to receive the remaining monthly limit
}

const SendFiat: React.FC<SendFiatProps> = ({ remainingLimit }) => {
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();
  const [amount, setAmount] = useState("");
  const [stablecoin, setStablecoin] = useState<"USDC" | "UST" | "DAI">("USDC"); // Default stablecoin

  const handleSendFiat = async () => {
    // Check if the user is on the correct chain
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    const liskSepoliaChainId = "0x7e"; // Replace with the actual chain ID for Lisk Sepolia

    if (currentChainId !== liskSepoliaChainId) {
      // Switch to Lisk Sepolia
      await switchChain(liskSepoliaChainId);
    }

    // Proceed with sending fiat
    try {
      // Assuming you have a contract method to send fiat
      const contract = new ethers.Contract(
        "YOUR_CONTRACT_ADDRESS",
        TokenFaucetABI,
        new ethers.providers.Web3Provider(window.ethereum)
      );
      const tx = await contract.sendFiat(
        address,
        ethers.utils.parseUnits(amount, 18),
        stablecoin
      ); // Adjust decimals as needed
      await tx.wait(); // Wait for the transaction to be mined
      console.log(`Successfully sent ${amount} ${stablecoin}`);
    } catch (error) {
      console.error("Error sending fiat:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Send Fiat</h2>
      <p className="mb-4">
        Your remaining monthly limit: <strong>{remainingLimit} GHS</strong>
      </p>

      <select
        value={stablecoin}
        onChange={(e) =>
          setStablecoin(e.target.value as "USDC" | "UST" | "DAI")
        }
        className="w-full p-2 border rounded mb-4"
      >
        <option value="USDC">USDC</option>
        <option value="UST">UST</option>
        <option value="DAI">DAI</option>
      </select>

      <input
        type="text"
        placeholder="Enter amount to send"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
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
