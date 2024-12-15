"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig, createConfig } from "wagmi";
import { liskSepolia } from "viem/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const { connectors } = getDefaultWallets({
  appName: "FiatSend",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
});

const config = createConfig({
  connectors,
  chains: [liskSepolia],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={config}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#4F46E5",
                borderRadius: "small",
              })}
            >
              <Navbar />
              {children}
              <Toaster position="top-center" />
            </RainbowKitProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </body>
    </html>
  );
}
