import React from "react";
import { useRouter } from "next/navigation";

const StickyNavbar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around items-center border-t border-gray-300 sm:hidden">
      <button
        disabled
        onClick={() => handleNavigation("/rewards")}
        className="flex flex-col items-center opacity-50"
      >
        <span className="text-lg">Rewards</span>
        <span className="text-sm text-gray-500">Coming Soon</span>
      </button>
      <button
        onClick={() => handleNavigation("/faucet")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Faucet</span>
      </button>
      <button
        onClick={() => handleNavigation("/liquidity")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Liquidity</span>
      </button>
      <button
        onClick={() => handleNavigation("https://docs.fiatsend.com")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Guide</span>
      </button>
    </div>
  );
};

export default StickyNavbar;
