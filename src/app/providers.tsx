import { createConfig, http } from "wagmi";
import { liskSepolia } from "viem/chains";

export const config = createConfig({
  chains: [liskSepolia],
  transports: {
    [liskSepolia.id]: http(
      "https://rpc.sepolia-api.lisk.com" // Replace with actual RPC URL
    ),
  },
});
