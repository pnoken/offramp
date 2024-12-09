"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-dispatch";
import { createNewWallet } from "@/redux/slices/wallet-slice";
import { motion } from "framer-motion";
import { Drawer } from "@/components/ui/drawer/drawer";
import DrawerContent from "@/components/drawer/content/import";
import { usePrivy } from "@privy-io/react-auth";
import withAuth from "@/hocs/with-auth";
import { LoginButton } from "@/components/ui/button/login";

const WebWallet: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { customerDid } = useAppSelector((state) => state.wallet);

  const handleCreateNewWallet = async () => {
    try {
      dispatch(createNewWallet()).then(() => router.push("/password/create"));
    } catch (error) {
      console.error("Failed to create new wallet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <Image
              alt="Fiatsend wallet"
              src="/images/fiatsend.png"
              width={80}
              height={80}
              className="mx-auto mb-8"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Send Money Instantly
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Transfer Stablecoins to and receive Fiat directly in your mobile
              wallet.
            </p>
            <div className="space-y-4">
              <LoginButton />
            </div>
          </div>
          <div className="md:w-1/2 bg-gradient-to-br from-green-500 to-yellow-500 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">
                Unlock Instant Transactions
              </h2>
              <p className="mb-6">
                Experience seamless transfers and full control over your funds.
              </p>
              <ul className="text-left list-disc list-inside">
                <li>Fast and secure transactions</li>
                <li>Manage your digital identity effortlessly</li>
                <li>Join the future of finance with Fiatsend</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <DrawerContent onClose={() => setIsOpen(false)} />
      </Drawer>
      <p className="absolute bottom-4 left-4 text-sm text-gray-500">
        Web App v 0.1.1
      </p>
    </div>
  );
};

export default withAuth(WebWallet);
