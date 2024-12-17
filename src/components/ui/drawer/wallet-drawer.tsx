import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import FSEND_ABI from "@/abis/FSEND.json"; // Replace with actual FSEND ABI
import USDT_ABI from "@/abis/TetherToken.json"; // Replace with actual USDT ABI
import GHSFIAT_ABI from "@/abis/GHSFIAT.json"; // Replace with actual GHSFIAT ABI

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();

  // Fetch token balances
  const { data: fsendBalance } = useReadContract({
    address: "0xYourFSENDTokenAddress", // Replace with actual FSEND token address
    abi: FSEND_ABI.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: usdtBalance } = useReadContract({
    address: "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168", // USDT address
    abi: USDT_ABI.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: ghsfiatBalance } = useReadContract({
    address: "0x84Fd74850911d28C4B8A722b6CE8Aa0Df802f08A", // GHSFIAT address
    abi: GHSFIAT_ABI.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-4"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold mb-4">Wallet Information</h2>
            <p className="mb-2">Address: {address}</p>
            <div className="space-y-2">
              <div>
                <span className="font-medium">FSEND Balance: </span>
                <span>
                  {fsendBalance
                    ? formatUnits(fsendBalance as bigint, 18)
                    : "Loading..."}
                </span>
              </div>
              <div>
                <span className="font-medium">USDT Balance: </span>
                <span>
                  {usdtBalance
                    ? formatUnits(usdtBalance as bigint, 18)
                    : "Loading..."}
                </span>
              </div>
              <div>
                <span className="font-medium">GHSFIAT Balance: </span>
                <span>
                  {ghsfiatBalance
                    ? formatUnits(ghsfiatBalance as bigint, 18)
                    : "Loading..."}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WalletDrawer;
