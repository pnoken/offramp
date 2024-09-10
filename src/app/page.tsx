'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/hooks/use-app-dispatch';
import { Drawer } from '@/components/ui/drawer';
import { useRouter } from 'next/navigation';
import { createNewWallet } from '@/lib/wallet-slice';
import Spinner from '@/components/spinner';
import { motion } from 'framer-motion';

export default function WebWallet() {
  const dispatch = useAppDispatch();
  const { isCreating, walletCreated } = useAppSelector((state) => state.wallet);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedDid = localStorage.getItem('customerDid');
    if (storedDid) {
      router.push("/home");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return <Spinner />;
  if (walletCreated) router.push("/account/new-did");

  const handleCreateNewWallet = () => dispatch(createNewWallet());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
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
              src="/favicon.ico"
              width={80}
              height={80}
              className="mx-auto mb-8"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Welcome to Web5
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Your gateway to decentralized identity and seamless transactions.
            </p>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNewWallet}
                disabled={isCreating}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
              >
                Create New Wallet
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="w-full py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold shadow-md hover:bg-gray-50 transition duration-300"
              >
                Import Existing Account
              </motion.button>
            </div>
          </div>
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-500 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Unlock the Future</h2>
              <p className="mb-6">Experience the power of decentralized finance with our Web5 wallet.</p>
              <ul className="text-left list-disc list-inside">
                <li>Secure and private transactions</li>
                <li>Full control over your digital identity</li>
                <li>Seamless integration with Web5 ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />
      <p className="absolute bottom-4 left-4 text-sm text-gray-500">Web Wallet v 1.00</p>
    </div>
  )
}