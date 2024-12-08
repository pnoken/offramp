"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance?: string;
}

const Pool = () => {
  const { ready, authenticated, user } = usePrivy();
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");
  const [selectedToken, setSelectedToken] = useState<Token>({
    symbol: "GHSFIAT",
    name: "Ghana Fiat",
    icon: "/images/tokens/ghsfiat.png",
  });

  const tokens: Token[] = [
    {
      symbol: "GHSFIAT",
      name: "Ghana Fiat",
      icon: "/images/tokens/ghsfiat.png",
      balance: "0.00",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      icon: "/images/tokens/usdt.png",
      balance: "0.00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Liquidity Pools</h1>
          <p className="text-gray-600 mt-2">
            Provide single-sided liquidity and earn fees from trades
          </p>
        </div>

        {/* Main Pool Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "add"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Add Liquidity
            </button>
            <button
              onClick={() => setActiveTab("remove")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "remove"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Remove Liquidity
            </button>
          </div>

          {/* Pool Information */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={selectedToken.icon}
                    alt={selectedToken.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedToken.symbol} Pool
                  </h3>
                  <p className="text-sm text-gray-500">
                    Single-sided liquidity
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">APR</p>
                <p className="font-semibold text-green-600">12.45%</p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount</span>
                <span className="text-sm text-gray-500">
                  Balance: {selectedToken.balance}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl font-medium focus:outline-none"
                />
                <button className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  MAX
                </button>
                <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2">
                  <Image
                    src={selectedToken.icon}
                    alt={selectedToken.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="font-medium">{selectedToken.symbol}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              {authenticated ? "Add Liquidity" : "Connect Wallet"}
            </button>

            {/* Pool Stats */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Pool Liquidity</span>
                <span className="font-medium">$1,234,567</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Pool Share</span>
                <span className="font-medium">0%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Price</span>
                <span className="font-medium">1 GHSFIAT = 1.00 USDT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pool;
