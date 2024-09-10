'use client'

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Portfolio from '@/components/dashboard/content/portfolio';
import Earnings from '@/components/dashboard/content/earning';
import Exchange from '@/components/dashboard/content/exchange';

const Dashboard: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [activeComponent, setActiveComponent] = useState<string>('Portfolio');
    const [isMobile, setIsMobile] = useState<boolean>(false);

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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderContent = () => {
        switch (activeComponent) {
            case 'Portfolio':
                return <Portfolio />;
            case 'Earnings':
                return <Earnings />;
            case 'Exchange':
                return <Exchange />;
            default:
                return <Portfolio />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                setActiveComponent={setActiveComponent}
                isMobile={isMobile}
            />

            {/* Main Content Area */}
            <div
                className={`
                    flex-1 transition-all duration-300 ease-in-out 
                    ${isMobile ? 'w-full' : (isSidebarOpen ? 'md:ml-64' : 'md:ml-20')}
                    p-4 md:p-8
                `}
            >
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">{activeComponent}</h1>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
