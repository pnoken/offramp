import React, { useState, useEffect } from 'react';
import { RootState } from '@/lib/store';
import { useAppSelector } from '@/hooks/use-app-dispatch';


export const TransactionList: React.FC = () => {
    const { exchanges } = useAppSelector((state: RootState) => state.exchange);
    console.log("exchanges", exchanges);

    return (
        <div className="h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Transactions</h2>

            </div>
            <div className="overflow-y-auto h-full">
                {exchanges.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No active exchanges</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {exchanges.map((exchange) => {
                            const { id, payinAmount, status, payoutAmount, payinCurrency, payoutCurrency } = exchange
                            return (<li
                                key={id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium">{payinCurrency} to {payoutCurrency}</span>
                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                        {status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{payinAmount} {payinCurrency}</p>
                                <p className="text-xs text-gray-400 mt-1">ID: {id?.slice(0, 8)}...</p>
                            </li>)
                        })}
                    </ul>
                )}
            </div>


        </div>
    );
};