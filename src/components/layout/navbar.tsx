"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Offramp", href: "/" },
    { name: "Faucet", href: "/faucet" },
    { name: "Liquidity", href: "/liquidity" },
    { name: "Vault", href: "/vault" },
    { name: "Rewards", href: "/rewards" },
  ];

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
