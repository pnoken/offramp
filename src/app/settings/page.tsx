"use client";

import React, { useState } from "react";

const Settings: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState("Lisk Sepolia");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [allowance, setAllowance] = useState(1000);

  const handleWalletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWallet(event.target.value);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleAllowanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAllowance(Number(event.target.value));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Wallets</label>
        <select
          value={selectedWallet}
          onChange={handleWalletChange}
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="Lisk Sepolia">Lisk Sepolia</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Binance Smart Chain">Binance Smart Chain</option>
          {/* Add more wallet options as needed */}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Notifications</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
            className="mr-2"
          />
          <span>
            Receive notifications on transactions and fiatsend updates
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Set allowance for incoming transactions
        </label>
        <input
          type="number"
          value={allowance}
          onChange={handleAllowanceChange}
          className="block w-full p-2 border border-gray-300 rounded"
          placeholder="Input amount in dollars"
        />
      </div>
    </div>
  );
};

export default Settings;
