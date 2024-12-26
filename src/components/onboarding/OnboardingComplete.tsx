import Image from "next/image";
import React, { useEffect, useState } from "react";
import MomoNFTABI from "@/abis/MomoNFT.json"; // Import your NFT contract ABI
import { toast } from "react-hot-toast";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

interface OnboardingCompleteProps {
  onContinue: () => void;
  mobileNumber: string;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onContinue,
  mobileNumber,
}) => {
  const [nftMinted, setNftMinted] = useState(false);
  const { address } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isSuccess, isPending: isConfirming } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const encryptMobileNumber = (number: string) => {
    return btoa(number); // Simple encryption for demonstration
  };

  const ipfsMetadataUrl =
    "ipfs://bafkreiddnggjxrrysnxutdh2udpsmkwxcqtroggpkp2veer6o3qzsra3se";

  const NFTContract = "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94";

  useEffect(() => {
    if (isSuccess) {
      toast.success("NFT minted successfully!");
      setNftMinted(true); // Enable the button when NFT is minted
    }
  }, [isSuccess]);

  const handleMintNFT = async () => {
    if (!address) {
      toast.error(
        "Wallet is not connected. Please connect your wallet and try again."
      );
      return;
    }

    try {
      const encryptedNumber = encryptMobileNumber(mobileNumber);
      writeContract({
        address: NFTContract,
        abi: MomoNFTABI.abi,
        functionName: "mintFiatsendNFT",
        args: [address, ipfsMetadataUrl, encryptedNumber],
      });

      if (isConfirming) {
        toast("Transaction submitted, awaiting confirmation...", {
          icon: "⏳",
        });
      }
    } catch (error) {
      console.error("Minting failed:", error);
      toast.error("Failed to mint NFT.");
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        {/* Replace the success image with a representation of the NFT */}
        {nftMinted ? (
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold">Mint Successful</h2>
            <Image
              src="/images/mobile-wallet.webp" // Replace with your NFT image
              alt="Minted NFT"
              className="w-48 h-48"
              width={192}
              height={192}
            />
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold">Mint Your Account</h2>
            <Image
              src="/images/mobile-wallet.webp" // Replace with your NFT image
              alt="Minted NFT"
              className="w-48 h-48"
              width={240}
              height={240}
            />
            <button
              onClick={handleMintNFT}
              disabled={isPending}
              className={`mt-4 w-full py-3 rounded-lg text-white font-medium ${
                isPending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "Minting..." : "Mint NFT"}
            </button>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold">Your Account is Ready</h1>
      <p className="text-gray-600">Enjoy sending/converting easily</p>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-purple-600">
          Send up to 5000.00 GHS for free monthly
        </h3>
        <p className="text-sm text-gray-600">
          Send 1000.00 now without KYC verification
        </p>
        <p className="text-sm text-gray-600">
          Verify your account to enjoy the benefits
        </p>
      </div>

      <button
        className={`w-full py-3 rounded-lg text-white font-medium ${
          nftMinted
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={nftMinted ? onContinue : undefined}
        disabled={!nftMinted} // Disable if NFT is not minted
      >
        Continue
      </button>
    </div>
  );
};
