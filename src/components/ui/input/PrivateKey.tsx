import React, { useState } from 'react';

const ImportPrivateKey: React.FC = () => {
    const [privateKey, setPrivateKey] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleToggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* Left Section - Import by Private Key */}
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-xl font-semibold">Import by Private Key</h2>
                <p>To import an existing wallet, please enter the private key here:</p>

                {/* Private Key Input Section */}
                <div className="flex items-center space-x-2">
                    <input
                        type={isVisible ? 'text' : 'password'}
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder="Enter your private key"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="px-3 py-2 text-sm bg-gray-200 rounded-md focus:outline-none"
                        onClick={handleToggleVisibility}
                    >
                        {isVisible ? 'Hide' : 'Show'}
                    </button>
                </div>

                {/* Import Account Button */}
                <button
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Import Account
                </button>
            </div>

            {/* Right Section - What is a private key? */}
            <div className="md:w-1/2 space-y-4">
                <h3 className="text-lg font-semibold">What is a private key?</h3>
                <p className="text-gray-600">
                    A private key is like a password — a string of letters and numbers — that can be used to restore your wallet.
                </p>
                <p className="text-gray-600">
                    Is it safe to enter it into SubWallet? Yes. It will be stored locally and never leave your device without your explicit permission.
                </p>
            </div>
        </div>
    );
};

export default ImportPrivateKey;
