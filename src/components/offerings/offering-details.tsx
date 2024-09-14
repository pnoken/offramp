import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Offering } from '@tbdex/http-client';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/use-app-dispatch';
import VerifiableCredentialsForm from '@/components/credentials/verifiable-credentials-form';
import { createExchange } from '@/lib/exchange-slice';
import { mockProviderDids } from '@/constants/mockDids';

interface OfferingDetailsProps {
    offering: Offering;
    fromCurrency: string;
    toCurrency: string;
    amount: string;
    onStartExchange: () => void;
    onBack: () => void;
}

const OfferingDetails: React.FC<OfferingDetailsProps> = ({
    offering,
    fromCurrency,
    toCurrency,
    amount,
    onStartExchange,
    onBack
}) => {
    const dispatch = useAppDispatch();
    const [showCredentialsForm, setShowCredentialsForm] = useState(false);
    const [error, setError] = useState('');
    const { customerCredentials, tokenBalances, customerDid } = useAppSelector(state => state.wallet);

    const selectedBalance = useMemo(() =>
        tokenBalances.find(token => token.token === fromCurrency)?.amount || 0,
        [tokenBalances, fromCurrency]);

    const isBalanceInsufficient = useMemo(() => {
        const numericAmount = parseFloat(amount);
        if (numericAmount > selectedBalance) setError("You don't have enough funds to complete the transaction.")
        return (numericAmount > selectedBalance)
    }, [amount, selectedBalance]);

    const performExchange = useCallback(async () => {
        if (customerCredentials.length === 0) {
            setError('Customer DID or credentials not available');
            return;
        }

        try {
            const payoutPaymentDetails = {
                address: "0x1731d34b07ca2235e668c7b0941d4bfab370a2d0"
            };

            const result = await dispatch(createExchange({
                offering,
                amount,
                payoutPaymentDetails
            })).unwrap();

            console.log('Exchange created:', result);
            onStartExchange();
        } catch (error) {
            console.error('Failed to create exchange:', error);
            setError('Failed to create exchange. Please try again.');
        }
    }, [dispatch, offering, amount, customerCredentials, onStartExchange]);

    const handleExchange = useCallback(() => {
        if (customerCredentials.length === 0) {
            setShowCredentialsForm(true);
        } else {
            performExchange();
        }
    }, [customerCredentials, performExchange]);

    const handleCredentialsComplete = useCallback(() => {
        setShowCredentialsForm(false);
        performExchange();
    }, [performExchange]);



    const providerName = Object.values(mockProviderDids).find(p => p.uri === offering.metadata.from)?.name || offering.metadata.from;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center text-blue-400 hover:text-blue-300">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Offerings
                </button>
                <h2 className="text-3xl font-bold mb-6">Exchange Details</h2>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col p-8 my-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl"
                >
                    {showCredentialsForm ? (
                        <VerifiableCredentialsForm onComplete={handleCredentialsComplete} />
                    ) : (
                        <>
                            <div className="flex flex-col space-y-6 mb-8">
                                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <Image
                                            src={`/images/currencies/${fromCurrency.toLowerCase()}.png`}
                                            alt={fromCurrency}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm text-white/80">You send</p>
                                            <p className="text-2xl font-bold text-white">{amount} {fromCurrency}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                                    <div className="flex items-center space-x-4">
                                        <Image
                                            src={`/images/currencies/${toCurrency.toLowerCase()}.png`}
                                            alt={toCurrency}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm text-white/80">You receive</p>
                                            <p className="text-2xl font-bold text-white">
                                                {(Number(offering.data.payoutUnitsPerPayinUnit) * Number(amount)).toFixed(2)} {toCurrency}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl mb-8">
                                <p className="text-sm text-white/80 mb-2">Provider</p>
                                <p className="text-lg font-semibold text-white">{providerName}</p>
                            </div>
                            {error && <div className="bg-red-500/10 p-4 rounded-xl mb-8">
                                <p className="text-lg font-semibold text-white">{error}</p>
                            </div>}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExchange}
                                disabled={isBalanceInsufficient}
                                className="bg-emerald-400 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Exchange
                            </motion.button>
                        </>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default OfferingDetails;