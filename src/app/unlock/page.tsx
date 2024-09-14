'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { unlockWallet } from '@/lib/wallet-slice';
import { decryptData } from '@/utils/encryption/encrypt-data';
import { RootState } from '@/lib/store';

const UnlockPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();
    const { encryptedMasterPassword, iv } = useSelector((state: RootState) => state.wallet);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const decryptedPassword = decryptData(encryptedMasterPassword!, iv!);
            if (password === decryptedPassword) {
                dispatch(unlockWallet());
                localStorage.setItem('walletLocked', 'false');
                localStorage.setItem('lastActivity', Date.now().toString());
                router.push('/wallet');
            } else {
                setError('Incorrect password');
            }
        } catch (error) {
            console.error('Error decrypting password:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">Unlock Wallet</h1>
                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Master Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UnlockPage;