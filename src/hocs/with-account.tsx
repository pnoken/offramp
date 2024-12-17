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
        if (!address || isBalanceLoading || NFTBalance === undefined) return; // Wait for balance to load

        try {
          setLoading(true);
          const formattedBalance = Number(formatUnits(NFTBalance as bigint, 0));

          console.log("balance", formattedBalance);

          if (formattedBalance < 1) {
            router.push("/onboarding");
          }
        } catch (error: any) {
          toast.error("Error checking NFT ownership.");
          router.push("/onboarding");
        } finally {
          setLoading(false);
        }
      };

      checkNFTOwnership();
    }, [address, router, isConnected, NFTBalance, isBalanceLoading]);

    if (isConnecting || loading || isBalanceLoading) {
      return <Spinner />;
    }

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
