import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Offering } from '@tbdex/http-client';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/use-app-dispatch';
import VerifiableCredentialsForm from '@/components/credentials/verifiable-credentials-form';
import { closeExchange, createExchange, fetchExchanges, placeOrder } from '@/lib/exchange-slice';
import { mockProviderDids } from '@/constants/mockDids';
import { RootState } from '@/lib/store';
import Spinner from '../spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface OfferingDetailsProps {
    onBack: () => void;
}

const OfferingDetails: React.FC<OfferingDetailsProps> = ({
    onBack
}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { exchanges, isFetching, error } = useAppSelector((state: RootState) => state.exchange);
    const { customerDid } = useAppSelector((state: RootState) => state.wallet);
    const [hasFetched, setHasFetched] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const mostRecentExchange = exchanges[0];

    const fetchActiveExchanges = useCallback(async () => {

        const pfiUris = Object.values(mockProviderDids).map(pfi => pfi.uri);
        await Promise.all(pfiUris.map(uri => dispatch(fetchExchanges(uri))));
        setHasFetched(true);

    }, []);

    useEffect(() => {
        fetchActiveExchanges();
    }, []);

    if (isFetching) {
        return <Spinner />;
    }

    if (!mostRecentExchange) {
        return <div>No active exchanges found.</div>;
    }

    const handlePlaceOrder = async () => {
        if (!mostRecentExchange) return;

        setIsPlacingOrder(true);
        try {
            await dispatch(placeOrder({
                exchangeId: mostRecentExchange.id,
                pfiUri: mostRecentExchange.pfiDid
            })).unwrap();

            toast.success('Order placed successfully!');

            // Redirect to a success page or dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error('Failed to place order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleCancel = () => {
        dispatch(closeExchange({
            exchangeId: mostRecentExchange.id,
            pfiUri: mostRecentExchange.pfiDid,
            reason: "User cancelled the exchange"
        }));
    };


    const { id, payinAmount, payoutAmount, payinCurrency, payoutCurrency, pfiDid } = mostRecentExchange;

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
                    Back to Swap
                </button>
                <h2 className="text-3xl font-bold mb-6">Exchange Details</h2>
                <h3>id: {id}</h3>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col p-8 my-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl"
                >
                    <div className="flex flex-col space-y-6 mb-8">
                        <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={`/images/currencies/${payinCurrency.toLowerCase()}.png`}
                                    alt={payinCurrency}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="text-sm text-white/80">You send</p>
                                    <p className="text-2xl font-bold text-white">{payinAmount} {payinCurrency}</p>
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
                                    src={`/images/currencies/${payinCurrency.toLowerCase()}.png`}
                                    alt={payoutCurrency}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="text-sm text-white/80">You receive</p>
                                    <p className="text-2xl font-bold text-white">
                                        {payoutAmount} {payoutCurrency}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl mb-8">
                        <p className="text-sm text-white/80 mb-2">Provider</p>
                        <p className="text-lg font-semibold text-white">{pfiDid}</p>
                    </div>
                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                            className="flex-1 bg-emerald-400 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            className="flex-1 bg-red-400 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Cancel
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default OfferingDetails;