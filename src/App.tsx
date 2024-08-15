import React from 'react';
import './App.css';

function App() {
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
              //onClick={console.log("Create did")}
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create New Wallet
            </button>
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
