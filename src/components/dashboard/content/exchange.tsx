'use client'

import React, { useState, useEffect } from 'react';
import SwapSection from '@/components/swap/swap-section';
import { OfferingSection } from '@/components/offerings/offering-section';
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-dispatch";
import { fetchOfferings } from '@/lib/offering-slice';
import LoadingPulse from '@/components/animate/loading-pulse';
import { Offering as TbdexOffering } from '@tbdex/protocol';


const Exchange: React.FC = () => {
    const dispatch = useAppDispatch();
    const customerDid = useAppSelector((state) => state.wallet.portableDid); // Get customer DID from wallet slice
    const customerCredentials = useAppSelector((state) => state.wallet.did); // Get customer credentials
    const { isCreating, exchange, error } = useAppSelector((state) => state.exchange); // Get exchange state

    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState({ from: '', to: '' });
    const [amount, setAmount] = useState('');
    const { matchedOfferings = [], status = 'idle', error: offeringsError = null } = useAppSelector((state) => state.offering) || {};

    useEffect(() => {
        if (selectedCurrencyPair.from && selectedCurrencyPair.to && amount) {
            dispatch(fetchOfferings());
        }
    }, [selectedCurrencyPair, amount, dispatch]);

    const handleCurrencyPairSelect = (from: string, to: string) => {
        setSelectedCurrencyPair({ from, to });
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
    };

    const renderOfferings = () => {
        if (status === 'idle') {
            return null
        }

        if (status === 'loading') {
            return <LoadingPulse />;
        }

        if (status === 'failed') {
            return <p>Error: {offeringsError}</p>;
        }

        if (matchedOfferings.length === 0) {
            return <p>No offerings available for the selected currency pair.</p>;
        }

        return matchedOfferings.map((offering: TbdexOffering) => (
            <OfferingSection key={offering.metadata.id} offering={offering as any} amount={amount} />
        ));
    };

    return (
        <div className="container h-screen mx-auto px-4 py-8 bg-gray-600">
            <h2 className="text-2xl font-bold mb-4">Currency Exchange</h2>

            <div className="lg:w-1/2 w-full mx-auto">
                <SwapSection
                    selectedCurrencyPair={selectedCurrencyPair}
                    onCurrencyPairSelect={handleCurrencyPairSelect}
                    amount={amount}
                    onAmountChange={handleAmountChange}
                />
                {renderOfferings()}
            </div>

        </div>
    );
};

export default Exchange;
