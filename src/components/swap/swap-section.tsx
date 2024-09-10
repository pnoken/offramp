import React, { useEffect, useState } from "react";
import { SwapInput } from "../ui/input/swap-input";
import { motion } from "framer-motion";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";

export const SwapSection: React.FC<{
    selectedCurrencyPair: { from: string; to: string };
    onCurrencyPairSelect: (from: string, to: string) => void;
    amount: string;
    onAmountChange: (value: string) => void;
}> = ({ selectedCurrencyPair, onCurrencyPairSelect, amount, onAmountChange }) => {
    const handleReset = () => {
        onAmountChange('');
        onCurrencyPairSelect('GHS', 'USDC');
    };

    const currencies = ["GHS", "USDC", "KES"];

    useEffect(() => {
        if (!selectedCurrencyPair.from && !selectedCurrencyPair.to) {
            onCurrencyPairSelect('GHS', 'USDC');
        }
    }, []);

    const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onCurrencyPairSelect(e.target.value, selectedCurrencyPair.to);
    };

    const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onCurrencyPairSelect(selectedCurrencyPair.from, e.target.value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAmountChange(e.target.value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-6 my-6 bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl shadow-lg"
        >
            <SwapInput
                onCurrencyChange={handleFromCurrencyChange}
                selectValue={selectedCurrencyPair.from || 'GHS'}
                currencies={currencies}
                onChange={handleAmountChange}
                label="You pay"
                placeholder="0.00"
                value={amount}
                onReset={handleReset}
            />
            <div className="flex items-center justify-center my-4">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-bgGreen1 text-slate-800 rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => onCurrencyPairSelect(selectedCurrencyPair.to, selectedCurrencyPair.from)}
                >
                    <ArrowsUpDownIcon className="h-6 w-6" />
                </motion.button>
            </div>
            <SwapInput
                onCurrencyChange={handleToCurrencyChange}
                selectValue={selectedCurrencyPair.to || 'USDC'}
                currencies={currencies}
                onChange={() => { }}
                label="You receive"
                placeholder="0.00"
                value=""
                onReset={handleReset}
                isReadOnly={true}
            />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 bg-bgGreen1 text-slate-800 py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
                Swap Currencies
            </motion.button>
        </motion.div>
    );
};

export default SwapSection;