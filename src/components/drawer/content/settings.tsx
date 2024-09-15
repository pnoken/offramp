import React from 'react';
import { useAppSelector } from '@/hooks/use-app-dispatch';
import { RootState } from '@/lib/store';
import { DialogTitle } from '@headlessui/react';

// interface ActiveExchangesListProps {
//     setOpenDrawer: () => void;
// }

export const ActiveExchangesList: React.FC = () => {

    return (
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex flex-col p-4">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Exchange Settings
                </DialogTitle>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="exchangePreference" className="block text-sm font-medium text-gray-700">
                            Exchange Preference
                        </label>
                        <select
                            id="exchangePreference"
                            name="exchangePreference"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            defaultValue="bestReturns"
                        >
                            <option value="bestReturns">Best Returns</option>
                            <option value="fastestRoute">Fastest Route</option>
                            <option value="highestRated">Highest Rated</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};