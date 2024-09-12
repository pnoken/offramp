'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SwapSection from '@/components/swap/swap-section';
import { OfferingSection } from '@/components/offerings/offering-section';
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-dispatch";
import { fetchOfferings } from '@/lib/offering-slice';
import { createExchange } from '@/lib/exchange-slice';
import LoadingPulse from '@/components/animate/loading-pulse';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import OfferingDetails from '@/components/offerings/offering-details';
import { Offering as TbdexOffering } from '@/types/offering';


const Exchange: React.FC = () => {
    const dispatch = useAppDispatch();
    const customerDid = useAppSelector((state) => state.wallet.portableDid);
    const customerCredentials = useAppSelector((state) => state.wallet.did);
    const { isCreating, exchange, error } = useAppSelector((state) => state.exchange);

    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState({ from: '', to: '' });
    const [amount, setAmount] = useState('');
    const { matchedOfferings = [], status = 'idle', error: offeringsError = null } = useAppSelector((state) => state.offering) || {};

    const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);
    const [showOfferingDetails, setShowOfferingDetails] = useState(false);
    const [selectedOffering, setSelectedOffering] = useState<TbdexOffering | null>(null);

    useEffect(() => {
        if (selectedCurrencyPair.from && selectedCurrencyPair.to && amount) {
            dispatch(fetchOfferings({ from: selectedCurrencyPair.from, to: selectedCurrencyPair.to }));
        }
    }, [selectedCurrencyPair, amount, dispatch]);

    const handleCurrencyPairSelect = (from: string, to: string) => {
        setSelectedCurrencyPair({ from, to });
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
    };

    const handleOfferingSelect = (offering: TbdexOffering) => {
        setSelectedOffering(offering);
        setSelectedOfferingId(offering.metadata.id);
    };

    const handleReviewExchange = () => {
        if (!selectedOffering) {
            setSelectedOffering(matchedOfferings[0]);
        }
        setShowOfferingDetails(true);
    };

    const handleStartExchange = () => {
        if (selectedOffering) {
            dispatch(createExchange({
                offering: selectedOffering,
                amount,
                payoutPaymentDetails: {}, // Add necessary details
                customerDid,
                customerCredentials
            }));
        }
    };

    const renderOfferings = () => {
        if (status === 'idle') return null;
        if (status === 'loading' && Number(amount) > 0) return <LoadingPulse />;
        if (status === 'failed') return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mt-4">Error: {offeringsError}</motion.p>;
        if (matchedOfferings.length === 0) return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-500 text-center mt-4">No offerings available for the selected currency pair.</motion.p>;

        if (Number(amount) > 0)
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
                >
                    <div className="flex flex-row justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">You&apos;ll Receive</h2>
                        <div className="relative">
                            <InformationCircleIcon className="h-6 w-6 text-white cursor-pointer" />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 text-sm text-gray-700 hidden group-hover:block">
                                Exchange rate and fees may vary
                            </div>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {matchedOfferings.map((offering: TbdexOffering, index: number) => (
                            <OfferingSection
                                key={offering.metadata.id}
                                offering={offering as any}
                                amount={amount}
                                isSelected={index === 0 || offering.metadata.id === selectedOfferingId}
                                onClick={() => setSelectedOfferingId(offering.metadata.id)}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            );
    };

    if (showOfferingDetails) {
        return (
            <OfferingDetails
                offering={selectedOffering!}
                fromCurrency={selectedCurrencyPair.from}
                toCurrency={selectedCurrencyPair.to}
                amount={amount}
                onStartExchange={handleStartExchange}
                onBack={() => setShowOfferingDetails(false)}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">


                <div className="rounded-lg shadow-xl mb-8">
                    <SwapSection
                        selectedCurrencyPair={selectedCurrencyPair}
                        onCurrencyPairSelect={handleCurrencyPairSelect}
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        onReviewExchange={handleReviewExchange}
                    />
                </div>

                {renderOfferings()}
            </div>
        </motion.div>
    );
};

export default Exchange;
