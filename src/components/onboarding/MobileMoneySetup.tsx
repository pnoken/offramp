import Image from "next/image";
import React, { useState } from "react";
import CountrySelector from "./CountrySelection"; // Adjust the import path as necessary
import { Country } from "./CountrySelection"; // Remove the local Country interface

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
      <h1 className="text-2xl font-bold">Set up Mobile Account</h1>

      <div className="space-y-4">
        <p>Select Country or Region</p>
        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={setSelectedCountry}
        />

        <div className="space-y-2">
          <label className="block">Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter your number"
            className={`w-full p-3 border rounded-lg ${
              phoneNumber && !isValidPhoneNumber(phoneNumber)
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
            <p className="text-red-500 text-sm">
              Please enter a valid mobile number.
            </p>
          )}
        </div>

        <button
          className={`w-full py-3 rounded-lg text-white ${
            isContinueDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-600"
          }`}
          disabled={isContinueDisabled}
          onClick={handleSubmit}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default MobileMoneySetup;
