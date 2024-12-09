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
