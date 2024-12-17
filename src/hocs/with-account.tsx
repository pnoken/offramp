import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useRouter } from "next/navigation";
import FiatsendNFT from "@/abis/MomoNFT.json";
import Spinner from "@/components/spinner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits } from "viem";
import toast from "react-hot-toast";

const withFiatsendNFT = (WrappedComponent: React.ComponentType) => {
  const WithFiatsendNFT: React.FC = (props) => {
    const { address, isConnecting, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const {
      data: NFTBalance,
      isLoading: isBalanceLoading,
      isError,
    } = useReadContract({
      address: "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94",
      abi: FiatsendNFT.abi,
      functionName: "balanceOf",
      args: address ? [address as `0x${string}`] : undefined,
    });

    // Check if the user owns the required NFT
    useEffect(() => {
      const checkNFTOwnership = async () => {
        if (!address) return; // Wait for address to be available
        if (isBalanceLoading) return; // Wait for balance to load

        try {
          const formattedBalance = Number(formatUnits(NFTBalance as bigint, 0));
          if (formattedBalance < 1) {
            router.push("/onboarding");
          }
        } catch (error: any) {
          toast.error("Error checking NFT ownership.");
          router.push("/onboarding");
        } finally {
          setLoading(false); // Set loading to false after checking
        }
      };

      checkNFTOwnership();
    }, [address, NFTBalance, isBalanceLoading, router, isConnected]);

    // Show spinner while connecting or loading
    if (isBalanceLoading) {
      return <Spinner />;
    }

    // Show connect button if not connected
    if (!isConnected || !address) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="mb-4 text-lg font-semibold">Connect Your Wallet</h1>
          <ConnectButton />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithFiatsendNFT;
};

export default withFiatsendNFT;
