import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { RootState } from '@/lib/store';
import { closeExchange, placeOrder } from '@/lib/exchange-slice';

interface ActiveExchangesListProps {
    onClose: () => void;
}

export const ActiveExchangesList: React.FC<ActiveExchangesListProps> = ({ onClose }) => {
    const { exchanges } = useSelector((state: RootState) => state.exchange);
    const dispatch = useDispatch();
    const [selectedExchange, setSelectedExchange] = useState(null);

    const handleExchangeClick = (exchange) => {
        console.log("Clicked exchange:", exchange);
        setSelectedExchange(exchange);
    };

    useEffect(() => {
        console.log("Selected exchange (from state):", selectedExchange);
    }, [selectedExchange]);

    console.log("selected ex", selectedExchange);

    const handleCancelExchange = () => {
        if (selectedExchange) {
            dispatch(closeExchange({
                exchangeId: selectedExchange.id,
                pfiUri: selectedExchange.pfiDid,
                reason: "User cancelled the exchange"
            }));
            setSelectedExchange(null);
        }
    };

    const handlePlaceOrder = () => {
        dispatch(placeOrder({
            exchangeId: selectedExchange.id,
            pfiUri: selectedExchange.pfiDid
        }));
        setSelectedExchange(null);
    };

    return (
        <div className="h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Active Exchanges</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="h-6 w-6" />
                </button>
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
                                onClick={() => handleExchangeClick(exchange)}
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

            <Dialog open={selectedExchange !== null} onClose={() => setSelectedExchange(null)}>
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
                        <Dialog.Title className="text-lg font-medium mb-4">Exchange Details</Dialog.Title>
                        {selectedExchange && (
                            <div>
                                <p><strong>PFI:</strong> {selectedExchange.pfiDid}</p>
                                <p><strong>Status:</strong> {selectedExchange.status}</p>
                                <p><strong>Amount:</strong> {selectedExchange.payinAmount} {selectedExchange.payinCurrency}</p>
                                <p><strong>ID:</strong> {selectedExchange.id}</p>
                                {/* Add more details as needed */}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={handleCancelExchange}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Cancel Exchange
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Place Order
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};