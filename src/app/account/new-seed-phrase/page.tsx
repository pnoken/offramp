'use client';

import React, { useEffect, useState } from 'react';
import { loadDID } from '@/utils/load-write-did';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { encryptPrivateKey } from '@/utils/encrypt-store-pk';
import { DidDht } from '@web5/dids'
import { storeDID } from '@/utils/load-write-did';
import { initKeyManagement } from '@/utils/key-mgmt';

const NewSeedPhrase: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [web5, setWeb5] = useState({});
    const [myDid, setMyDid] = useState("");
    const [fileName, setFileName] = useState("did.json");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [walletCreated, setWalletCreated] = useState<boolean>(false);

    const handleCreateNewWallet = async () => {
        try {
            setIsCreating(true);

            const didDht = await DidDht.create({ publish: true });

            const did = didDht.uri;

            const portableDid = await didDht.export();

            initKeyManagement('test', portableDid);

            storeDID(fileName, portableDid);

            setWalletCreated(true);
            setMyDid(did);
            setIsCreating(false);


        } catch (error) {
            console.error("Error creating new wallet:", error);
            setIsCreating(false);
        }
    };

    useEffect(() => {
        setIsModalOpen(true); // Open the modal
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
    };

    const handleSubmit = () => {
        if (selectedFile) {
            loadDID(selectedFile.name);
            console.log('Selected file:', selectedFile);
            // Example: Read file content
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                console.log('File content:', content);
            };
            reader.readAsText(selectedFile);
        } else {
            console.error('No file selected');
        }
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
        <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* Left Section - Import by Private Key */}
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-xl font-semibold">Import from DID(json)</h2>
                <p>Drag and drop the JSON file you exported from DID:</p>

                {/* Private Key Input Section */}
                <div className="flex items-center space-x-2">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                            <span>Upload a file</span>
                            <input id="file-upload" onChange={handleFileChange} name="file-upload" type="file" className="sr-only" />
                        </label>

                    </div>

                </div>

                {/* Import Account Button */}
                <button
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                    onClick={handleSubmit}
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
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default NewSeedPhrase;
