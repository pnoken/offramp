"use client";

import React, { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import MomoNFTABI from "@/abis/MomoNFT.json"; // Import your NFT contract ABI
import { toast } from "react-hot-toast";

const Onboarding: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const encryptMobileNumber = (number: string) => {
    // Simple encryption logic (replace with a proper encryption method)
    return btoa(number); // Base64 encoding for demonstration
  };

  const handleMintNFT = async () => {
    if (!mobileNumber) {
      toast.error("Please enter a mobile number.");
      return;
    }

    setIsProcessing(true);
    const encryptedNumber = encryptMobileNumber(mobileNumber);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94", // MobileMoneyNFT contract address
        MomoNFTABI.abi,
        signer
      );

      const tx = await nftContract.mint(encryptedNumber);
      await tx.wait();
      toast.success("NFT minted successfully!");
      // Redirect to the offramp page
      window.location.href = "/";
    } catch (error) {
      console.error("Minting failed:", error);
      toast.error("Failed to mint NFT.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <h1>Onboarding</h1>
      <input
        type="text"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        placeholder="Enter your mobile number"
      />
      <button onClick={handleMintNFT} disabled={isProcessing}>
        {isProcessing ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
};

export default Onboarding;
