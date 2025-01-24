import Image from "next/image";
import React, { useState } from "react";
import CountrySelector from "./CountrySelection";
import { Country } from "./CountrySelection";

interface MobileMoneySetupProps {
  onSubmit: (country: string, phoneNumber: string) => void;
}

const MobileMoneySetup: React.FC<MobileMoneySetupProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Mobile number validation: 10 digits or with country code 10+ digits
  const isValidPhoneNumber = (number: string) => {
    const pattern = /^(?:\+\d{1,3})?\d{10,}$/;
    return pattern.test(number);
  };

  const isContinueDisabled =
    !selectedCountry || !isValidPhoneNumber(phoneNumber);

  const handleSubmit = () => {
    if (selectedCountry && isValidPhoneNumber(phoneNumber)) {
      onSubmit(selectedCountry.name, phoneNumber); // Pass country name and phone number
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Money Provider Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Mobile Money Provider
        </label>
        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={setSelectedCountry}
        />
      </div>

      {/* Phone Number Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mobile Money Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your mobile money number"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors ${
              phoneNumber && !isValidPhoneNumber(phoneNumber)
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            }`}
          />
        </div>
        {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
          <p className="text-sm text-red-600 mt-1">
            Please enter a valid mobile money number
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          This number will be used to receive your GHS payments
        </p>
      </div>

      {/* Provider Info */}
      {selectedCountry && (
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-start space-x-3">
            {selectedCountry.icon && (
              <Image
                src={selectedCountry.icon}
                alt={selectedCountry.name}
                width={24}
                height={24}
                className="mt-1"
              />
            )}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-purple-900">
                {selectedCountry.name}
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Your mobile money account will be linked to this provider
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleSubmit}
        disabled={isContinueDisabled}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isContinueDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
        }`}
      >
        Continue
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center">
        Your mobile money information is securely encrypted and stored on the
        blockchain
      </p>
    </div>
  );
};

export default MobileMoneySetup;
