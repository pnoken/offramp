'use client'

import React, { useState, useEffect } from 'react';
import { VerifiableCredential, PresentationExchange } from '@web5/credentials';
import { resolveDid } from '@tbdex/protocol'
import SwapSection from '@/components/swap/swap-section';
import { OfferingSection } from '@/components/offerings/offering-section';


const currencies = ["GHS", "USD", "KES"];

const Exchange: React.FC = () => {




    return (
        <div className="container h-screen mx-auto px-4 py-8 bg-gray-600">
            <h2 className="text-2xl font-bold mb-4">Currency Exchange</h2>


            <div className="lg:w-1/2 w-full mx-auto">
                <SwapSection />
                <OfferingSection />
            </div>

        </div>
    );
};

export default Exchange;
