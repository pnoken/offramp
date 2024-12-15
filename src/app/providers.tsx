"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { liskSepolia } from "viem/chains";

export const config = createConfig({
  chains: [liskSepolia],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
