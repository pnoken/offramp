import React, { useState, useEffect } from 'react';
import './App.css';
import { Web5 } from '@web5/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);


  useEffect(() => {
    const initWeb5 = async () => {
      setLoading(true);
      const { web5, did } = await Web5.connect();
      setWeb5(web5);
      setMyDid(did);

      if (web5 && did) {
        setLoading(false);
        // await configureProtocol(web5, did);
        // await fetchDings(web5, did);
      }
    };
    initWeb5();
  }, []);

  return (
    <div className="h-lvh p-4">
      <div className="shadow-inner border-gray-200 border-solid border-2 h-full w-full sm:w-1/2 mx-auto rounded-xl">
        <div className="flex min-h-full flex-1 flex-col gap-10 px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="/favicon.ico"
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
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create New Wallet
            </button>
            {loading ? <h2>creating did</h2> : <h2>{myDid}</h2>}
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

          <p className="mt-10 text-sm text-gray-500">Web Wallet v 1.00</p>
        </div>
      </div>
    </div>
  );
}

export default App;
