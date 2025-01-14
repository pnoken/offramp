import Image from "next/image";
import React, { useEffect, useState } from "react";
import MomoNFTABI from "@/abis/MomoNFT.json"; // Import your NFT contract ABI
import { toast } from "react-hot-toast";
import FlipCard, { BackCard, FrontCard } from "../nft/flipcard";
import {
  useAccount,
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface OnboardingCompleteProps {
  onContinue: () => void;
  mobileNumber: string;
}

const NFTContract = "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94";

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onContinue,
  mobileNumber,
}) => {
  const [nftMinted, setNftMinted] = useState(false);
  const { address } = useAccount();

  const simulatedResult = useSimulateContract({
    address: NFTContract,
    abi: MomoNFTABI.abi,
    functionName: "mintFiatsendNFT",
  });

  const {
    data: mintData,
    writeContract: mint,
    isPending: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useWriteContract();

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  const isMinted = txSuccess;

  const encryptMobileNumber = (number: string) => {
    return btoa(number); // Simple encryption for demonstration
  };

  const ipfsMetadataUrl =
    "ipfs://bafkreiddnggjxrrysnxutdh2udpsmkwxcqtroggpkp2veer6o3qzsra3se";

  const handleMintNFT = async () => {
    if (!address) {
      toast.error("Please connect your wallet to mint");
      return;
    }

    try {
      const encryptedNumber = encryptMobileNumber(mobileNumber);
      mint({
        address: NFTContract,
        abi: MomoNFTABI.abi,
        functionName: "mintFiatsendNFT",
        args: [address, ipfsMetadataUrl, encryptedNumber],
      });

      if (isMintLoading) {
        toast.loading("Waiting for confirmation...", { id: "mint" });
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  // Add this helper function to handle different error types
  const handleError = (error: any) => {
    if (error?.message?.includes("user rejected")) {
      toast.error("Transaction cancelled", { id: "mint" });
    } else if (error?.message?.includes("insufficient funds")) {
      toast.error("Insufficient funds for transaction", { id: "mint" });
    } else {
      toast.error("Failed to mint NFT. Please try again", { id: "mint" });
    }
    console.error("Minting error:", error);
  };

  // Add these effects to handle transaction states
  useEffect(() => {
    if (isMintStarted) {
      toast.loading("Minting your NFT...", { id: "mint" });
    }
  }, [isMintStarted]);

  useEffect(() => {
    if (txSuccess) {
      toast.success("NFT minted successfully!", { id: "mint" });
    }
  }, [txSuccess]);

  useEffect(() => {
    if (mintError || txError) {
      handleError(mintError || txError);
    }
  }, [mintError, txError]);

  return (
    <div className="min-h-screen bg-white p-4 my-10">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-clip-text text-black">
            Fiatsend Account NFT
          </h1>
          <p className="text-gray-600 text-sm">
            {isMinted
              ? "Your Account NFT has been bound to your soul!"
              : "Mint your Account NFT to access Fiatsend services"}
          </p>
        </div>

        {/* NFT Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-xl">
            <FlipCard>
              <FrontCard isCardFlipped={isMinted}>
                <div className="relative w-full pb-[100%] rounded-xl overflow-hidden bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <Image
                      src="/images/mobile-NFT.webp"
                      alt="Fiatsend NFT"
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-500"
                      style={{
                        filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.2))",
                      }}
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
                </div>
              </FrontCard>

              <BackCard isCardFlipped={isMinted}>
                <div className="p-6 text-center bg-gray-50 rounded-xl">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <Image
                      src="/images/mobile-NFT.webp"
                      alt="Fiatsend NFT"
                      fill
                      className="object-contain"
                      style={{
                        filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.2))",
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2  bg-clip-text text-black">
                    NFT Minted Successfully!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your NFT will appear in your wallet shortly
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`https://sepolia-blockscout.lisk.com/tx/${mintData}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      View on Blockscout →
                    </a>
                    <a
                      href={`https://testnets.opensea.io/assets/liskSepoli/${txData?.to}/1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      View on OpenSea →
                    </a>
                  </div>
                </div>
              </BackCard>
            </FlipCard>

            {!isMinted && (
              <button
                disabled={!mint || isMintLoading || isMintStarted}
                className={`w-full py-4 mt-6 rounded-xl font-medium text-sm transition-all
                  ${
                    isMintLoading || isMintStarted
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white"
                  }`}
                onClick={handleMintNFT}
              >
                {isMintLoading
                  ? "Waiting for approval..."
                  : isMintStarted
                  ? "Minting..."
                  : "Mint NFT"}
              </button>
            )}
          </div>
        </div>

        {/* Account Info */}
        {isMinted && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-lg text-white">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Account Ready</h3>
                    <p className="text-sm text-gray-600">
                      Start sending and converting with ease
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-purple-600">•</span>
                    <span>Send up to 5000.00 GHS for free monthly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-purple-600">•</span>
                    <span>Send 1000.00 GHS now without KYC verification</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-purple-600">•</span>
                    <span>Verify your account to enjoy full benefits</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-4 rounded-xl font-medium text-sm bg-purple-600 hover:to-pink-700 transition-all text-white"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
