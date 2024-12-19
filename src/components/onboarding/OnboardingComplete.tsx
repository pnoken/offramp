import Image from "next/image";
import React, { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import MomoNFTABI from "@/abis/MomoNFT.json"; // Import your NFT contract ABI
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";

interface OnboardingCompleteProps {
  onContinue: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onContinue,
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const encryptMobileNumber = (number: string) => {
    return btoa(number); // Simple encryption for demonstration
  };

  const ipfsMetadataUrl =
    "ipfs://bafkreiddnggjxrrysnxutdh2udpsmkwxcqtroggpkp2veer6o3qzsra3se";

  const { address } = useAccount();

  const handleMintNFT = async () => {
    setIsMinting(true);
    const encryptedNumber = encryptMobileNumber(mobileNumber);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94", // MobileMoneyNFT contract address
        MomoNFTABI.abi,
        signer
      );

      const tx = await nftContract.mintFiatsendNFT(
        address,
        ipfsMetadataUrl,
        encryptedNumber
      );
      await tx.wait();
      toast.success("NFT minted successfully!");
      setNftMinted(true); // Set NFT minted state to true
    } catch (error) {
      console.error("Minting failed:", error);
      toast.error("Failed to mint NFT.");
    } finally {
      setIsMinting(false);
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
              disabled={isMinting}
              className={`mt-4 w-full py-3 rounded-lg text-white font-medium ${
                isMinting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isMinting ? "Minting..." : "Mint NFT"}
            </button>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold">Your Account is Ready</h1>
      <p className="text-gray-600">Enjoy sending/converting easily</p>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-purple-600">
          Send 5000 GHS for free
        </h3>
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
        disabled={!nftMinted}
      >
        Continue
      </button>
    </div>
  );
};
