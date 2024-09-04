'use client'

import React, { useState } from 'react';
import { TbdexHttpClient, Rfq, Quote, Order, OrderStatus, Close, Message } from '@tbdex/http-client';
import { VerifiableCredential, PresentationExchange } from '@web5/credentials';
import { resolveDid } from '@tbdex/protocol'

const currencies = ["GHS", "USD", "KES"];

const Exchange: React.FC = () => {
    // State for input amounts
    const [amountFrom, setAmountFrom] = useState<number>(0);
    const [amountTo, setAmountTo] = useState<number>(0);

    // State for selected currencies
    const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
    const [currencyTo, setCurrencyTo] = useState<string>("GHS");

    const createExchange = async (offering, amount, payoutPaymentDetails) => {
        const selectedCredentials = PresentationExchange.selectCredentials({
            //vcJwts: 
        })
    }



    //const didDocument = await resolveDid(pfiDid);
    //const isPFI = didDocument.service.some(service => service.type === 'PFI');


    const payinCurrencyCode = amountFrom; // Desired payin currency code
    const payoutCurrencyCode = amountTo; // Desired payout currency code

    const fetchOfferings = async () => {

        const matchedOfferings = []; // Array to store the matched offerings

        // Loop through the all PFIs in your network
        for (const pfiDid of pfiDids) {

            //Makes a request to the PFI to get their offerings
            const offerings = await TbdexHttpClient.getOfferings({ pfiDid: pfiDid });

            // Filter offerings based on the currency pair
            if (offerings) {
                const filteredOfferings = offerings.filter(offering =>
                    offering.data.payin.currencyCode === payinCurrencyCode &&
                    offering.data.payout.currencyCode === payoutCurrencyCode
                );
                matchedOfferings.push(...filteredOfferings);
            }
        }
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Currency Exchange</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* From Currency Section */}
                <div className="flex flex-col">
                    <label htmlFor="currency-from" className="font-semibold mb-2">
                        From
                    </label>
                    <select
                        id="currency-from"
                        value={currencyFrom}
                        onChange={(e) => setCurrencyFrom(e.target.value)}
                        className="p-2 border rounded mb-4"
                    >
                        {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amountFrom}
                        onChange={(e) => setAmountFrom(parseFloat(e.target.value))}
                        className="p-2 border rounded"
                    />
                </div>

                {/* To Currency Section */}
                <div className="flex flex-col">
                    <label htmlFor="currency-to" className="font-semibold mb-2">
                        To
                    </label>
                    <select
                        id="currency-to"
                        value={currencyTo}
                        onChange={(e) => setCurrencyTo(e.target.value)}
                        className="p-2 border rounded mb-4"
                    >
                        {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Converted Amount"
                        value={amountTo}
                        disabled
                        className="p-2 border rounded bg-gray-100"
                    />
                </div>
            </div>

            {/* Exchange Button */}
            <button

                className="mt-6 bg-blue-600 text-white p-2 rounded"
            >
                Get Offer
            </button>
        </div>
    );
};

export default Exchange;
