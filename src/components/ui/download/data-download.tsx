import React, { useState } from 'react';
import { PaperClipIcon } from '@heroicons/react/20/solid'


const DownloadData: React.FC<{ onDownloadClick: () => void }> = ({ onDownloadClick }) => {

    return (
        <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
            <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">did.json</span>
                        <span className="flex-shrink-0 text-gray-400">1.29kb</span>
                    </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <a href="#" onClick={onDownloadClick} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Download
                    </a>
                </div>
            </li>
        </ul>
    );
};

export default DownloadData;
