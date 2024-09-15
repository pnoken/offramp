import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges } from '@/lib/exchange-slice';
import { RootState, AppDispatch } from '@/lib/store';
import { mockProviderDids } from '@/constants/mockDids';
import { Exchange } from '@tbdex/http-client';
import { motion } from 'framer-motion';

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
        const rfq = exchange.find(msg => msg.metadata.kind === 'rfq');
        const quote = exchange.find(msg => msg.metadata.kind === 'quote');

        if (!rfq || !quote) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="py-4 sm:py-6 px-4 sm:px-6 relative w-full min-h-fit bg-white/10 flex flex-col items-center rounded-2xl border border-white/20 shadow-lg"
            >
                {/* <h3 className="text-lg font-semibold mb-2 truncate" title={rfq.metadata.exchangeId}>
                    Exchange ID: {rfq.metadata.exchangeId.substring(0, 10)}...
                </h3> */}
                <div className="flex items-center justify-between w-full font-medium mb-4 text-white/80">
                    {/* <div className="flex justify-between items-center">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${quote.metadata.kind === 'quote' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            {quote.metadata.kind}
                        </span>
                    </div> */}
                    <div className="flex justify-between">
                        <span className="font-medium">Pay in:</span>
                        <span className="truncate ml-2" title={`${quote.data.payin?.amount} ${quote.data.payin?.currencyCode}`}>
                            {quote.data.payin?.amount} {quote.data.payin?.currencyCode}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Pay out:</span>
                        <span className="truncate ml-2" title={`${quote.data.payout?.amount} ${quote.data.payout?.currencyCode}`}>
                            {quote.data.payout?.amount} {quote.data.payout?.currencyCode}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">To:</span>
                        <span className="truncate ml-2" title={rfq.privateData?.payout?.paymentDetails?.address || 'Unknown'}>
                            {rfq.privateData?.payout?.paymentDetails?.address
                                ? rfq.privateData.payout.paymentDetails.address.substring(0, 10) + '...'
                                : 'Unknown'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Expires:</span>
                        <span className="truncate ml-2" title={new Date(quote.data.expiresAt || '').toLocaleString()}>
                            {new Date(quote.data.expiresAt || '').toLocaleString()}
                        </span>
                    </div>
                    {/* <div className="flex justify-between">
                        <span className="font-medium">Created:</span>
                        <span className="truncate ml-2" title={new Date(rfq.metadata.createdAt).toLocaleString()}>
                            {new Date(rfq.metadata.createdAt).toLocaleString()}
                        </span>
                    </div> */}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="p-4">
            {/* <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Active Exchanges</h2>
                <button
                    onClick={fetchActiveExchanges}
                    disabled={isFetching}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
            </div> */}

            {/* {lastUpdated && (
                <p className="text-sm text-gray-500 mb-4">
                    Last updated: {lastUpdated.toLocaleString()}
                </p>
            )} */}

            {/* {isFetching && <p className="text-center">Loading exchanges...</p>} */}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {/* {!isFetching && !error && exchanges.length === 0 && (
                <p className="text-center">No active exchanges found.</p>
            )} */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exchanges.length > 0 ? renderExchangeCard(exchanges) : (
                    <p className="text-center">No active exchanges found.</p>
                )}
            </div>
        </div>
    );
};

export default ActiveExchanges;