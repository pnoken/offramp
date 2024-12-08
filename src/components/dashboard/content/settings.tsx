import React, { useState } from "react";
import { Switch } from "@headlessui/react";

const Settings: React.FC = () => {
  const [primaryWallet, setPrimaryWallet] = useState("");
  const [allowance, setAllowance] = useState(0);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleDeleteWallet = () => {
    console.log("Wallet deleted");
  };

  const handleSetPrimaryWallet = (wallet: string) => {
    setPrimaryWallet(wallet);
    console.log(`Primary wallet set to: ${wallet}`);
  };

  const handleSaveSettings = () => {
    setIsSigning(true);
    console.log("Transaction signed for settings change");
    setIsSigning(false);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg md:ml-16">
      <h1 className="text-2xl font-bold mb-4">Transaction Settings</h1>
      <div>
        <h2 className="text-xl font-semibold">Manage Wallet</h2>
        <button onClick={handleDeleteWallet} className="text-red-500">
          Delete Wallet
        </button>
        <div>
          <label htmlFor="primaryWallet">Set Primary Wallet:</label>
          <input
            type="text"
            id="primaryWallet"
            value={primaryWallet}
            onChange={(e) => handleSetPrimaryWallet(e.target.value)}
            className="border p-2"
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Set Allowances</h2>
        <label htmlFor="allowance">Incoming Transaction Allowance:</label>
        <input
          type="number"
          id="allowance"
          value={allowance}
          onChange={(e) => setAllowance(Number(e.target.value))}
          className="border p-2"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Default Fiat Currency</h2>
        <select
          value={defaultCurrency}
          onChange={(e) => setDefaultCurrency(e.target.value)}
          className="border p-2"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          {/* Add more currencies as needed */}
        </select>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-lg">Enable Notifications</span>
        <Switch
          checked={notificationsEnabled}
          onChange={setNotificationsEnabled}
          className={`${
            notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex items-center h-6 rounded-full w-11`}
        >
          <span className="sr-only">Enable Notifications</span>
          <span
            className={`${
              notificationsEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full transition`}
          />
        </Switch>
      </div>
      <button
        onClick={handleSaveSettings}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        {isSigning ? "Signing..." : "Save Settings"}
      </button>
    </div>
  );
};

export default Settings;
