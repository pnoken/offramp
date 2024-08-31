import React from 'react';
import { ArrowDownIcon, ArrowUpIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { Tabs } from '@/components/ui/tabs';

const Portfolio: React.FC = () => {
    return (
        <div className="p-6 flex flex-col justify-center space-x-4 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Portfolio</h1>

            {/* Balance Information */}
            <div className="flex flex-row justify-between ">
                <div className="flex flex-col  items-center">
                    <span className="text-lg font-medium">Total Balance</span>
                    <span className="text-[64px] font-semibold">$0</span>
                </div>
                <div className="flex flex-col  items-center">
                    <span className="text-lg font-medium">Transferable Balance</span>
                    <span className="text-[64px] font-semibold">$0</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-lg font-medium">Locked Balance</span>
                    <span className="text-[64px] font-semibold">$0</span>
                </div>
                {/* Actions Section */}
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-lg font-bold">Actions</h2>
                    <div className="flex flex-row">
                        {/* Receive Action */}
                        <div className="flex flex-col justify-center items-center  p-6 rounded-lg ">
                            <button className=' bg-blue-500 text-white p-5 rounded-md hover:bg-blue-600'><ArrowDownIcon aria-hidden="true" className="h-6 w-6" /></button>
                            <span>Receive</span>
                        </div>

                        {/* Send Action */}
                        <div className="flex flex-col justify-center items-center  p-6 rounded-lg ">
                            <button className=' bg-blue-500 text-white p-5 rounded-md hover:bg-blue-600'><ArrowUpIcon aria-hidden="true" className="h-6 w-6" /></button>
                            <span>Send</span>
                        </div>

                        <div className="flex flex-col justify-center items-center  p-6 rounded-lg ">
                            <button className=' bg-blue-500 text-white p-5 rounded-md hover:bg-blue-600'><BuildingLibraryIcon aria-hidden="true" className="h-6 w-6" /></button>
                            <span>Buy</span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs />
        </div>
    );
};

export default Portfolio;
