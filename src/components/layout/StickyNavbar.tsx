import React from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  PhoneIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

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
        <HomeIcon className="h-5 w-5 mb-1" aria-hidden="true" />
        <span className="text-md">Rewards</span>
      </button>
      <button
        onClick={() => handleNavigation("/faucet")}
        className="flex flex-col items-center"
      >
        <PhoneIcon className="h-5 w-5 mb-1" aria-hidden="true" />
        <span className="text-md">Faucet</span>
      </button>
      <button
        onClick={() => handleNavigation("/liquidity")}
        className="flex flex-col items-center"
      >
        <CurrencyDollarIcon className="h-5 w-5 mb-1" aria-hidden="true" />
        <span className="text-md">Liquidity</span>
      </button>
      <button
        onClick={() => handleNavigation("https://docs.fiatsend.com")}
        className="flex flex-col items-center"
      >
        <DocumentTextIcon className="h-5 w-5 mb-1" aria-hidden="true" />
        <span className="text-md">Guide</span>
      </button>
    </div>
  );
};

export default StickyNavbar;
