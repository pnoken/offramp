import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600">
                <div className="h-14 w-14 rounded-full bg-white"></div>
            </div>
        </div>
    );
};

export default Spinner;