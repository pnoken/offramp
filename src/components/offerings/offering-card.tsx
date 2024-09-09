import React, { useEffect, useState } from "react";


export const OfferingCard: React.FC = ({ currency, returnAmount, provider, fees, slippage }) => {
    return (
        <div className="flex flex-col rounded-2xl">
            <div className="rounded-full max-w-fit bg-blue-500 p-1 my-3 text-xs font-medium text-white ring-1 ring-inset ring-blue-700/10">
                Best Return
            </div>
            <div className="mt-5 flex flex-row gap-3 my-2">
                <img src="/favicon.ico" width={30} alt={currency} />
                <div className="flex flex-col">
                    <h2 className="text-2xl">{returnAmount}</h2>
                    <div className="flex flex-row gap-2">
                        <span>{fees}</span>
                        <span>{slippage}</span>
                        <span>{provider}</span>
                    </div>

                </div>
            </div>
        </div >
    )
}