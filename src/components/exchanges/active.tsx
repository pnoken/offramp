import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges } from '@/lib/exchange-slice';
import { RootState, AppDispatch } from '@/lib/store';
import { Exchange } from '@tbdex/http-client';
import { mockProviderDids } from '@/constants/mockDids';

const ActiveExchanges: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exchanges, isFetching, error } = useSelector((state: RootState) => state.exchange);
    const { customerDid } = useSelector((state: RootState) => state.wallet);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchActiveExchanges = useCallback(async () => {
        if (customerDid) {
            dispatch(fetchExchanges("did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y"));
            //await Promise.all(pfiUris.map(uri => ));
            setLastUpdated(new Date());
        }
    }, [customerDid, dispatch]);

    useEffect(() => {
        fetchActiveExchanges();
    }, [fetchActiveExchanges]);

    const renderExchangeCard = (exchange: Exchange) => (
        <div key={exchange.id} className="shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold">{exchange.id}</h3>
            <p>Status: {exchange.status}</p>
            <p>Amount: {exchange.payinAmount} {exchange.payinCurrency}</p>
            <p>Created: {new Date(exchange.createdTime).toLocaleString()}</p>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Active Exchanges</h2>
                <button
                    onClick={fetchActiveExchanges}
                    disabled={isFetching}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {lastUpdated && (
                <p className="text-sm text-gray-500 mb-4">
                    Last updated: {lastUpdated.toLocaleString()}
                </p>
            )}

            {isFetching && <p className="text-center">Loading exchanges...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {!isFetching && !error && exchanges.length === 0 && (
                <p className="text-center">No active exchanges found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exchanges.map(renderExchangeCard)}
            </div>
        </div>
    );
};

export default ActiveExchanges;