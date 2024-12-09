"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { ready, authenticated, user, connectOrCreateWallet } = usePrivy();
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
    { name: "Deposit", href: "/deposit" },
    { name: "Faucet", href: "/faucet" },
    { name: "Liquidity", href: "/liquidity" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/home" className="flex items-center">
              <Image
                src="/images/fiatsend.png"
                height={40}
                width={40}
                alt="Fiatsend Icon"
                className="mr-3"
              />
              <span className="text-xl font-bold text-indigo-600">
                Fiatsend | Alewa
              </span>
            </Link>

            <div className="hidden xl:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://docs.fiatsend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Guide
              </a>
            </div>
          </div>

          {/* Right side - Wallet Connection */}
          <div className="flex items-center">
            {ready && authenticated && user?.wallet ? (
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                {shortenedAddress}
              </button>
            ) : (
              <button
                onClick={connectOrCreateWallet}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
