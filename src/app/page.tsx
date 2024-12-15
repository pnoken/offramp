"use client";

import React, { useState } from "react";
import ReceiveStableCoins from "@/components/offramp/ReceiveStableCoins";
import SendFiat from "@/components/offramp/SendFiat";

const OfframpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"fiatsend" | "stablecoins">(
    "fiatsend"
  );
  const remainingLimit = 1000; // Example remaining limit, replace with actual logic

  const handleTabChange = (tab: "fiatsend" | "stablecoins") => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          How would you like to Offramp?
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-around mb-4">
          <button
            onClick={() => handleTabChange("fiatsend")}
            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${
              activeTab === "fiatsend"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Send to fiatsend.eth
          </button>
          <button
            onClick={() => handleTabChange("stablecoins")}
            className={`py-2 px-4 rounded-lg transition-colors duration-200 ${
              activeTab === "stablecoins"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Receive Stable Coins
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "fiatsend" && (
          <div>
            <SendFiat remainingLimit={remainingLimit} />
          </div>
        )}

        {activeTab === "stablecoins" && <ReceiveStableCoins />}
      </div>
    </div>
  );
};

export default OfframpPage;
