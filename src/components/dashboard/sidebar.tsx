import React from 'react';
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    setActiveComponent: (component: string) => void;
    isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, setActiveComponent, isMobile }) => {
    const menuItems = [
        { name: 'Portfolio', icon: HomeIcon },
        { name: 'Earnings', icon: ChartBarIcon },
        { name: 'Exchange', icon: CurrencyDollarIcon },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-50
                    ${isOpen ? (isMobile ? 'w-64' : 'w-64') : (isMobile ? '-translate-x-full' : 'w-20')}
                `}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="self-end p-2 mb-8 focus:outline-none"
                    >
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>

                    {/* Menu Items */}
                    <nav className="flex flex-col space-y-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActiveComponent(item.name);
                                    if (isMobile) toggleSidebar();
                                }}
                                className="flex items-center space-x-2 text-left hover:bg-gray-700 p-2 rounded transition-colors duration-200"
                            >
                                <item.icon className="h-6 w-6" />
                                {isOpen && <span>{item.name}</span>}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
