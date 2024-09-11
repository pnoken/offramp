import React from 'react';
import { ArrowUpIcon, PlusIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { Tabs } from '@/components/ui/tabs';
import Image from 'next/image';

interface TabItem {
    label: string;
    content: React.ReactElement;
}

const unverifiedCredentials = [
    { name: 'KYC Verification', issuer: 'Global ID', date: '2023-05-15', icon: '🔐' },
    { name: 'Bank Account', issuer: 'GHS Bank', date: '2023-06-01', icon: '🏦' },
    { name: 'Credit Score', issuer: 'Credit Bureau', date: '2023-07-10', icon: '📊' },
    { name: 'Employment', issuer: 'TechCorp Inc.', date: '2023-08-22', icon: '💼' },
    { name: 'Education', issuer: 'University of Ghana', date: '2023-09-05', icon: '🎓' },
]

const verifiedCredentials = [{ name: 'Credential Token', issuer: 'Ultimate Identity', date: 'N/A', icon: '🪙' }];

const tabsData: TabItem[] = [
    {
        label: 'Tokens',
        content: (
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Available Tokens</h3>
                <ul className="space-y-2">
                    {[
                        { token: 'USDC', amount: 100.50, usdRate: 1, image: `/images/currencies/usdc.png` },
                        { token: 'USDT', amount: 75.25, usdRate: 1, image: `/images/currencies/usdt.png` },
                        { token: 'GHS', amount: 500.00, usdRate: 0.0833, image: `/images/currencies/ghs.png` },
                        { token: 'KES', amount: 10000.00, usdRate: 0.00694, image: `/images/currencies/kes.png` }
                    ].map((item, index) => {
                        const usdEquivalent = item.amount * item.usdRate;
                        return (
                            <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                <div className="flex items-center">
                                    <Image src={item.image} alt={item.token} width={24} height={24} className="mr-2" />
                                    <span>{item.token}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-600">{item.amount.toFixed(2)} {item.token}</span>
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        (${usdEquivalent.toFixed(2)} USD @ {item.usdRate.toFixed(6)})
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <p className="text-xs text-gray-500 mt-2">* USD rates provided by mock oracle</p>
            </div>
        ),
    },
    {
        label: 'Verifiable Credentials',
        content: (
            <div className="p-4">
                <div className="my-4">
                    <h4 className="text-lg font-semibold mb-2">Create Customer Token</h4>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const customerName = (form.elements.namedItem('customerName') as HTMLInputElement).value;
                        const countryCode = (form.elements.namedItem('countryCode') as HTMLInputElement).value;
                        const customerDID = JSON.parse(localStorage.getItem('customerDid') || '{}').uri;

                        if (customerName && countryCode && customerDID) {
                            try {
                                const response = await fetch(`https://mock-idv.tbddev.org/kcc?name=${encodeURIComponent(customerName)}&country=${encodeURIComponent(countryCode)}&did=${encodeURIComponent(customerDID)}`);
                                if (response.ok) {
                                    const newCredential = {
                                        name: 'Customer Token',
                                        issuer: 'Ultimate Identity',
                                        date: new Date().toISOString().split('T')[0],
                                        icon: '🪙'
                                    };

                                    // Here you would typically update your state or make an API call to save the new credential
                                    alert('Customer token created successfully!');
                                } else {
                                    throw new Error('Failed to create customer token');
                                }
                            } catch (error) {
                                console.error('Error creating customer token:', error);
                                alert('Failed to create customer token. Please try again.');
                            }
                        } else {
                            alert('Please fill in all fields and ensure you have a DID.');
                        }
                    }} className="space-y-4">
                        <input type="text" name="customerName" placeholder="Customer Name" required className="w-full p-2 border rounded" />
                        <input type="text" name="countryCode" placeholder="Country Code" required className="w-full p-2 border rounded" />
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">Create Token</button>
                    </form>
                </div>
                <h3 className="text-lg font-semibold mb-4">Verified Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {verifiedCredentials && verifiedCredentials.map((credential, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-2">{credential.icon}</div>
                            <h4 className="text-xl font-bold mb-2">{credential.name}</h4>
                            <p className="text-sm mb-1">Issuer: {credential.issuer}</p>
                            <p className="text-sm">Issued: {credential.date}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Not Verified ✓</span>
                                <button className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-opacity-90 transition-colors duration-300">Get Verified</button>
                            </div>
                        </div>
                    ))}
                </div>
                <h3 className="text-lg font-semibold mb-4">Unverified Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unverifiedCredentials.map((credential, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow duration-300 blur-sm">
                            <div className="text-4xl mb-2">{credential.icon}</div>
                            <h4 className="text-xl font-bold mb-2">{credential.name}</h4>
                            <p className="text-sm mb-1">Issuer: {credential.issuer}</p>
                            <p className="text-sm">Issued: {credential.date}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Verified ✓</span>
                                <button className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-opacity-90 transition-colors duration-300">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-500 mt-4">These credentials are securely stored and can be shared selectively.</p>
            </div>
        ),
    },
];

const Portfolio: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 flex flex-col justify-center bg-white shadow-md rounded-lg">

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                    <p className="text-base sm:text-lg">GHS Bank Account: GH-1234567890</p>
                    <p className="text-xs sm:text-sm text-gray-600">Use this account to add GHS to your balance</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg break-all">{JSON.parse(localStorage.getItem('customerDid') || '{}').uri || 'Not available'}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Your decentralized identifier</p>
                </div>
            </div>

            {/* Balance Information */}
            <div className="flex flex-col gap-4 sm:gap-8 bg-gray-100 p-4 sm:p-8 rounded-xl shadow-lg">
                <div className="flex-1 space-y-4 sm:space-y-8">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                        <span className="text-base sm:text-lg font-medium text-gray-600">Total Balance</span>
                        <div className="flex items-baseline mt-2">
                            {(() => {
                                const totalBalance = [
                                    { token: 'USDC', amount: 100.50, usdRate: 1 },
                                    { token: 'USDT', amount: 75.25, usdRate: 1 },
                                    { token: 'GHS', amount: 500.00, usdRate: 0.0833 },
                                    { token: 'KES', amount: 10000.00, usdRate: 0.00694 }
                                ].reduce((acc, item) => {
                                    return acc + item.amount * item.usdRate;
                                }, 0);
                                return (
                                    <>
                                        <span className="text-3xl sm:text-5xl font-bold text-blue-600">${totalBalance.toFixed(2)}</span>
                                        <span className="ml-2 text-xs sm:text-sm text-gray-500">USD</span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                            <span className="text-sm sm:text-md font-medium text-gray-600">Transferable</span>
                            <div className="flex items-baseline mt-2">
                                <span className="text-2xl sm:text-3xl font-semibold text-green-600">$0</span>
                                <span className="ml-2 text-xs text-gray-500">USD</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                            <span className="text-sm sm:text-md font-medium text-gray-600">Locked</span>
                            <div className="flex items-baseline mt-2">
                                <span className="text-2xl sm:text-3xl font-semibold text-orange-600">$0</span>
                                <span className="ml-2 text-xs text-gray-500">USD</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-col justify-center items-center bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Add Assets Action */}
                        <div className="flex flex-col items-center">
                            <button className="bg-blue-500 text-white p-3 sm:p-4 rounded-full hover:bg-blue-600 transition duration-300 shadow-lg">
                                <PlusIcon aria-hidden="true" className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>
                            <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600">Add assets</span>
                        </div>

                        {/* Send Action */}
                        <div className="flex flex-col items-center">
                            <button className="bg-green-500 text-white p-3 sm:p-4 rounded-full hover:bg-green-600 transition duration-300 shadow-lg">
                                <ArrowUpIcon aria-hidden="true" className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>
                            <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600">Send</span>
                        </div>

                        {/* Bank Action */}
                        <div className="flex flex-col items-center">
                            <button className="bg-purple-500 text-white p-3 sm:p-4 rounded-full hover:bg-purple-600 transition duration-300 shadow-lg">
                                <BuildingLibraryIcon aria-hidden="true" className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>
                            <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600">Bank</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Tabs tabsData={tabsData} />
            </div>
        </div>
    );
};

export default Portfolio;
