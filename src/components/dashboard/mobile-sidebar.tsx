import React from "react";
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

interface MobileSidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  setActiveComponent,
  activeComponent,
}) => {
  const menuItems = [
    { name: "Portfolio", icon: HomeIcon },
    { name: "Transactions", icon: ClockIcon },
    { name: "Exchange", icon: ArrowsRightLeftIcon },
    { name: "Settings", icon: CogIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveComponent(item.name)}
            className={`flex flex-col items-center p-2 ${
              activeComponent === item.name ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSidebar;
