import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon, KeyIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface DrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Drawer = ({ isOpen, setIsOpen }: DrawerProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    const handleImport = (type: 'privateKey' | 'json') => {
        // Store the import type in localStorage
        localStorage.setItem('importType', type);
        // Navigate to password creation page
        router.push('/password/create');
        setIsOpen(false);
    };

    return (
        <Dialog open={open} onClose={setIsOpen} className="relative z-10">
            <DialogBackdrop
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75"
            />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            as={motion.div}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            // transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="pointer-events-auto relative w-screen max-w-md"
                        >
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="px-4 sm:px-6 py-6">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-lg font-semibold text-gray-900">
                                            Import Account
                                        </DialogTitle>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={() => handleImport('privateKey')}
                                        >
                                            <KeyIcon className="h-5 w-5" />
                                            Import with Private Key
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={() => handleImport('json')}
                                        >
                                            <DocumentArrowUpIcon className="h-5 w-5" />
                                            Import from DID (JSON)
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                    {/* Additional content can be added here */}
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
