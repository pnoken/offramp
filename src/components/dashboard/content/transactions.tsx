import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { XMarkIcon, ArrowUpIcon, ArrowDownIcon, ArrowPathIcon, FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { RootState } from '@/lib/store';
import { closeExchange, placeOrder } from '@/lib/exchange-slice';
import { motion } from 'framer-motion';
import { Tabs } from '@/components/ui/tabs';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { debounce } from 'lodash';

const ITEMS_PER_PAGE = 10;

export const TransactionHistory: React.FC = () => {
    const dispatch = useAppDispatch();
    const exchanges = useSelector((state: RootState) => state.exchange.exchanges.flat());
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'exchange'>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: '2023-01-01',
        end: new Date().toISOString().split('T')[0]
    });
    const [currentPage, setCurrentPage] = useState(1);

    const handleExchangeClick = useCallback((exchange) => {
        setSelectedExchange(exchange);
    }, []);

    const handleCancelExchange = useCallback(() => {
        if (selectedExchange) {
            dispatch(closeExchange({
                exchangeId: selectedExchange.id,
                pfiUri: selectedExchange.pfiDid,
                reason: "User cancelled the exchange"
            }));
            setSelectedExchange(null);
        }
    }, [selectedExchange, dispatch]);

    const handlePlaceOrder = useCallback(() => {
        if (selectedExchange) {
            dispatch(placeOrder({
                exchangeId: selectedExchange.id,
                pfiUri: selectedExchange.pfiDid
            }));
            setSelectedExchange(null);
        }
    }, [selectedExchange, dispatch]);

    const filteredExchanges = useMemo(() => {
        return exchanges.filter(exchange =>
            (filter === 'all' || exchange.type === filter) &&
            new Date(exchange.createdAt) >= new Date(dateRange.start) &&
            new Date(exchange.createdAt) <= new Date(dateRange.end)
        );
    }, [exchanges, filter, dateRange]);

    const paginatedExchanges = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredExchanges.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredExchanges, currentPage]);

    const totalPages = Math.ceil(filteredExchanges.length / ITEMS_PER_PAGE);

    const debouncedSetDateRange = useMemo(
        () => debounce(setDateRange, 300),
        []
    );

    const getIcon = useCallback((type: string) => {
        switch (type) {
            case 'send': return <ArrowUpIcon className="h-6 w-6 text-red-500" />;
            case 'receive': return <ArrowDownIcon className="h-6 w-6 text-green-500" />;
            case 'exchange': return <ArrowPathIcon className="h-6 w-6 text-blue-500" />;
            default: return null;
        }
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, []);

    const TransactionTable = React.memo(() => (
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PFI</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedExchanges.map((exchange) => (
                        <tr key={exchange.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleExchangeClick(exchange)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {getIcon(exchange.type)}
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        {exchange.type.charAt(0).toUpperCase() + exchange.type.slice(1)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-900">
                                    {exchange.payinAmount} {exchange.payinCurrency}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-500">{new Date(exchange.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(exchange.status)}`}>
                                    {exchange.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exchange.pfiDid}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>{currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    ));
    TransactionTable.displayName = 'TransactionTable';

    const tabsData = useMemo(() => [
        { label: 'All Transactions', content: <TransactionTable /> },
        { label: 'Analytics', content: <div>Transaction analytics coming soon...</div> },
    ], []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 sm:p-6 flex flex-col justify-center bg-white shadow-md rounded-lg w-full"
        >
            {/* ... (rest of the component remains the same) ... */}
        </motion.div>
    );
};

export default React.memo(TransactionHistory);