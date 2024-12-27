"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import FiatSendABI from "@/abis/FiatSend.json";
import { toast } from "react-hot-toast";
import TetherTokenABI from "@/abis/TetherToken.json";
import Link from "next/link";
import { formatUnits, parseUnits } from "viem";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance?: string;
  address?: string;
}

const FIATSEND_ADDRESS = "0xA5abAA2fA755C1AC378912280C5F703A1c162BCb";
const USDT_ADDRESS = "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168";

const stablecoins: Token[] = [
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "/images/tokens/usdt.png",
    address: "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168",
  },
];

interface TransferProps {
  exchangeRate: number; // Specify the type of exchangeRate
  reserve: number;
}

const Transfer: React.FC<TransferProps> = ({ exchangeRate, reserve }) => {
  const [ghsAmount, setGhsAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [usdtAllowance, setAllowance] = useState("");
  const { address } = useAccount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    writeContract,
    isPending,
    data: hash,
    error: writeError,
  } = useWriteContract();
  const [selectedQuoteToken, setSelectedQuoteToken] = useState<Token>({
    symbol: "USDT",
    name: "Tether USD",
    icon: "/images/tokens/usdt.png",
    address: USDT_ADDRESS,
  });

  const { data: usdtBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: TetherTokenABI.abi,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  const { data: currentusdtAllowance, error: AllowanceError } = useReadContract(
    {
      address: USDT_ADDRESS,
      abi: TetherTokenABI.abi,
      functionName: "allowance",
      args: address ? [address, FIATSEND_ADDRESS] : undefined,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!address) {
          setAllowance(""); // Reset allowance if address is not provided
          return;
        }

        if (currentusdtAllowance) {
          // Safely format and set the allowance
          setAllowance(formatUnits(currentusdtAllowance as bigint, 0));
        } else if (AllowanceError) {
          toast.error("Error fetching allowances");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred");
      }
    };

    fetchData();
  }, [address, currentusdtAllowance, AllowanceError]);

  const handleApprove = async () => {
    const amount = parseUnits(usdtAmount, 18);

    try {
      writeContract({
        address: USDT_ADDRESS,
        abi: TetherTokenABI.abi,
        functionName: "approve",
        args: [FIATSEND_ADDRESS, amount],
      });
      //toast.success("USDT approved successfully!", { id: toastId });
    } catch (error) {
      console.error("Error approving USDT:", error);
      toast.error("Failed to approve USDT");
    }
  };

  const formattedBalance = usdtBalance
    ? Number(formatUnits(usdtBalance as bigint, 18)).toFixed(2)
    : "0.00";

  const handleSendFiat = async () => {
    if (!ghsAmount || isNaN(Number(ghsAmount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!usdtAmount || isNaN(Number(usdtAmount))) {
      toast.error("Invalid USDT amount");
      return;
    }

    // Check if the amount in USDT exceeds the reserves
    const parsedUsdtAmount = parseUnits(usdtAmount, 18);
    const usdtAmountInGHS = Number(usdtAmount) * exchangeRate; // Convert USDT amount to GHS

    if (usdtAmountInGHS > reserve) {
      toast.error("Low Fiatsend reserves. Please enter a lower amount.");
      return;
    }

    try {
      // Proceed with the transaction
      writeContract({
        address: FIATSEND_ADDRESS,
        abi: FiatSendABI.abi,
        functionName: "offRamp",
        args: [parsedUsdtAmount],
      });
    } catch (error: any) {
      handleTransactionError(error, error);
    }
  };

  const handleTransactionError = (error: any, toastId: string) => {
    if (error.message?.includes("user rejected")) {
      toast.error("Transaction cancelled by user", { id: toastId });
    } else if (error.message?.includes("insufficient funds")) {
      toast.error("Insufficient funds for transaction", { id: toastId });
    } else {
      toast.error("Transaction failed. Please try again", { id: toastId });
    }
  };

  const handleGhsAmountChange = (value: string) => {
    setGhsAmount(value);
    if (value && !isNaN(Number(value)) && exchangeRate) {
      // Convert GHS to USDT considering the exchange rate
      const ghsValue = Number(value);
      // If exchangeRate is 17, then for 170 GHS:
      // 170 / 17 = 10 USDT
      const usdtValue = ghsValue / exchangeRate;

      // Format to 6 decimal places for USDT display
      setUsdtAmount(usdtValue.toFixed(2));
    } else {
      setUsdtAmount("");
    }
  };
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 my-12 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Offramp your USDT</h1>
        <Link href={"/settings"} className="p-2 rounded-full hover:bg-gray-100">
          <Image
            src="/images/icons/settings.png"
            alt="Settings"
            width={24}
            height={24}
          />
        </Link>
      </div>

      <div className="flex-1 relative">
        <div
          className="w-full p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={selectedQuoteToken.icon}
                alt={selectedQuoteToken.name}
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="font-medium">{selectedQuoteToken.symbol}</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {stablecoins.map((token) => (
              <div
                key={token.symbol}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                  selectedQuoteToken.symbol === token.symbol
                    ? "bg-indigo-50"
                    : ""
                }`}
                onClick={() => {
                  setSelectedQuoteToken(token);
                  setIsDropdownOpen(false);
                }}
              >
                <Image
                  src={token.icon}
                  alt={token.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="font-medium">{token.symbol}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Currency Exchange */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <input
            type="text"
            value={ghsAmount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              handleGhsAmountChange(value);
            }}
            placeholder="0.00"
            disabled={isPending}
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
          </div>
        </div>

        <div className="flex justify-center">
          <button className="p-2 bg-gray-100 rounded-full">
            <Image
              src="/images/icons/arrow-down.png"
              alt="Swap"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount</span>
              <span className="text-sm text-gray-500">
                Balance: {formattedBalance} {selectedQuoteToken.symbol}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="0.0"
                  disabled
                  value={usdtAmount}
                  onChange={(e) => setUsdtAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-medium focus:outline-none pr-16"
                />
              </div>
              <div className="flex items-center justify-end sm:justify-start space-x-2 bg-white rounded-lg px-3 py-2">
                <Image
                  src={selectedQuoteToken.icon}
                  alt={selectedQuoteToken.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{selectedQuoteToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Pool Stats */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-medium">{exchangeRate.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fees</span>
              <span className="font-medium text-green-600">free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Info */}

      {/* Action Button */}
      {Number(usdtAllowance) < parseUnits(usdtAmount, 18) && (
        <button
          onClick={handleApprove}
          disabled={isPending || !usdtAmount}
          className="w-full py-3 px-4 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Approve USDT
        </button>
      )}

      <button
        onClick={handleSendFiat}
        disabled={isPending || !ghsAmount || formattedBalance < usdtAmount}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
            ${
              isPending || !ghsAmount || formattedBalance < usdtAmount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          "Send USDT"
        )}
      </button>
      {hash && toast.success("Transaction confirmed")}
    </div>
  );
};

export default Transfer;
