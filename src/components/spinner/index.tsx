import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
};

export default Spinner;