"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";

interface StableCoin {
  symbol: string;
  name: string;
  icon: string;
  address: string;
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

const ReceiveStablecoins = () => {
  const { user, authenticated } = usePrivy();
  const [amount, setAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(12.5); // GHS/USD rate
  const [selectedToken, setSelectedToken] = useState<StableCoin>({
    symbol: "USDT",
    name: "Tether USD",
    icon: "/images/tokens/usdt.png",
    address: "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168",
  });
  const [invoiceLink, setInvoiceLink] = useState<string>("");
  const [ethereumUri, setEthereumUri] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider>(
    walletProviders[0]
  );

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
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      icon: "/images/tokens/dai.png",
      address: "0x...",
    },
  ];

  const generateLinks = () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Web link for QR and sharing
    const baseUrl = "https://fiatsend.com/pay";
    const params = new URLSearchParams({
      to: user?.wallet?.address || "fiatsend.eth",
      amount: amount,
      token: selectedToken.symbol,
      currency: "GHS",
    });
    const webLink = `${baseUrl}?${params.toString()}`;

    // Generate wallet-specific deep link
    const amountInWei = (Number(amount) * 1e18).toString();
    const recipientAddress =
      user?.wallet?.address || "0xbaa297515baae690e5a565b340e5efab9ffa24a1";
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
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Request Payment
        </h1>

        {/* Exchange Rate Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Exchange Rate</span>
            <span className="text-lg font-semibold text-gray-900">
              1 USD = {exchangeRate} GHS
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (GHS)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
            <div className="absolute right-3 top-3 text-gray-500">
              ≈ ${amount ? (Number(amount) / exchangeRate).toFixed(2) : "0.00"}
            </div>
          </div>
        </div>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Stablecoin
          </label>
          <div className="grid grid-cols-3 gap-4">
            {stablecoins.map((token) => (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(token)}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  selectedToken.symbol === token.symbol
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <Image
                  src={token.icon}
                  alt={token.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="font-medium">{token.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Wallet
          </label>
          <div className="grid grid-cols-3 gap-4">
            {walletProviders.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => setSelectedWallet(wallet)}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  selectedWallet.name === wallet.name
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="font-medium">{wallet.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Invoice Button */}
        <button
          onClick={generateLinks}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-6"
        >
          Generate Invoice Link
        </button>

        {/* Invoice Links and QR Codes */}
        {invoiceLink && (
          <div className="space-y-6">
            {/* Web Link Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Web Link
              </h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG value={invoiceLink} size={200} />
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg">
                <input
                  type="text"
                  value={invoiceLink}
                  readOnly
                  className="flex-1 bg-transparent border-none focus:ring-0"
                />
                <button
                  onClick={() => copyToClipboard(invoiceLink)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Ethereum URI Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Wallet Deep Link
              </h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG value={ethereumUri} size={200} />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg">
                  <input
                    type="text"
                    value={ethereumUri}
                    readOnly
                    className="flex-1 bg-transparent border-none focus:ring-0"
                  />
                  <button
                    onClick={() => copyToClipboard(ethereumUri)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <a
                  href={ethereumUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Open in {selectedWallet.name}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveStablecoins;
