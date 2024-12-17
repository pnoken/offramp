"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import WalletDrawer from "../ui/drawer/wallet-drawer";

const navItems = [
  { name: "Transfer", href: "/" },
  { name: "Faucet", href: "/faucet" },
  { name: "Liquidity", href: "/liquidity" },
  { name: "Vault", href: "/vault", disabled: true, comingSoon: true },
  { name: "Rewards", href: "/rewards", disabled: true, comingSoon: true },
];

const Navbar = () => {
  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <nav className="bg-[#0D0D0D] fixed w-full z-50 h-12">
      <div className="max-w-7xl mx-auto px-3 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/fiatsend.png"
                height={24}
                width={24}
                alt="Fiatsend Icon"
                className="mr-2"
              />
              <span className="text-sm font-semibold text-white">Fiatsend</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <React.Fragment key={item.name}>
                  {item.disabled ? (
                    <span className="px-3 py-1 rounded-md text-sm text-gray-300 opacity-50">
                      {item.name} (Coming soon)
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pathname === item.href
                          ? "text-white bg-gray-800"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              <a
                href="https://docs.fiatsend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Guide
              </a>
            </div>
          </div>

          {/* Right side - Wallet Connection */}
          <div className="flex items-center">
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </div>
          {/* <button
            onClick={toggleDrawer}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="#fff"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button> */}
        </div>
      </div>
      <WalletDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </nav>
  );
};

export default Navbar;
