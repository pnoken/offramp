"use client";

import React, { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface StableCoin {
  symbol: string;
  name: string;
  icon: string;
  address: string;
  disabled?: boolean;
}

interface WalletProvider {
  name: string;
  icon: string;
  deepLink: (
    tokenAddress: string,
    recipientAddress: string,
    amount: string
  ) => string;
}

const walletProviders: WalletProvider[] = [
  {
    name: "MetaMask",
    icon: "/images/wallets/metamask.svg",
    deepLink: (tokenAddress, recipientAddress, amount) =>
      `https://metamask.app.link/send/${tokenAddress}@4202/transfer?address=${recipientAddress}&amount=${amount}`,
  },
  {
    name: "Trust Wallet",
    icon: "/images/wallets/trust.svg",
    deepLink: (tokenAddress, recipientAddress, amount) =>
      `https://link.trustwallet.com/send?coin=4202&asset=${tokenAddress}&address=${recipientAddress}&amount=${amount}`,
  },
  {
    name: "Standard URI",
    icon: "/images/wallets/others.png",
    deepLink: (tokenAddress, recipientAddress, amount) =>
      `ethereum:${tokenAddress}/transfer?address=${recipientAddress}&uint256=${amount}`,
  },
];

interface ReceiveStablecoinsProps {
  exchangeRate: number; // Specify the type of exchangeRate
  reserve: number;
}

const ReceiveStablecoins: React.FC<ReceiveStablecoinsProps> = ({
  exchangeRate,
  reserve,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<StableCoin>({
    symbol: "USDT",
    name: "Tether USD",
    icon: "/images/tokens/usdt.png",
    address: "0xB45aF91Ded52Dde37c0f62fec59abC07f6b8622a",
  });
  const [invoiceLink, setInvoiceLink] = useState<string>("");
  const [ethereumUri, setEthereumUri] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider>(
    walletProviders[0]
  );
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const stablecoins: StableCoin[] = [
    {
      symbol: "USDT",
      name: "Tether USD",
      icon: "/images/tokens/usdt.png",
      address: "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "/images/tokens/usdc.png",
      address: "0x...",
      disabled: true,
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      icon: "/images/tokens/dai.png",
      address: "0x...",
      disabled: true,
    },
  ];

  const generateLinks = () => {
    const amountInGHS = Number(amount);

    // Check if the amount is greater than reserves
    if (amountInGHS > reserve) {
      toast.error("Low Fiatsend reserves. Please enter a lower amount.");
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Web link for QR and sharing
    const baseUrl = "https://fiatsend.com/pay";
    const params = new URLSearchParams({
      to: "0xbaa297515baae690e5a565b340e5efab9ffa24a1",
      amount: amount,
      token: selectedToken.symbol,
      currency: "GHS",
    });
    const webLink = `${baseUrl}?${params.toString()}`;

    // Generate wallet-specific deep link
    const amountInWei = (Number(amount) * 1e18).toString();
    const recipientAddress = "0xbaa297515baae690e5a565b340e5efab9ffa24a1";
    const walletUri = selectedWallet.deepLink(
      selectedToken.address,
      recipientAddress,
      amountInWei
    );

    setInvoiceLink(webLink);
    setEthereumUri(walletUri);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
          <h1 className="text-xl sm:text-2xl font-bold">
            Transfer to fiatsend.eth
          </h1>
          <p className="mt-2 text-sm sm:text-base opacity-90">
            Send USDT to fiatsend.eth and receive GHS directly to your mobile
            money
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Step 1: Amount Input */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h2 className="text-xl font-semibold">Enter Amount</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 pr-24 text-3xl font-bold rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="text-gray-400 text-xl font-medium">GHS</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">You&apos;ll send</span>
                <span className="text-lg font-semibold text-gray-700">
                  ≈{" "}
                  {amount ? (Number(amount) / exchangeRate).toFixed(2) : "0.00"}{" "}
                  USDT
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Send USDT */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h2 className="text-xl font-semibold">Send USDT</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl space-y-6">
              {/* Address Card */}
              <div className="flex items-center justify-between p-5 bg-white rounded-xl border-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Image
                      src="/images/tokens/usdt.png"
                      alt="USDT"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">fiatsend.eth</p>
                    <p className="text-sm text-gray-500">0xbaa...24a1</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      "0xbaa297515baae690e5a565b340e5efab9ffa24a1"
                    )
                  }
                  className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Copy</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Wallet Options */}
              <div className="grid grid-cols-2 gap-4">
                {walletProviders.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => {
                      setSelectedWallet(wallet);
                      generateLinks();
                    }}
                    className="flex items-center justify-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                      <Image
                        src={wallet.icon}
                        alt={wallet.name}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span className="font-medium text-gray-700">
                      Send with {wallet.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* QR Code */}
              {ethereumUri && (
                <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl border-2 border-gray-200">
                  <QRCodeSVG value={ethereumUri} size={200} />
                  <p className="text-sm text-gray-600">
                    Scan with your wallet app to send USDT
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Transaction Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h2 className="text-xl font-semibold">Confirm Transaction</h2>
            </div>

            <button
              onClick={generateLinks}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>I&apos;ve Sent USDT</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Update the details section */}
          <div className="space-y-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 hover:text-purple-600"
            >
              <span>{showDetails ? "Hide" : "Show"} Details</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDetails && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Minimum Transfer</span>
                  <span className="font-medium">10 USDT</span>
                </div>
                {/* ... other details with similar text size adjustments ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveStablecoins;
