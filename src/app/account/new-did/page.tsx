'use client';

import React, { useEffect, useState } from 'react';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { useAppDispatch, useAppSelector } from '@/hooks/use-app-dispatch';
import { createNewWallet } from '@/lib/wallet-slice';
import { useRouter } from 'next/navigation';
import CodeBlock from '@/components/ui/pre/markdown';
import DownloadData from '@/components/ui/download/data-download';

const NewSeedPhrase: React.FC = () => {
    const { portableDid } = useAppSelector((state) => state.wallet);
    const router = useRouter();


    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleIsSaved = () => {
        router.push("/create-done");
    };

    useEffect(() => {
        setIsModalOpen(true); // Open the modal
    }, [])

    const createDownloadLink = () => {
        if (!portableDid) return null;

        const blob = new Blob([JSON.stringify(portableDid, null, 2)], { type: 'application/json' }); // Convert JSON to Blob
        const url = URL.createObjectURL(blob); // Create an object URL for the Blob
        const link = document.createElement('a'); // Create a new anchor element
        link.href = url; // Set the URL to the href attribute
        link.download = 'did.json'; // Set the download attribute with the desired file name
        link.click(); // Programmatically click the link to trigger the download

        // Cleanup the URL object to release memory
        URL.revokeObjectURL(url);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleConfirm = () => {
        // Logic to proceed with account creation
        console.log('User confirmed!');
        setIsModalOpen(false); // Close the modal after confirmation
    };

    return (
        <div my-6>
            <h1 className='text-2xl text-center my-6 font-bold'>Your Portable DID</h1>
            <div className="flex flex-col md:flex-row gap-8 p-8 w-2/3 mx-auto">
                {/* Left Section - Import by Private Key */}
                <div className="md:w-1/2 space-y-6">
                    <p>Keep your portale did in a safe place, and never disclose it. Anyone with this information can take control of your assets.
                    </p>
                    <CodeBlock data={portableDid} />
                    {
                        portableDid && <DownloadData onDownloadClick={createDownloadLink} />
                    }


                    <button type="button" onClick={handleIsSaved} className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none" disabled={!portableDid}>
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">

                        </svg>
                        I have saved it somewhere safe
                    </button>
                </div>

                {/* Right Section - What is a private key? */}
                <div className="md:w-1/2 space-y-4">
                    <h3 className="text-lg font-semibold">What is a portable did?</h3>
                    <p className="text-gray-600">
                        A portable did is like a password — a string of letters and numbers — that can be used to restore your wallet.
                    </p>
                    <p className="text-gray-600">
                        Is it safe to enter it into Fiatsend wallet? Yes. It will be stored locally and never leave your device without your explicit permission.
                    </p>
                </div>
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirm}
                />
            </div>
        </div>
    );
};

export default NewSeedPhrase;
