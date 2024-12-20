import React, { Fragment } from "react";
import {
  ArrowUpIcon,
  PlusIcon,
  BuildingLibraryIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Tabs } from "@/components/ui/tabs";
import Image from "next/image";
import VerifyNoticeCard from "@/components/alert/verify-notice";
import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { usePrivy } from "@privy-io/react-auth";

interface TabItem {
  label: string;
  content: React.ReactElement;
}

const unverifiedCredentials = [
  { name: "KYC Verification", issuer: "Global ID", date: "N/A", icon: "🔐" },
  { name: "Bank Account", issuer: "GHS Bank", date: "N/A", icon: "🏦" },
  { name: "Credit Score", issuer: "Credit Bureau", date: "N/A", icon: "📊" },
  { name: "Employment", issuer: "TechCorp Inc.", date: "N/A", icon: "💼" },
  { name: "Education", issuer: "University of Ghana", date: "N/A", icon: "🎓" },
];

// ERC20 ABI for balance checking
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Token configurations
const tokens = [
  {
    symbol: "GHSFIAT",
    name: "Ghana Fiat",
    icon: "/images/tokens/ghs.png",
    address: "0x84Fd74850911d28C4B8A722b6CE8Aa0Df802f08A",
    decimals: 18,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "/images/tokens/usdt.png",
    address: "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168",
    decimals: 18,
  },
] as const;

const Portfolio: React.FC = () => {
  const { user } = usePrivy();

  // Read all token balances at once
  const { data: balances } = useReadContracts({
    contracts: tokens.map((token) => ({
      address: token.address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: user?.wallet?.address
        ? [user.wallet.address as `0x${string}`]
        : undefined,
    })),
  });

  // Format balances with token info
  const tokenBalances = tokens.map((token, index) => ({
    ...token,
    balance: balances?.[index]?.result
      ? Number(formatUnits(balances[index].result, token.decimals))
      : 0,
    usdRate: token.symbol === "GHSFIAT" ? 1 / 12.5 : 1, // Mock rates
  }));

  const totalBalance = tokenBalances.reduce(
    (acc, token) => acc + token.balance * token.usdRate,
    0
  );

  const tabsData: TabItem[] = [
    {
      label: "Tokens",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Available Tokens</h3>
          <p>
            Overview of all your assets held within the fiatsend tesnet
            ecosystem
          </p>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md space-y-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Assets</th>
                <th className="py-2 px-4 text-left">Balance</th>
                <th className="py-2 px-4 text-left">USD Value</th>
                <th className="py-2 px-4 text-left">24h</th>
              </tr>
            </thead>
            <tbody>
              {tokenBalances.map((token) => {
                const usdValue = token.balance * token.usdRate;
                return (
                  <tr
                    key={token.symbol}
                    className="border-b hover:bg-gray-50 rounded"
                  >
                    <td className="py-2 px-4 flex">
                      <Image
                        src={token.icon}
                        alt={token.symbol}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      <span>{token.symbol}</span>
                    </td>
                    <td className="py-2 px-4">{token.balance.toFixed(2)}</td>
                    <td className="py-2 px-4">${usdValue.toFixed(2)}</td>
                    <td className="py-2 px-4">N/A</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            * USD rates provided by mock oracle
          </p>
        </div>
      ),
    },
    {
      label: "Verifiable Credentials",
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Verified Credentials</h3>

          <h3 className="text-lg font-semibold mb-4 mt-8">
            Unverified Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unverifiedCredentials.map((credential, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-2">{credential.icon}</div>
                <h4 className="text-xl font-bold mb-2">{credential.name}</h4>
                <p className="text-sm mb-1">Issuer: {credential.issuer}</p>
                <p className="text-sm">Issued: {credential.date}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    Unverified
                  </span>
                  <button className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-opacity-90 transition-colors duration-300">
                    Verify Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            These credentials are securely stored and can be shared selectively.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      {/* Balance Information */}
      <div className="flex flex-col gap-4 mb-6 sm:gap-8 bg-gradient-to-br from-blue-50 to-purple-100 p-4 sm:p-8 rounded-xl shadow-lg transition-shadow duration-300">
        <div className="flex-1 space-y-4 sm:space-y-8">
          <VerifyNoticeCard />
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:gap-8 bg-gradient-to-br from-blue-50 to-purple-100 p-4 sm:p-8 rounded-xl shadow-lg transition-shadow duration-300">
        <div className="flex-1 space-y-4 sm:space-y-8">
          <div className="flex flex-col gap-4 bg-gradient-to-r from-teal-400 to-blue-500 p-6 rounded-b-lg">
            <div>
              <h1 className="text-md font-bold text-white">Total balance</h1>
              <h2 className="text-4xl font-semibold text-white">
                ${totalBalance.toFixed(2)}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-green-100 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <span className="text-sm sm:text-md font-medium text-gray-600">
                  Transferable
                </span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-green-600">
                    $0
                  </span>
                  <span className="ml-2 text-xs text-gray-500">USD</span>
                </div>
              </div>
              <div className="flex-1 bg-red-100 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <span className="text-sm sm:text-md font-medium text-gray-600">
                  Locked
                </span>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-orange-600">
                    ${totalBalance.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">USD</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {/* Transferable Card */}
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <button className="p-2 text-gray-500 sm:p-4">
                  <PlusIcon
                    aria-hidden="true"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                </button>
                <span className="mt-2 text-xs sm:text-sm font-medium text-gray-500">
                  Add
                </span>
              </div>
            </div>
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <button className="p-2 text-gray-500 sm:p-4">
                  <ArrowUpIcon
                    aria-hidden="true"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                </button>
                <span className="mt-2 text-xs sm:text-sm font-medium text-gray-500">
                  Send
                </span>
              </div>
            </div>
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <button className=" p-2 text-gray-500 sm:p-4">
                  <ArrowPathIcon
                    aria-hidden="true"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                </button>
                <span className="mt-2 text-xs sm:text-sm font-medium text-gray-500">
                  Swap
                </span>
              </div>
            </div>
            {/* Locked Card */}
            <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <button className="p-2 text-gray-500 sm:p-4">
                  <BuildingLibraryIcon
                    aria-hidden="true"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  />
                </button>
                <span className="mt-2 text-xs sm:text-sm font-medium text-gray-500">
                  Bank
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs tabsData={tabsData} />
      </div>
    </Fragment>
  );
};

export default Portfolio;
