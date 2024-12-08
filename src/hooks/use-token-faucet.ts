import {
  useWriteContract,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";
import { Address, Abi } from "viem";
import TokenFaucetABI from "@/abis/TokenFaucet.json";
import { useState, useEffect } from "react";

const FAUCET_CONTRACT_ADDRESS =
  "0x0e714082ca836F3432189Cd0568d69c35C8Ff8C7" as Address;

export function useTokenFaucet() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Read last claim timestamp
  const { data: lastClaimTime } = useReadContract({
    address: FAUCET_CONTRACT_ADDRESS,
    abi: TokenFaucetABI.abi as Abi,
    functionName: "lastClaimTime",
  });

  // Read cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: FAUCET_CONTRACT_ADDRESS,
    abi: TokenFaucetABI.abi as Abi,
    functionName: "cooldownPeriod",
  });

  useEffect(() => {
    const updateTimeRemaining = () => {
      if (!lastClaimTime || !cooldownPeriod) return;

      const lastClaim = Number(lastClaimTime) * 1000; // Convert to milliseconds
      const cooldown = Number(cooldownPeriod) * 1000;
      const now = Date.now();
      const nextClaimTime = lastClaim + cooldown;
      const remaining = nextClaimTime - now;

      setTimeRemaining(remaining > 0 ? remaining : 0);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [lastClaimTime, cooldownPeriod]);

  const { writeContract, isPending, error } = useWriteContract();

  const claimTokens = async () => {
    try {
      await writeContract({
        address: FAUCET_CONTRACT_ADDRESS,
        abi: TokenFaucetABI.abi as Abi,
        functionName: "requestTokens",
      });
    } catch (err) {
      console.error("Failed to claim tokens:", err);
    }
  };

  // Watch for successful claims
  useWatchContractEvent({
    address: FAUCET_CONTRACT_ADDRESS,
    abi: TokenFaucetABI.abi as Abi,
    eventName: "TokensRequested",
    onLogs() {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    },
  });

  return {
    claimTokens,
    isClaimLoading: isPending,
    claimError: error,
    isSuccess,
    canClaim: timeRemaining === 0 || timeRemaining === null,
    timeRemaining,
  };
}
