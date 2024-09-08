'use client'

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Portfolio from '@/components/dashboard/content/portfolio';
import Earnings from '@/components/dashboard/content/earning';
import Exchange from '@/components/dashboard/content/exchange';

const Dashboard: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [activeComponent, setActiveComponent] = useState<string>('Portfolio');

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

        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                setActiveComponent={setActiveComponent}
            />

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-36' : 'ml-16'}`}>
                {/* Render only the active component */}
                {renderContent()}
            </div>
        </div>

    );
};

export default Dashboard;
