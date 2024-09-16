'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

const ImportPrivateKey: React.FC = () => {
    const router = useRouter();
    const [privateKey, setPrivateKey] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [password,] = useLocalStorage('fs-encryptedPassword', '');


    const handleToggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-800 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl w-full space-y-8 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Import by Private Key */}
                    <div className="md:w-1/2 p-8 space-y-6">
                        <motion.h2
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-gray-800"
                        >
                            Import by Private Key
                        </motion.h2>
                        <p className="text-gray-600">To import an existing wallet, please enter the private key here:</p>

                        {/* Private Key Input Section */}
                        <div className="relative">
                            <input
                                type={isVisible ? 'text' : 'password'}
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                placeholder="Enter your private key"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            />
                            <button
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                onClick={handleToggleVisibility}
                            >
                                {isVisible ? (
                                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {/* Import Account Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled
                            className="w-full flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out"
                        >
                            <KeyIcon className="w-5 h-5 mr-2" />
                            Import Account
                        </motion.button>
                    </div>

                    {/* Right Section - What is a private key? */}
                    <div className="md:w-1/2 bg-gray-100 p-8 space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">What is a private key?</h3>
                        <p className="text-gray-600">
                            A private key is like a password — a string of letters and numbers — that can be used to restore your wallet.
                        </p>
                        <p className="text-gray-600">
                            Is it safe to enter it into your wallet? Yes. It will be stored locally and never leave your device without your explicit permission.
                        </p>
                        <div className="flex items-center mt-4 text-green-600">
                            <ShieldCheckIcon className="w-6 h-6 mr-2" />
                            <span className="font-medium">Your key is secure with us</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ImportPrivateKey;
