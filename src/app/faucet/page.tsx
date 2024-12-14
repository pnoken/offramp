"use client";

import React, { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useTokenFaucet } from "@/hooks/use-token-faucet";
import { toast } from "react-hot-toast";
import { useAccount, useSwitchChain } from "wagmi";
import { liskSepolia } from "viem/chains";
import { formatDistanceToNow } from "date-fns";

const Faucet = () => {
  const { ready, authenticated, user, login } = usePrivy();
  const {
    claimTokens,
    isClaimLoading,
    claimError,
    isSuccess,
    canClaim,
    timeRemaining,
  } = useTokenFaucet();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [hasSwitchedChain, setHasSwitchedChain] = useState(false);

  useEffect(() => {
    if (chain && chain.id !== liskSepolia.id) {
      toast.error(
        <div className="flex flex-col gap-2">
          <span>Please switch to Lisk Sepolia network</span>
          <button
            onClick={async () => {
              try {
                await switchChain({ chainId: liskSepolia.id });
                setHasSwitchedChain(true);
              } catch (error) {
                console.error("Failed to switch chain:", error);
                toast.error("Failed to switch to Lisk Sepolia network");
              }
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Switch Network
          </button>
        </div>,
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  }, [chain, switchChain, hasSwitchedChain]);

  const formatTimeRemaining = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const handleClaim = async () => {
    try {
      if (!authenticated) {
        try {
          await login();
          return;
        } catch (error) {
          console.error("Privy login error:", error);
          toast.error("Please connect your wallet first");
          return;
        }
      }

      if (chain?.id !== liskSepolia.id && !hasSwitchedChain) {
        await switchChain({ chainId: liskSepolia.id });
        return;
      }

      if (!canClaim) {
        toast.error("Please wait for the cooldown period to end");
        return;
      }

      console.log("Current wallet:", user?.wallet);

      await claimTokens();
      if (isSuccess) {
        toast.success("Tokens claimed successfully!");
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      if (error.message?.includes("network")) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.message?.includes("rejected")) {
        toast.error("Transaction rejected by user");
      } else {
        toast.error("Failed to claim tokens. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Testnet Faucet
              </h1>
              <p className="text-lg text-gray-600">
                Get started with free testnet tokens to explore and test the
                network
              </p>
            </div>

            {/* Main Faucet Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Main Faucet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Claim testnet assets{" "}
                    <span className="text-indigo-600">
                      (FSEND, GHSFIAT, and USDT)
                    </span>
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Daily Limits
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>FSEND</span>
                      <span className="font-medium">100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GHSFIAT</span>
                      <span className="font-medium">100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>USDT</span>
                      <span className="font-medium">100</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClaim}
                disabled={isClaimLoading || !canClaim || !authenticated}
                className={`w-full md:w-auto font-medium py-3 px-6 rounded-lg transition-colors duration-200
                  ${
                    isClaimLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : !canClaim
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {isClaimLoading
                  ? "Claiming..."
                  : !canClaim && timeRemaining
                  ? `Next claim in ${formatTimeRemaining(timeRemaining)}`
                  : "Claim Tokens"}
              </button>
              {claimError && (
                <p className="mt-2 text-red-600 text-sm">
                  Error: {claimError.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
