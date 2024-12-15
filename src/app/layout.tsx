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
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import StickyNavbar from "@/components/layout/StickyNavbar";

const inter = Inter({ subsets: ["latin"] });

const { connectors } = getDefaultWallets({
  appName: "FiatSend",
  projectId: "788c92c6f1abab2c8b0cc98c5a952607",
});

const config = getDefaultConfig({
  appName: "Fiatsend",
  projectId: "788c92c6f1abab2c8b0cc98c5a952607",
  chains: [liskSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
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
        <StickyNavbar />
      </body>
    </html>
  );
}
