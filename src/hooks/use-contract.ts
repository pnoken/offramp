import { getContract } from "viem";
import FiatSendABI from "@/abis/FiatSend.json";
import GHSFIATABI from "@/abis/GHSFIAT.json";
import { walletClientL2 } from "@/utils/wallet-client";

export const useContract = () => {
  const fiatSendContract = getContract({
    address: "0x9e4fCd5Cc9D80a49184715c8BA1C3C6729E05A93",
    abi: FiatSendABI.abi,
    client: { wallet: walletClientL2 },
  });

  const ghsFiatContract = getContract({
    address: "0x84Fd74850911d28C4B8A722b6CE8Aa0Df802f08A",
    abi: GHSFIATABI.abi,
    client: { wallet: walletClientL2 },
  });

  return { fiatSendContract, ghsFiatContract };
};
