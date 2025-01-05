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
      toast.error(
        "Wallet is not connected. Please connect your wallet and try again."
      );
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
      {mintError && (
        <p style={{ marginTop: 24, color: "#FF6257" }}>
          Error: {mintError.message}
        </p>
      )}
      {txError && (
        <p style={{ marginTop: 24, color: "#FF6257" }}>
          Error: {txError.message}
        </p>
      )}

      {!isMinted && (
        <button
          style={{ marginTop: 24 }}
          disabled={!mint || isMintLoading || isMintStarted}
          className="button"
          data-mint-loading={isMintLoading}
          data-mint-started={isMintStarted}
          onClick={handleMintNFT}
        >
          {isMintLoading && "Waiting for approval"}
          {isMintStarted && "Minting..."}
          {!isMintLoading && !isMintStarted && "Mint"}
        </button>
      )}
      <div style={{ flex: "0 0 auto" }}>
        <FlipCard>
          <FrontCard isCardFlipped={isMinted}>
            <Image
              layout="responsive"
              src="/images/mobile-wallet.webp"
              width="500"
              height="500"
              alt="RainbowKit Demo NFT"
            />
            <h1 style={{ marginTop: 24 }}>Rainbow NFT</h1>
            <ConnectButton />
          </FrontCard>
          <BackCard isCardFlipped={isMinted}>
            <div style={{ padding: 24 }}>
              <Image
                src="/images/mobile-wallet.webp"
                width="80"
                height="80"
                alt="RainbowKit Demo NFT"
                style={{ borderRadius: 8 }}
              />
              <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
              <p style={{ marginBottom: 24 }}>
                Your NFT will show up in your wallet in the next few minutes.
              </p>
              <p style={{ marginBottom: 6 }}>
                View on{" "}
                <a href={`https://sepolia-blockscout.lisk.com/tx/${mintData}`}>
                  Blockscout
                </a>
              </p>
              <p>
                View on{" "}
                <a
                  href={`https://testnets.opensea.io/assets/liskSepoli/${txData?.to}/1`}
                >
                  Opensea
                </a>
              </p>
            </div>
          </BackCard>
        </FlipCard>
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
          isMinted
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={isMinted ? onContinue : undefined}
        disabled={!isMinted} // Disable if NFT is not minted
      >
        Continue
      </button>
    </div>
  );
};
