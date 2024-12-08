"use client";

import React, { useState, useEffect } from "react";
import Portfolio from "@/components/dashboard/content/portfolio";
import Exchange from "@/components/dashboard/content/exchange";
import { TransactionList } from "@/components/dashboard/content/transactions";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import Settings from "@/components/dashboard/content/settings";
import Image from "next/image";
import Link from "next/link";

const Home: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("Portfolio");
  const { connectOrCreateWallet } = usePrivy();
  const { address } = useAccount();
  const { ready, authenticated, user } = usePrivy();

  const walletAddress = user?.wallet?.address || "";
  const shortenedAddress =
    walletAddress.length > 10
      ? `${walletAddress.substring(0, 5)}...${walletAddress.substring(
          walletAddress.length - 5
        )}`
      : address;

  const renderContent = () => {
    switch (activeComponent) {
      case "Portfolio":
        return <Portfolio />;
      case "Transactions":
        return <TransactionList />;
      case "Exchange":
        return <Exchange />;
      case "Settings":
        return <Settings />;
      default:
        return <Portfolio />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Image
                  src="/images/fiatsend.png"
                  height={40}
                  width={40}
                  alt="Fiatsend Icon"
                  className="mr-3"
                />
                <span className="text-xl font-bold text-indigo-600">
                  Fiatsend | Alewa
                </span>
              </div>

              <div className="hidden xl:flex items-center space-x-4">
                <Link
                  href="/overview"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Overview
                </Link>
                <Link
                  href="/faucet"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Faucet
                </Link>
                <Link
                  href="/liquidity"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Liquidity
                </Link>
                <a
                  href="https://docs.fiatsend.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Guide
                </a>
              </div>
            </div>

            {/* Right side - Wallet Connection */}
            <div className="flex items-center">
              {ready && authenticated && user?.wallet ? (
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                  {shortenedAddress}
                </button>
              ) : (
                <button
                  onClick={connectOrCreateWallet}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="mt-16 container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
