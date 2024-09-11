import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabData {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabsData: TabData[];
}

export function Tabs({ tabsData }: TabsProps) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        function setTabPosition() {
            const currentTab = tabsRef.current[activeTabIndex];
            setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
            setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
        }

        setTabPosition();
        window.addEventListener('resize', setTabPosition);

        return () => window.removeEventListener('resize', setTabPosition);
    }, [activeTabIndex]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
                <div className="flex border-b">
                    {tabsData.map((tab, idx) => (
                        <button
                            key={idx}
                            ref={(el) => { tabsRef.current[idx] = el; }}
                            className={`py-4 px-6 font-medium transition-colors duration-300 ${idx === activeTabIndex
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-blue-500'
                                }`}
                            onClick={() => setActiveTabIndex(idx)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-blue-600"
                    initial={false}
                    animate={{
                        left: tabUnderlineLeft,
                        width: tabUnderlineWidth,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTabIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                >
                    {tabsData[activeTabIndex].content}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
