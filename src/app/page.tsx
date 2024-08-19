'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Web5 } from "@web5/api";
import { VerifiableCredential } from '@web5/credentials';
import { decryptPrivateKey } from '@/utils/retrieve-pk';
import { encryptPrivateKey } from '@/utils/encrypt-store-pk';
import { DidDht } from '@web5/dids'
import { storeDID } from '@/utils/load-write-did';

export default function WebWallet() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [walletCreated, setWalletCreated] = useState<boolean>(false);
  const [importedPrivateKey, setImportedPrivateKey] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [web5, setWeb5] = useState({});
  const [myDid, setMyDid] = useState("");
  const [fileName, setFileName] = useState("did.json");

  const handleCreateNewWallet = async () => {
    try {
      setIsCreating(true);

      const didDht = await DidDht.create({ publish: true });

      const did = didDht.uri;

      const portableDid = await didDht.export();

      storeDID(fileName, portableDid);

      setWalletCreated(true);
      setMyDid(did);
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating new wallet:", error);
      setIsCreating(false);
    }
  };

  const handleImportWallet = async () => {
    try {
      setIsImporting(true);

      const privateKeyJwk = await decryptPrivateKey(importedPrivateKey, passphrase);

      // Assuming DID.restore() restores a DID from a private key
      const did = await DID.restore(privateKeyJwk);

      // Now web5 should be configured with the restored DID
      const web5 = new Web5({ did });

      setWalletCreated(true);
      setIsImporting(false);
    } catch (error) {
      console.error("Error importing wallet:", error);
      setIsImporting(false);
    }
  };


  return (
    <div className="h-lvh p-4">
      <div className="shadow-inner border-gray-200 border-solid border-2 h-full w-full sm:w-1/2 mx-auto rounded-xl">
        <div className="relative flex min-h-full flex-1 flex-col gap-10 px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              alt="Your Company"
              src="/favicon.ico"
              width={100}
              height={100}
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Unlocking the future of Web5:
            </h2>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Your FIATSEND Native wallet
            </h2>
          </div>

          <div>
            <button
              type="submit"
              onClick={handleCreateNewWallet}
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create New Wallet
            </button>
            <h2>{myDid}</h2>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Restore Wallet
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Access Wallet
            </button>
          </div>

          <p className="mt-10 text-sm text-gray-500 absolute bottom-0 left-0 m-6">Web Wallet v 1.00</p>
        </div>
      </div>
    </div>
  )
}