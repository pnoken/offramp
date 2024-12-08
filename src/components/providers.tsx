"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { sepolia, liskSepolia } from "viem/chains";

import type { PrivyClientConfig } from "@privy-io/react-auth";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [liskSepolia, sepolia],
  transports: {
    [liskSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ["email", "wallet"],
  appearance: {
    showWalletLoginFirst: true,
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
