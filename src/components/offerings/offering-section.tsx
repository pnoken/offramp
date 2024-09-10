import React from "react";
import { OfferingCard } from "./offering-card";
import { Offering } from "@/types/offering";
import { motion } from "framer-motion";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const OfferingSection: React.FC<{ offering: Offering; amount: string }> = ({ offering, amount }) => {
    if (!offering) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-gray-100 rounded-2xl text-center text-gray-600"
            >
                No offering available at the moment
            </motion.div>
        );
    }

    const receivedAmount = (Number(offering.data.payoutUnitsPerPayinUnit) * Number(amount)).toFixed(2);
    const fees = (Number(receivedAmount) * 0.003).toFixed(2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
        >
            <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">You'll Receive</h2>
                <div className="relative">
                    <InformationCircleIcon className="h-6 w-6 text-white cursor-pointer" />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 text-sm text-gray-700 hidden group-hover:block">
                        Exchange rate and fees may vary
                    </div>
                </div>
            </div>
            <OfferingCard
                currency={offering.data.payout.currencyCode}
                returnAmount={`${receivedAmount} ${offering.data.payout.currencyCode}`}
                provider={offering.metadata.from}
                fees={`${fees} ${offering.data.payout.currencyCode}`}
                slippage={`${offering.data.payoutUnitsPerPayinUnit || "N/A"}`}
            />
        </motion.div>
    );
};