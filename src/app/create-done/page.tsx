'use client';

import React from "react";
import { useRouter } from 'next/navigation';

const CreateDone: React.FC = () => {
    const router = useRouter();

    const handleRoute = () => {
        router.push("/home");
    }
    return (
        <div className="flex flex-col py-36 mx-auto  gap-4 text-center bg-slate-800 text-yellow-50">
            <h1 className="text-bold text-2xl">Successful</h1>
            <div className="w-36 h-36 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                <svg aria-hidden="true" className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                <span className="sr-only">Success</span>
            </div>


            <h1 className="text-bold text-2xl">All Done</h1>
            <button onClick={handleRoute} className="p-3 flex  justify-center rounded-full bg-indigo-600 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to porfolio</button>
        </div>
    )
}


export default CreateDone;