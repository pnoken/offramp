'use client'

import React, { useState } from 'react';
import { TbdexHttpClient, Rfq, Quote, Order, OrderStatus, Close, Message } from '@tbdex/http-client';
import { VerifiableCredential, PresentationExchange } from '@web5/credentials';
import { resolveDid } from '@tbdex/protocol'
import SwapSection from '@/components/swap/swap-section';

const currencies = ["GHS", "USD", "KES"];

const Exchange: React.FC = () => {
    // State for input amounts
    const [amountFrom, setAmountFrom] = useState<number>(0);
    const [amountTo, setAmountTo] = useState<number>(0);

    // State for selected currencies
    const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
    const [currencyTo, setCurrencyTo] = useState<string>("GHS");




    return (
        <div className="container h-screen mx-auto px-4 py-8 bg-black">
            <h2 className="text-2xl font-bold mb-4">Currency Exchange</h2>


            <div className="lg:w-1/2 w-full mx-auto">
                <SwapSection />
            </div>

        </div>
    );
};

export default Exchange;
