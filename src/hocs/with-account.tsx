import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { BrowserProvider, ethers } from "ethers";
import FiatsendNFT from "@/abis/MomoNFT.json";
import Spinner from "@/components/spinner";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const FiatsendNFTAddress = "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94";

const withFiatsendNFT = (WrappedComponent: React.ComponentType) => {
  const WithFiatsendNFT: React.FC = (props) => {
    const { address, isConnecting, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if the user owns the required NFT
    useEffect(() => {
      const checkNFTOwnership = async () => {
        if (!address) return;

        if (isConnected)
          try {
            const provider = new BrowserProvider(window.ethereum);
            const nftContract = new ethers.Contract(
              FiatsendNFTAddress,
              FiatsendNFT.abi,
              provider
            );

            const balance = await nftContract.balanceOf(address);
            console.log("balance", BigInt(balance.toString()));

            if (balance === "0n") {
              router.push("/onboarding");
            }
          } catch (error: any) {
            if (error.code === "BAD_DATA") {
              console.error(
                "Error checking NFT ownership: No data returned. User likely has zero balance."
              );
              router.push("/onboarding");
            } else {
              console.error("Error checking NFT ownership:", error);
            }
          } finally {
            setLoading(false);
          }
      };

      checkNFTOwnership();
    }, [address, router, isConnected]);

    if (isConnecting) {
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
