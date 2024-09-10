'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CreateDone: React.FC = () => {
    const router = useRouter();

    const handleRoute = () => {
        router.push("/home");
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
        >
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-filter backdrop-blur-lg shadow-xl">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 rounded-full bg-green-400 flex items-center justify-center mx-auto mb-6"
                >
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>

                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-4"
                >
                    Success!
                </motion.h1>

                <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl mb-8"
                >
                    Your account has been created successfully.
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRoute}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-full text-lg font-semibold shadow-md hover:bg-opacity-90 transition duration-300 ease-in-out"
                >
                    Go to Portfolio
                </motion.button>
            </div>
        </motion.div>
    )
}

export default CreateDone;