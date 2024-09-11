import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { SwapInput } from "../ui/input/swap-input";

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

    const currencies = ["GHS", "USDC", "KES", "USD", "NGN"];

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

    const handleAmountChange = (value: string) => {
        onAmountChange(value);
    };

    const CurrencySelect = ({ value, onChange, label }) => (
        <div className="flex flex-col w-2/5">
            <label className="text-white/80 mb-2">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full appearance-none bg-white/20 text-white py-4 pl-12 pr-10 rounded-lg outline-none transition-colors duration-300 hover:bg-white/30 text-lg font-semibold"
                >
                    {currencies.map((currency) => (
                        <option key={currency} value={currency} className="bg-indigo-600">
                            {currency}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Image
                        src={`/images/currencies/${value.toLowerCase()}.png`}
                        alt={`${value} logo`}
                        width={28}
                        height={28}
                        className="rounded-full"
                    />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-8 my-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl"
        >
            <div className="flex items-center justify-between mb-6">
                <CurrencySelect
                    value={selectedCurrencyPair.from || 'GHS'}
                    onChange={handleFromCurrencyChange}
                    label="From"
                />
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white text-indigo-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => onCurrencyPairSelect(selectedCurrencyPair.to, selectedCurrencyPair.from)}
                >
                    <ArrowsUpDownIcon className="h-6 w-6" />
                </motion.button>
                <CurrencySelect
                    value={selectedCurrencyPair.to || 'USDC'}
                    onChange={handleToCurrencyChange}
                    label="To"
                />
            </div>
            <div className="bg-white/10 p-6 rounded-xl mb-6">
                <label className="text-white/80 mb-2 block">You send</label>
                <SwapInput
                    label="You send"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    currencies={currencies}
                    selectValue={selectedCurrencyPair.from || 'GHS'}
                    onCurrencyChange={handleFromCurrencyChange}
                    onReset={() => {
                        onAmountChange('');
                        onCurrencyPairSelect('GHS', 'USDC');
                    }}
                />
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-emerald-400 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {Number(amount) > 0 ? "Review Exchange" : "Exchange"}
            </motion.button>
        </motion.div>
    );
};

export default SwapSection;