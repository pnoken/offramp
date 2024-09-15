import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/use-app-dispatch';
import { setUserCredentials } from '@/lib/wallet-slice';
import { fetchCredentialToken } from '@/utils/request/fetch-credential-token';

interface VerifiableCredentialsFormProps {
    onComplete: () => void;
}

const VerifiableCredentialsForm: React.FC<VerifiableCredentialsFormProps> = ({ onComplete }) => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { did } = useAppSelector((state) => state.wallet);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const credentials = {
            customerName: name,
            countryCode: countryCode,
            customerDID: did
        }

        fetchCredentialToken(credentials)
            .then((token) => dispatch(setUserCredentials(token)))
            .then(() => onComplete())
            .catch((error) => {
                console.error('Failed to set credentials:', error)
                // Handle error (e.g., show error message to user)
                setIsLoading(false)
            }
            )
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="countryCode" className="block text-sm font-medium text-white">Country Code</label>
                <input
                    type="text"
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                {isLoading ? 'Loading...' : 'Get Credentials'}
            </button>
        </form>
    );
};

export default VerifiableCredentialsForm;