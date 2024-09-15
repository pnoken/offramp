import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges } from '@/lib/exchange-slice';
import { RootState, AppDispatch } from '@/lib/store';
import { mockProviderDids } from '@/constants/mockDids';
import { Exchange } from '@tbdex/http-client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ActiveExchanges: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exchanges, isFetching, error } = useSelector((state: RootState) => state.exchange);
    const { customerDid } = useSelector((state: RootState) => state.wallet);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchActiveExchanges = useCallback(async () => {
        if (customerDid) {
            const pfiUris = Object.values(mockProviderDids).map(pfi => pfi.uri);
            await Promise.all(pfiUris.map(uri => dispatch(fetchExchanges(uri))));
            setLastUpdated(new Date());
        }
    }, [customerDid, dispatch]);

    useEffect(() => {
        fetchActiveExchanges();
    }, [fetchActiveExchanges]);

    const renderExchangeCard = (exchange: Exchange) => {
        const { id, payinAmount, payoutAmount, payinCurrency, payoutCurrency } = exchange

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="py-4 sm:py-6 px-4 sm:px-6 relative w-full min-h-fit bg-blue-300 flex flex-col items-center rounded-2xl border border-white/20 shadow-lg"
            >

                <div className="flex items-center justify-between w-full font-medium mb-4 text-white/80">
                    <div className="flex flex-col">

                        <div className="flex justify-between items-center rounded-xl p-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Image
                                        src={`/images/currencies/${payinCurrency.toLowerCase()}.png`}
                                        alt={payinCurrency.currencyCode}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />

                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold text-lg">{payinCurrency}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    <span className="font-semibold text-lg">{payoutCurrency}</span>
                                </div>
                                <Image
                                    src={`/images/currencies/${payoutCurrency.toLowerCase()}.png`}
                                    alt={payoutCurrency}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </div>

                        </div>
                        <p>Waiting for exchange transaction</p>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="p-4">


            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {
                isFetching && <div>Loading...</div>
            }



            <div className="">
                {!isFetching && exchanges.length > 0 ? renderExchangeCard(exchanges[0]) : (
                    <p className="text-center">No active exchanges found.</p>
                )}
            </div>
        </div>
    );
};

export default ActiveExchanges;