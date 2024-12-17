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

    const { data: NFTBalance } = useReadContract({
      address: "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94",
      abi: FiatsendNFT.abi,
      functionName: "balanceOf",
      args: address ? [address as `0x${string}`] : undefined,
    });

    // Check if the user owns the required NFT
    useEffect(() => {
      const checkNFTOwnership = async () => {
        if (!address) return;

        if (isConnected && address)
          try {
            setLoading(true);
            const formattedBalance = NFTBalance
              ? Number(formatUnits(NFTBalance as bigint, 0))
              : "0.00";
            console.log("balance", Number(formattedBalance));

            if (Number(formattedBalance) < 1) {
              router.push("/onboarding");
            }
          } catch (error: any) {
            if (error.code === "BAD_DATA") {
              toast.error(
                "Error checking NFT ownership: No data returned. User likely has zero balance."
              );
              router.push("/onboarding");
            } else {
              toast.error("Error checking NFT ownership:", error);
            }
          } finally {
            setLoading(false);
          }
      };

      checkNFTOwnership();
    }, [address, router, isConnected, NFTBalance]);

    if (isConnecting) {
      return <Spinner />;
    }

    if (loading) {
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
