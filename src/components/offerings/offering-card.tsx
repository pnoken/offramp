import React from "react";
import { motion } from "framer-motion";
import { CurrencyDollarIcon, ScaleIcon, UserIcon } from "@heroicons/react/24/outline";

interface OfferingCardProps {
    currency: string;
    returnAmount: string;
    provider: string;
    fees: string;
    slippage: string;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ currency, returnAmount, provider, fees, slippage }) => {
    const mockProviderDids = {
        aquafinance_capital: {
            uri: 'did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y',
            name: 'AquaFinance Capital',
            description: 'Provides exchanges with the Ghanaian Cedis: GHS to USDC, GHS to KES'
        },
        flowback_financial: {
            uri: 'did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy',
            name: 'Flowback Financial',
            description: 'Offers international rates with various currencies - USD to GBP, GBP to CAD.'
        },
        vertex_liquid_assets: {
            uri: 'did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y',
            name: 'Vertex Liquid Assets',
            description: 'Offers currency exchanges between African currencies - MAD to EGP, GHS to NGN.'
        },
        titanium_trust: {
            uri: 'did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o',
            name: 'Titanium Trust',
            description: 'Provides offerings to exchange USD to African currencies - USD to GHS, USD to KES.'
        }
    };

    const providerName = Object.values(mockProviderDids).find(p => p.uri === provider)?.name || provider;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 shadow-lg"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className="rounded-full max-w-fit bg-green-400 px-3 py-1 mb-4 text-sm font-semibold text-gray-800"
            >
                Best Return
            </motion.div>
            <div className="flex items-center gap-6">
                <motion.img
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    src={`/images/currencies/${currency.toLowerCase()}.png`}
                    width={60}
                    height={60}
                    alt={currency}
                    className="rounded-full shadow-md"
                />
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bold text-white mb-2">{returnAmount}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-200">
                        {fees !== "N/A" && (
                            <div className="flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-300" />
                                <span>Fees: {fees}</span>
                            </div>
                        )}
                        {slippage !== "N/A" && (
                            <div className="flex items-center">
                                <ScaleIcon className="h-5 w-5 mr-2 text-yellow-300" />
                                <span>Slippage: {slippage}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <UserIcon className="h-5 w-5 mr-2 text-blue-300" />
                            <span>Provider: {providerName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};