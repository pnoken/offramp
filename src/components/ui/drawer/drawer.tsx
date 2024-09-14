import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { motion } from 'framer-motion';

interface DrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

export const Drawer = ({ isOpen, setIsOpen, children }: DrawerProps) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    return (
        <Dialog open={open} onClose={setIsOpen} className="relative z-10">
            <DialogBackdrop
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                            className="pointer-events-auto relative w-screen max-w-md"
                        >
                            {children}
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
