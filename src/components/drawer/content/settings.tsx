import React, { useState } from 'react';
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const SettingContent: React.FC = () => {
    const [preference, setPreference] = useState('bestReturns');

    return (
        <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl">
            <div className="flex flex-col p-6">
                <h2 className="text-2xl font-bold text-indigo-800 mb-6">
                    Exchange Settings
                </h2>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <label htmlFor="exchangePreference" className="block text-sm font-medium text-indigo-700 mb-2">
                            Exchange Preference
                        </label>
                        <div className="relative">
                            <select
                                id="exchangePreference"
                                value={preference}
                                onChange={(e) => setPreference(e.target.value)}
                                className="appearance-none w-full bg-indigo-50 border border-indigo-300 text-indigo-900 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            >
                                <option value="bestReturns">Best Returns</option>
                                <option value="fastestRoute">Fastest Route</option>
                                <option value="highestRated">Highest Rated</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                                <ChevronDownIcon className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};