'use client'

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Portfolio from '@/components/dashboard/content/portfolio';
import Exchange from '@/components/dashboard/content/exchange';
import MobileSidebar from '@/components/dashboard/mobile-sidebar';
import { TransactionList } from '@/components/dashboard/content/transactions';
import { ClipboardIcon } from '@heroicons/react/24/outline'; // Ensure you have this icon
import { useLocalStorage } from '@/hooks/use-local-storage';

const Home: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [activeComponent, setActiveComponent] = useState<string>('Portfolio');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [customerDid,] = useLocalStorage('customerDid', { uri: "" });

    const did = customerDid.uri || 'Not available';
    const shortenedDid = did.length > 10 ? `${did.substring(0, 5)}...${did.substring(did.length - 5)}` : did;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        switch (activeComponent) {
            case 'Portfolio':
                return <Portfolio />;
            case 'Transactions':
                return <TransactionList />;
            case 'Exchange':
                return <Exchange />;
            default:
                return <Portfolio />;
        }
    };

    const handleCopyDid = () => {
        navigator.clipboard.writeText(did);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Main Content Area */}
            <div className="flex-1">
                <div className="p-4 sm:p-6 flex flex-col justify-center bg-white shadow-md rounded-lg md:ml-16">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 sm:p-6 rounded-lg">
                        <div className="flex-grow"></div>
                        <div className="flex items-center">
                            <p className="text-lg font-semibold break-all">{shortenedDid}</p>
                            <button onClick={handleCopyDid} className="ml-2">
                                <ClipboardIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                            </button>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </div>

            {/* Sidebar for desktop */}
            {!isMobile && (
                <Sidebar
                    setActiveComponent={setActiveComponent}
                />
            )}

            {/* Mobile bottom bar */}
            {isMobile && (
                <MobileSidebar
                    setActiveComponent={setActiveComponent}
                    activeComponent={activeComponent}
                />
            )}
        </div>
    );
};

export default Home;
