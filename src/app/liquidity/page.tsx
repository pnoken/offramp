import React from "react";
import Pool from "@/components/liquidity/pool";

const LiquidityPool: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <Pool />
      </div>
    </div>
  );
};

export default LiquidityPool;
