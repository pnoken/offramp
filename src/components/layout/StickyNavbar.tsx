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
        onClick={() => handleNavigation("/rewards")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Rewards</span>
      </button>
      <button
        onClick={() => handleNavigation("/faucet")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Faucet</span>
      </button>
      <button
        onClick={() => handleNavigation("/guide")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Guide</span>
      </button>
      <button
        onClick={() => handleNavigation("/settings")}
        className="flex flex-col items-center"
      >
        <span className="text-lg">Settings</span>
      </button>
    </div>
  );
};

export default StickyNavbar;
