import React from 'react';
import Image from 'next/image'; // Ensure you have next/image for optimized image loading

const Spinner: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600">
                    <div className="h-14 w-14 rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image src="/images/fiatsend.png" alt="Loading..." width={40} height={40} className="object-contain" />
                </div>
            </div>
        </div>
    );
};

export default Spinner;