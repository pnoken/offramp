import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    setActiveComponent: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, setActiveComponent }) => {
    return (
        <div className={`fixed top-0 left-0 h-full transition-width duration-300 ${isOpen ? 'w-36' : 'w-16'} bg-gray-800`}>
            <div className="flex flex-col h-full p-4 text-white">
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="mb-8 focus:outline-none"
                >
                    {isOpen ? '<' : '>'}
                </button>

                {/* Menu Items */}
                <nav className="flex flex-col space-y-4">
                    <button onClick={() => setActiveComponent('Portfolio')} className="text-left hover:bg-gray-700 p-2 rounded">
                        {isOpen ? "Portfolio" : "P"}
                    </button>
                    <button onClick={() => setActiveComponent('Earnings')} className="text-left hover:bg-gray-700 p-2 rounded">
                        {isOpen ? "Earnings" : "E"}
                    </button>
                    <button onClick={() => setActiveComponent('Exchange')} className="text-left hover:bg-gray-700 p-2 rounded">
                        {isOpen ? "Exchange" : "E"}
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
