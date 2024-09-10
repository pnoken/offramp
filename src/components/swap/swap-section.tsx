import React, { useEffect, useState } from "react";
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

    const currencies = ["GHS", "USDC", "KES"];

    useEffect(() => {
        // Set default currencies when component mounts
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
        <div className="flex flex-col p-3 my-3 bg-slate-800 rounded-2xl">
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
            {/* Swap Button */}
            <div className="flex items-center justify-center max-h-[10px] min-h-[10px] transition-all duration-300">
                <div className="bg-[#010D09] rounded-full flex items-center justify-center h-[52px] w-[52px] z-10">
                    <button
                        className="relative align-middle select-none font-sans font-medium text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none max-w-[40px] max-h-[40px] text-xs shadow-md shadow-light-green-500/20 hover:shadow-lg hover:shadow-light-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none z-10 h-[36px] w-[36px] overflow-hidden bg-bgGreen1/10 hover:bg-bgGreen1/20 rounded-full text-bgGreen1 border-2 border-bgGreen1 hover:rotate-[180deg] transition-all duration-300"
                        type="button"
                        onClick={() => onCurrencyPairSelect(selectedCurrencyPair.to, selectedCurrencyPair.from)}
                    >
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                            <svg viewBox="0 0 30 30" fill="inherit" xmlns="http://www.w3.org/2000/svg" style={{ width: '36px', fill: 'rgb(95, 223, 172)', minWidth: '36px' }}>
                                <path d="M13.97 9.706v9.265h-2.058v-4.118H8.823l5.147-5.147Zm4.118 5.147h3.088L16.03 20v-9.264h2.059v4.117Z" fill="inherit"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
            <SwapInput
                onCurrencyChange={handleToCurrencyChange}
                selectValue={selectedCurrencyPair.to || 'USDC'}
                currencies={currencies}
                onChange={() => { }} // This input is read-only
                label="You receive"
                placeholder="0.00"
                value="" // This should be calculated based on the exchange rate
                onReset={handleReset}
                isReadOnly={true}
            />
        </div>
    );
};

export default SwapSection;