"use client";

import React, { useEffect, useState } from "react";
import withFiatsendNFT from "@/hocs/with-account";
// import VerificationCard from "@/components/verification/card";
import Transfer from "@/components/offramp/transfer";
import ReceiveStablecoins from "@/components/offramp/ReceiveStableCoins";
import { formatUnits } from "viem";
import toast from "react-hot-toast";
import FiatSendABI from "@/abis/FiatSend.json";
import { useReadContract } from "wagmi";
import GHSFIATABI from "@/abis/GHSFIAT.json";
import Link from "next/link";

const OfframpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"receive" | "transfer">("receive");
  const [exchangeRate, setExchangeRate] = useState<number>(14);
  const [fiatsendReserves, setFiatsendReserves] = useState<number>(0);

  const { data: exRates, error: exRatesError } = useReadContract({
    address: "0xaB310b0C3eE366C839319b09407FF2A66A92771E",
    abi: FiatSendABI.abi,
    functionName: "conversionRate",
  });

  const { data: reservesData, error: reservesError } = useReadContract({
    address: "0x84Fd74850911d28C4B8A722b6CE8Aa0Df802f08A", // GHSFIAT token address
    abi: GHSFIATABI.abi, // ABI for GHSFIAT token
    functionName: "balanceOf",
    args: ["0xaB310b0C3eE366C839319b09407FF2A66A92771E"], // Fiatsend contract address
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (exRates) {
          const formattedRate = formatUnits(exRates as bigint, 2);
          setExchangeRate(Number(formattedRate));
        } else if (exRatesError) {
          toast.error("Error fetching exchange rates");
        }

        if (reservesData) {
          const formattedReserves = formatUnits(reservesData as bigint, 18); // Assuming GHSFIAT has 18 decimals
          setFiatsendReserves(Number(formattedReserves));
        } else if (reservesError) {
          toast.error("Error fetching reserves");
        }
      } catch (err) {
        toast.error("Could not fetch data");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [exRates, exRatesError, reservesData, reservesError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16">
      {/* <VerificationCard /> */}
      <h2 className="text-xl font-bold mb-4">
        GHSFIAT Reserves:{" "}
        <span className="text-[#009A80]">{fiatsendReserves} GHSFIAT</span>
      </h2>

      <h2 className="text-sm font-bold mb-4">
        Contract:{" "}
        <Link
          href={
            "https://sepolia-blockscout.lisk.com/address/0xaB310b0C3eE366C839319b09407FF2A66A92771E?tab=read_write_contract"
          }
          target="_blank"
          className="text-[#3640d2] underline"
        >
          0xaB...92771E
        </Link>
      </h2>

      {/* <button disabled className="bg-[#009A80] text-white">
        Verify Proof of reserve
      </button> */}
      <div className="relative flex items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("receive")}
            className={`py-2 px-4 rounded-l-lg transition-all duration-300 ${
              activeTab === "receive"
                ? "bg-[#009A80] text-white"
                : "bg-gray-200"
            }`}
          >
            Transfer to fiatsend.eth
          </button>
          <button
            onClick={() => setActiveTab("transfer")}
            className={`py-2 px-4 rounded-r-lg transition-all duration-300 ${
              activeTab === "transfer"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Send with wallet
          </button>
        </div>
        <div
          className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
            activeTab === "receive" ? "w-1/2" : "w-1/2 translate-x-full"
          }`}
        />
      </div>

      {/* Render Active Tab Component */}
      {activeTab === "receive" ? (
        <ReceiveStablecoins
          reserve={fiatsendReserves}
          exchangeRate={exchangeRate}
        />
      ) : (
        <Transfer reserve={fiatsendReserves} exchangeRate={exchangeRate} />
      )}
    </div>
  );
};

export default withFiatsendNFT(OfframpPage);
