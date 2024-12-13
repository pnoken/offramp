"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { ready, authenticated, user, connectOrCreateWallet, login, logout } =
    usePrivy();
  const pathname = usePathname();

  const walletAddress = user?.wallet?.address || "";
  const shortenedAddress =
    walletAddress.length > 10
      ? `${walletAddress.substring(0, 5)}...${walletAddress.substring(
          walletAddress.length - 5
        )}`
      : walletAddress;

  const navItems = [
    { name: "Overview", href: "/home" },
    { name: "Offramp", href: "/offramp" },
    { name: "Faucet", href: "/faucet" },
    { name: "Liquidity", href: "/liquidity" },
  ];

  return (
    <nav className="bg-[#0D0D0D] fixed w-full z-50 h-12">
      <div className="max-w-7xl mx-auto px-3 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/home" className="flex items-center">
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
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pathname === item.href
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </Link>
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
          <div className="flex items-center space-x-2">
            {ready && authenticated && user?.wallet ? (
              <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                {shortenedAddress}
                <button
                  onClick={logout}
                  className="flex items-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                  title="Disconnect Wallet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12H9m6 0l-3 3m3-3l-3-3"
                    />
                  </svg>
                </button>
              </button>
            ) : (
              <button
                onClick={connectOrCreateWallet}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
