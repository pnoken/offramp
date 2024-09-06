import React, { useState } from "react";
import { SwapInput } from "../ui/input/swap-input";

export const SwapSection: React.FC = () => {
    const handleReset = () => {
        console.log('Reset values clicked');
    };

    const currencies = ["GHS", "USD", "KES"];

    const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
    const [currencyTo, setCurrencyTo] = useState<string>("GHS");
    const [amountFrom, setAmountFrom] = useState<string>("0");
    const [amountTo, setAmountTo] = useState<string>("0");

    return (
        <div className="flex flex-col px-3">
            <SwapInput onCurrencyChange={(e) => setCurrencyFrom(e.target.value)} selectValue="GHS" currencies={currencies} onChange={(e) => setAmountFrom(e.target.value)} label="You pay" placeholder="0.00" value={amountFrom} onReset={handleReset} />
            {/* Swap Button */}
            <div className="flex items-center justify-center max-h-[10px] min-h-[10px] transition-all duration-300">
                <div className="bg-[#010D09] rounded-full flex items-center justify-center h-[52px] w-[52px] z-10">
                    <button
                        className="relative align-middle select-none font-sans font-medium text-center uppercase disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none max-w-[40px] max-h-[40px] text-xs shadow-md shadow-light-green-500/20 hover:shadow-lg hover:shadow-light-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none z-10 h-[36px] w-[36px] overflow-hidden bg-bgGreen1/10 hover:bg-bgGreen1/20 rounded-full text-bgGreen1 border-2 border-bgGreen1 hover:rotate-[180deg] transition-all duration-300"
                        type="button"
                    >
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                            <svg viewBox="0 0 30 30" fill="inherit" xmlns="http://www.w3.org/2000/svg" style={{ width: '36px', fill: 'rgb(95, 223, 172)', minWidth: '36px' }}>
                                <path d="M13.97 9.706v9.265h-2.058v-4.118H8.823l5.147-5.147Zm4.118 5.147h3.088L16.03 20v-9.264h2.059v4.117Z" fill="inherit"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
            <SwapInput onCurrencyChange={(e) => setCurrencyTo(e.target.value)} selectValue="USD" currencies={currencies} onChange={(e) => setAmountTo(e.target.value)} label="You receive" placeholder="0.00" value={amountTo} onReset={handleReset} />
            <button className='rounded-full text-lg p-3 my-3 bg-green-500'>Exchange</button>
        </div>
    );
};

export default SwapSection;