"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { config } from "@/config/wagmiConfig";
import { signMessage, verifyMessage } from "@wagmi/core";
import { useAccount } from "wagmi";
import withFiatsendNFT from "@/hocs/with-account";

const Settings: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState("Lisk Sepolia");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [allowance, setAllowance] = useState<number | "">(1000);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [useFSENDFee, setUseFSENDFee] = useState(true);
  const { address } = useAccount();

  const handleWalletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWallet(event.target.value);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setShowEmailInput(!notificationsEnabled); // Toggle email input visibility
  };

  const handleAllowanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (isNaN(value) || value <= 0) {
      toast.error("Allowance must be a positive number.");
      return;
    }
    setAllowance(value);
  };

  const handleSaveEmail = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
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
        // Example API call to save email (replace with actual logic)
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async API call
        toast.success(`Email saved successfully: ${email}`);
      }
    } catch (error) {
      console.error("Email update failed:", error);
      toast.error("Failed to save email. Please try again.");
    } finally {
      setShowEmailInput(false);
    }
  };

  const handleCancelEmail = () => {
    setShowEmailInput(false); // Hide email input without saving
  };

  const handleApproveAllowance = async () => {
    if (!allowance || allowance <= 0) {
      toast.error("Allowance must be a valid positive number.");
      return;
    }
    try {
      // Logic to approve allowance (replace with actual API logic)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async API call
      toast.success(`Allowance approved: ${allowance}`);
    } catch (error) {
      console.error("Allowance approval failed:", error);
      toast.error("Failed to approve allowance. Please try again.");
    }
  };

  const handleToggleFSENDFee = async () => {
    try {
      setUseFSENDFee(!useFSENDFee);
      // Logic to persist toggle state (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async API call
      toast.success(`FSEND fees ${useFSENDFee ? "disabled" : "enabled"}.`);
    } catch (error) {
      console.error("FSEND toggle failed:", error);
      toast.error("Failed to update FSEND fee setting.");
    }
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
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={useFSENDFee}
              onChange={handleToggleFSENDFee}
              className="mr-2"
            />
            <span>Enable FSEND fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withFiatsendNFT(Settings);
