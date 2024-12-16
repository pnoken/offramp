"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useSwitchChain } from "wagmi";
import withFiatsendNFT from "@/hocs/with-account";
import FiatSendABI from "@/abis/FiatSend.json";
import { toast } from "react-hot-toast";
import TetherTokenABI from "@/abis/TetherToken.json";
import { BrowserProvider, ethers, parseUnits } from "ethers";
import { liskSepolia } from "viem/chains";
import Link from "next/link";

interface SendFiatProps {
  remainingLimit: number;
}

interface CurrencyAmount {
  amount: string;
  currency: "USDT" | "GHS";
}

interface Recipient {
  name: string;
  phoneNumber: string;
  provider: "MTN" | "Telecel" | "AT";
}

const FIATSEND_ADDRESS = "0x9e4fCd5Cc9D80a49184715c8BA1C3C6729E05A93" as const;
const USDT_ADDRESS = "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168";

const OfframpPage: React.FC = () => {
  const { switchChain } = useSwitchChain();
  const [ghsAmount, setGhsAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number>(17);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window.ethereum === "undefined") return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const fiatSendContract = new ethers.Contract(
          FIATSEND_ADDRESS,
          FiatSendABI.abi,
          provider
        );
        const usdtContract = new ethers.Contract(
          USDT_ADDRESS,
          TetherTokenABI.abi,
          provider
        );

        try {
          // Get conversion rate (assuming it's stored with 6 decimals in contract)
          const rate = await fiatSendContract.conversionRate();
          // If rate is 17000000 (17 with 6 decimals), this will give us 17
          setExchangeRate(Number(rate));
        } catch (err) {
          toast.error("Could not fetch rates");
        }

        // Get allowance if address exists
        if (address) {
          const currentAllowance = await usdtContract.allowance(
            address,
            FIATSEND_ADDRESS
          );
          setAllowance(currentAllowance);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch exchange rate");
      }
    };

    fetchData();
  }, [address]);

  const handleApprove = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Approving USDT...");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        TetherTokenABI.abi,
        signer
      );

      // Convert USDT amount to contract format (multiply by 1e6)
      const amount = parseUnits(usdtAmount, 6);
      const tx = await usdtContract.approve(FIATSEND_ADDRESS, amount);

      toast.loading("Waiting for approval confirmation...", { id: toastId });
      await tx.wait();

      setAllowance(amount);
      toast.success("USDT approved successfully!", { id: toastId });
    } catch (error: any) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve USDT", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const [recipient, setRecipient] = useState<Recipient | null>({
    name: "Nura Mohammed",
    phoneNumber: "0548614047",
    provider: "MTN",
  });

  const [showRecipientForm, setShowRecipientForm] = useState(false);

  const handleSendFiat = async () => {
    if (!ghsAmount || isNaN(Number(ghsAmount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!usdtAmount || isNaN(Number(usdtAmount))) {
      toast.error("Invalid USDT amount");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Preparing transaction...");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId.toString() !== liskSepolia.id.toString()) {
        toast.loading("Switching to Lisk Sepolia network...", { id: toastId });
        await switchChain({ chainId: liskSepolia.id });
      }

      const signer = await provider.getSigner();

      // First approve USDT transfer
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        TetherTokenABI.abi,
        signer
      );

      const parsedUsdtAmount = parseUnits(usdtAmount, 6);

      // Check USDT balance first
      const balance = await usdtContract.balanceOf(address);
      if (balance < parsedUsdtAmount) {
        toast.error("Insufficient USDT balance", { id: toastId });
        return;
      }

      // Check and update allowance if needed
      if (allowance < parsedUsdtAmount) {
        toast.loading("Approving USDT transfer...", { id: toastId });
        try {
          console.log("Current allowance:", allowance.toString());
          console.log("Required amount:", parsedUsdtAmount.toString());

          const approveTx = await usdtContract.approve(
            FIATSEND_ADDRESS,
            parsedUsdtAmount
          );

          toast.loading("Waiting for approval confirmation...", {
            id: toastId,
          });
          const receipt = await approveTx.wait();
          console.log("Approval receipt:", receipt);

          // Verify the new allowance
          const newAllowance = await usdtContract.allowance(
            address,
            FIATSEND_ADDRESS
          );
          console.log("New allowance:", newAllowance.toString());

          setAllowance(parsedUsdtAmount);
          toast.success("USDT approved successfully!", { id: toastId });
        } catch (error) {
          console.error("Approval error:", error);
          toast.error("Failed to approve USDT. Please try again", {
            id: toastId,
          });
          return;
        }
      }

      // Now interact with FiatSend contract
      const fiatSendContract = new ethers.Contract(
        FIATSEND_ADDRESS,
        FiatSendABI.abi,
        signer
      );

      // Add this before gas estimation
      try {
        // Check if user is verified
        const isVerified = await fiatSendContract.isVerifiedUser(address);
        console.log("User verification status:", isVerified);

        // Check USDT balance of the contract
        const contractBalance = await usdtContract.balanceOf(FIATSEND_ADDRESS);
        console.log("Contract USDT balance:", contractBalance.toString());

        // Check user's USDT balance again
        const userBalance = await usdtContract.balanceOf(address);
        console.log("User USDT balance:", userBalance.toString());
      } catch (error) {
        console.error("Error checking contract state:", error);
      }

      // Estimate gas first to check if the transaction will fail
      try {
        // Log the parameters for debugging
        console.log("Estimating gas for amount:", parsedUsdtAmount.toString());

        await fiatSendContract.depositStablecoin.estimateGas(parsedUsdtAmount);
      } catch (error: any) {
        console.error("Gas estimation failed:", error);
        // Log more details about the error
        console.log("Contract address:", FIATSEND_ADDRESS);
        console.log("USDT amount:", parsedUsdtAmount.toString());
        console.log("Sender address:", address);

        if (error.message?.includes("execution reverted")) {
          toast.error(
            "Transaction would fail. Please verify your account status and USDT balance",
            { id: toastId }
          );
        } else {
          toast.error(
            "Failed to estimate gas. Make sure you have enough USDT and are verified",
            { id: toastId }
          );
        }
        return;
      }

      toast.loading("Waiting for confirmation...", { id: toastId });
      // Add overrides to the transaction
      const tx = await fiatSendContract.depositStablecoin(parsedUsdtAmount, {
        from: address,
        gasLimit: 500000, // Increased gas limit
      });

      toast.loading("Processing transaction...", { id: toastId });
      await tx.wait();

      toast.success("Transaction completed successfully!", { id: toastId });
      setGhsAmount("");
      setUsdtAmount("");
    } catch (error: any) {
      console.error("Transaction failed:", error);

      // Enhanced error handling
      if (error.message?.includes("User is not verified")) {
        toast.error(
          "Your account is not verified. Please complete verification first.",
          { id: toastId }
        );
      } else if (error.message?.includes("Amount must be greater than zero")) {
        toast.error("Amount must be greater than zero", { id: toastId });
      } else if (error.message?.includes("Stablecoin transfer failed")) {
        toast.error(
          "USDT transfer failed. Please check your balance and allowance",
          { id: toastId }
        );
      } else if (error.message?.includes("execution reverted")) {
        toast.error(
          "Transaction failed. Please verify your account status and USDT balance",
          { id: toastId }
        );
      } else if (error.message?.includes("missing revert data")) {
        toast.error(
          "Transaction would fail. Please verify your account status and try again",
          { id: toastId }
        );
      } else {
        handleTransactionError(error, toastId);
      }
    } finally {
      setIsProcessing(false);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Offramp your USDT</h1>
          <Link
            href={"/settings"}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Image
              src="/images/icons/settings.png"
              alt="Settings"
              width={24}
              height={24}
            />
          </Link>
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
              disabled={isProcessing}
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

          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <input
              type="number"
              value={usdtAmount}
              disabled
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
            </div>
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <Image src="/moolre.svg" alt="Route" width={24} height={24} /> */}
            {/* <span className="text-gray-600">Settlement Route</span> */}
          </div>
          <span className="text-gray-600">Fees: $0.05</span>
        </div>

        {/* Action Button */}
        {allowance < (usdtAmount ? parseUnits(usdtAmount, 6) : BigInt(0)) && (
          <button
            onClick={handleApprove}
            disabled={isProcessing || !usdtAmount}
            className="w-full py-3 px-4 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Approve USDT
          </button>
        )}

        <button
          onClick={handleSendFiat}
          disabled={
            isProcessing ||
            !ghsAmount ||
            allowance < (usdtAmount ? parseUnits(usdtAmount, 6) : BigInt(0))
          }
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
            ${
              isProcessing ||
              !ghsAmount ||
              allowance < (usdtAmount ? parseUnits(usdtAmount, 6) : BigInt(0))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {isProcessing ? (
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
      </div>
    </div>
  );
};

export default withFiatsendNFT(OfframpPage);
