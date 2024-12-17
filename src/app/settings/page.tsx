"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { config } from "@/config/wagmiConfig";
import { signMessage, verifyMessage } from "@wagmi/core";
import { useAccount } from "wagmi";

const Settings: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState("Lisk Sepolia");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [allowance, setAllowance] = useState(1000);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const { address } = useAccount();

  const handleWalletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWallet(event.target.value);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setShowEmailInput(!showEmailInput); // Toggle email input visibility
  };

  const handleAllowanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAllowance(Number(event.target.value));
  };

  const handleSaveEmail = async () => {
    if (!email) {
      toast.error("Email cannot be empty");
      return;
    }

    try {
      const result = await signMessage(config, {
        message: "update email",
      });
      if (address) {
        await verifyMessage(config, {
          address: address,
          message: "update email",
          signature: result,
        });
        // Logic to save the email (e.g., API call)
        // Example: await saveEmailToServer(email);
        toast.success(`Email saved: ${email}`);
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Error signing or verifying email. Please try again.");
    } finally {
      setShowEmailInput(false); // Hide email input after attempting to save
    }
  };

  const handleCancelEmail = () => {
    setShowEmailInput(false); // Hide email input without saving
  };

  const handleApproveAllowance = () => {
    // Logic to approve the allowance
    toast.success(`Allowance approved: ${allowance}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Notifications
          </label>
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
          {showEmailInput && (
            <div className="mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full p-2 border border-gray-300 rounded"
              />
              <div className="mt-2 flex justify-between">
                <button
                  onClick={handleSaveEmail}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEmail}
                  className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
          <button
            onClick={handleApproveAllowance}
            className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
          >
            Approve
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Use FSEND as fees for incoming transactions
          </label>
          <input type="checkbox" className="toggle" defaultChecked />
          <button
            onClick={handleApproveAllowance}
            className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
