"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { liskSepolia, base, arbitrum } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
interface CurrencyAmount {
  amount: string;
  currency: "USDT" | "GHS";
}

interface Recipient {
  name: string;
  phoneNumber: string;
  provider: "MTN" | "Telecel" | "AT";
}

const OfframpPage: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState("Lisk Sepolia");

  const { switchChain } = useSwitchChain();
  const { chainId, chain } = useAccount();
  const [amounts, setAmounts] = useState<{
    from: CurrencyAmount;
    to: CurrencyAmount;
  }>({
    from: { amount: "100.00", currency: "USDT" },
    to: { amount: "1691.50", currency: "GHS" },
  });

  const chains = [
    { name: "Lisk Sepolia", id: liskSepolia.id },
    { name: "Base Sepolia", id: base.id },
    { name: "Arbitrum Sepolia", id: arbitrum.id },
  ];

  const handleChainSwitch = useCallback(
    async (chainid: number) => {
      try {
        await switchChain(chainid);
      } catch (error) {
        console.error("Error switching chain:", error);
      }
    },
    [switchChain]
  );

  useEffect(() => {
    if (chain && chainId !== liskSepolia.id) handleChainSwitch(liskSepolia.id);
  }, [chain, handleChainSwitch, chainId]);

  const [recipient, setRecipient] = useState<Recipient | null>({
    name: "Nura Mohammed",
    phoneNumber: "0548614047",
    provider: "MTN",
  });

  const [showRecipientForm, setShowRecipientForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Offramp your USDT</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Image
              src="/settings-icon.svg"
              alt="Settings"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Wallet Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Select Chain</h2>
          <select
            onChange={(e) => handleChainSwitch(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg"
            defaultValue={chainId}
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Exchange */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <input
              type="number"
              value={amounts.from.amount}
              onChange={(e) =>
                setAmounts({
                  ...amounts,
                  from: { ...amounts.from, amount: e.target.value },
                })
              }
              className="bg-transparent outline-none text-xl font-medium w-32"
            />
            <div className="flex items-center gap-2">
              <Image
                src="/images/tokens/usdt.png"
                alt="USDT"
                width={24}
                height={24}
              />
              <span className="font-medium">USDT</span>
              <button className="p-1">
                <Image
                  src="/chevron-down.svg"
                  alt="Select"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="p-2 bg-gray-100 rounded-full">
              <Image src="/swap-icon.svg" alt="Swap" width={20} height={20} />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <input
              type="number"
              value={amounts.to.amount}
              onChange={(e) =>
                setAmounts({
                  ...amounts,
                  to: { ...amounts.to, amount: e.target.value },
                })
              }
              className="bg-transparent outline-none text-xl font-medium w-32"
            />
            <div className="flex items-center gap-2">
              <Image
                src="/images/tokens/ghs.png"
                alt="GHS"
                width={24}
                height={24}
              />
              <span className="font-medium">GHS</span>
              <button className="p-1">
                <Image
                  src="/chevron-down.svg"
                  alt="Select"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Recipient */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            {recipient ? (
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 p-2 rounded-lg">
                  <Image
                    src="/images/mobile-operator/momo.svg"
                    alt="MTN"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <p className="font-medium">{recipient.name}</p>
                  <p className="text-gray-600">{recipient.phoneNumber}</p>
                </div>
              </div>
            ) : (
              <button
                className="p-2 bg-gray-100 rounded-full"
                onClick={() => setShowRecipientForm(true)}
              >
                Add Recipient
              </button>
            )}
            {showRecipientForm && (
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="mb-2 p-2 border rounded-lg w-full"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="mb-2 p-2 border rounded-lg w-full"
                />
                <select
                  className="mb-2 p-2 border rounded-lg w-full"
                  defaultValue="MTN"
                >
                  <option value="MTN">MTN</option>
                  <option value="Telecel">Telecel</option>
                  <option value="AT">AT</option>
                </select>
                <button
                  className="p-2 bg-purple-600 text-white rounded-full"
                  onClick={() => setShowRecipientForm(false)}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/moolre.svg" alt="Route" width={24} height={24} />
            <span className="text-gray-600">Settlement Route</span>
          </div>
          <span className="text-gray-600">Fees: $0.05</span>
        </div>

        {/* Action Button */}
        <button className="w-full bg-purple-600 text-white py-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Continue
        </button>

        {/* Navigation */}
        {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-md mx-auto flex justify-around">
            <button className="flex flex-col items-center gap-1 text-purple-600">
              <Image src="/home-icon.svg" alt="Home" width={24} height={24} />
              <span>Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600">
              <Image
                src="/transactions-icon.svg"
                alt="Transactions"
                width={24}
                height={24}
              />
              <span>Transactions</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600">
              <Image
                src="/rewards-icon.svg"
                alt="Rewards"
                width={24}
                height={24}
              />
              <span>Rewards</span>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OfframpPage;
