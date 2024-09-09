'use client';

import React from "react";
import { useRouter } from 'next/navigation';

const CreateDone: React.FC = () => {
    const router = useRouter();

    const handleRoute = () => {
        router.push("/home");
    }
    return (
        <div className="flex flex-col mx-auto w-1/2 gap-4 text-center">
            <h1>Successful</h1>

            <h1>All Done</h1>
            <button onClick={handleRoute} className="p-3 flex w-full justify-center rounded-full bg-indigo-600 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to porfolio</button>
        </div>
    )
}


export default CreateDone;