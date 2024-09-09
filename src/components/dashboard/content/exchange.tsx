'use client'

import React, { useState, useEffect } from 'react';
import SwapSection from '@/components/swap/swap-section';
import { OfferingSection } from '@/components/offerings/offering-section';
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-dispatch";

const Exchange: React.FC = () => {
    const dispatch = useAppDispatch();
    const customerDid = useAppSelector((state) => state.wallet.portableDid); // Get customer DID from wallet slice
    const customerCredentials = useAppSelector((state) => state.wallet.did); // Get customer credentials
    const { isCreating, exchange, error } = useAppSelector((state) => state.exchange); // Get exchange state

    const handleCreateExchange = (offering, amount, payoutPaymentDetails) => {
        if (!customerDid) {
            console.error('Customer DID is not available. Please create a wallet first.');
            return;
        }

        dispatch(createExchange({ offering, amount, payoutPaymentDetails, customerDid, customerCredentials })); // Pass necessary data
    };

    return (
        <div className="container h-screen mx-auto px-4 py-8 bg-gray-600">
            <h2 className="text-2xl font-bold mb-4">Currency Exchange</h2>


            <div className="lg:w-1/2 w-full mx-auto">
                <SwapSection />
                <OfferingSection />
            </div>

        </div>
    );
};

export default Exchange;
