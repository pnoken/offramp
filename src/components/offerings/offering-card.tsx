import React, { useEffect, useState } from "react";


interface OfferingCardProps {
    currency: string;
    returnAmount: string;
    provider: string;
    fees: string;
    slippage: string;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ currency, returnAmount, provider, fees, slippage }) => {
    return (
        <div className="flex flex-col rounded-2xl bg-white/5 p-4">
            <div className="rounded-full max-w-fit bg-blue-500 px-2 py-1 mb-3 text-xs font-medium text-white">
                Best Return
            </div>
            <div className="flex items-center gap-4">
                <img src={`/currencies/${currency.toLowerCase()}.png`} width={40} height={40} alt={currency} className="rounded-full" />
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">{returnAmount}</h2>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        {fees !== "N/A" && <span>Fees: {fees}</span>}
                        {slippage !== "N/A" && <span>Slippage: {slippage}</span>}
                        {(() => {
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
                            return <span>Provider: {providerName}</span>;
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};