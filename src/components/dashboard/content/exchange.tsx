'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SwapSection from '@/components/swap/swap-section';
import { OfferingSection } from '@/components/offerings/offering-section';
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-dispatch";
import { fetchOfferings } from '@/lib/offering-slice';
import LoadingPulse from '@/components/animate/loading-pulse';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
//import { Offering as Offering } from '@/types/offering';
import { Offering } from '@tbdex/http-client';
import { withCredentials } from '@/hocs/with-credentials';

const Exchange: React.FC = () => {
    const dispatch = useAppDispatch();
    const { customerDid, customerCredentials } = useAppSelector((state) => state.wallet);
    const { isCreating, exchange, error } = useAppSelector((state) => state.exchange);

    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState({ from: '', to: '' });
    const [amount, setAmount] = useState('');
    const { matchedOfferings = [], status = 'idle', error: offeringsError = null } = useAppSelector((state) => state.offering) || {};

    const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);
    const [showOfferingDetails, setShowOfferingDetails] = useState(false);
    const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
    const [timeLeft, setTimeLeft] = useState(42000);

    useEffect(() => {
        if (Number(amount) > 0) {
            dispatch(fetchOfferings({ from: selectedCurrencyPair.from, to: selectedCurrencyPair.to }));
        }
    }, [amount, selectedCurrencyPair, dispatch]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (matchedOfferings.length > 0) {
            setTimeLeft(42000);
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 0) {
                        clearInterval(timer);
                        dispatch(fetchOfferings({ from: selectedCurrencyPair.from, to: selectedCurrencyPair.to }));
                        return 42000;
                    }
                    return prevTime - 1000;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [matchedOfferings, dispatch, selectedCurrencyPair]);

    const handleCurrencyPairSelect = (from: string, to: string) => {
        setSelectedCurrencyPair({ from, to });
    };

    const deserializeOffering = (serializedOffering: any): Offering => {
        return new Offering(serializedOffering.metadata, serializedOffering.data);
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
    };

    const handleOfferingClick = React.useCallback((id: string) => {
        setSelectedOfferingId(id);
    }, []);

    const handleOfferingSelect = (offering: Offering) => {
        setSelectedOffering(offering);
        setSelectedOfferingId(offering.metadata.id);
    };

    const handleReviewExchange = () => {
        if (!selectedOffering) {
            setSelectedOffering(deserializeOffering(matchedOfferings[0]));
        }
        setShowOfferingDetails(true);
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
                        <div className="w-10 h-10">
                            <CircularProgressbar
                                value={timeLeft}
                                maxValue={42000}
                                text={`${Math.ceil(timeLeft / 1000)}s`}
                                styles={{
                                    path: { stroke: '#ffffff' },
                                    text: { fill: '#ffffff', fontSize: '30px' },
                                }}
                            />
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {matchedOfferings.map((offering, index: number) => (
                            <OfferingSection
                                key={offering.metadata.id}
                                offering={offering as any}
                                amount={amount}
                                isSelected={index === 0 || offering.metadata.id === selectedOfferingId}
                                onClick={() => handleOfferingClick(offering.metadata.id)}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            );
    };

    useEffect(() => {
        if (matchedOfferings.length > 0 && !selectedOffering) {
            setSelectedOffering(deserializeOffering(matchedOfferings[0]));
        }
    }, [matchedOfferings, selectedOffering]);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">


                <div className="rounded-lg shadow-xl mb-8">
                    {/* <ActiveExchanges /> */}
                    <SwapSection
                        selectedCurrencyPair={selectedCurrencyPair}
                        onCurrencyPairSelect={handleCurrencyPairSelect}
                        amount={amount}
                        offering={selectedOffering as Offering}
                        onAmountChange={handleAmountChange}
                        onReviewExchange={handleReviewExchange}
                    />
                </div>

                {renderOfferings()}
            </div>
        </motion.div>
    );
};

export default withCredentials(Exchange);
