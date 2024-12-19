import Image from "next/image";
import React, { useState } from "react";

interface MobileMoneySetupProps {
  onSubmit: (operator: string, phoneNumber: string) => void;
}

export const MobileMoneySetup: React.FC<MobileMoneySetupProps> = ({
  onSubmit,
}) => {
  const [operator, setOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Mobile number validation: 10 digits or with country code 10+ digits
  const isValidPhoneNumber = (number: string) => {
    const pattern = /^(?:\+\d{1,3})?\d{10,}$/;
    return pattern.test(number);
  };

  const isContinueDisabled = !operator || !isValidPhoneNumber(phoneNumber);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Set up Mobile Account</h1>

      <div className="space-y-4">
        <p>Select Mobile Operator</p>
        <div className="flex gap-4 w-full">
          <button
            className={`p-4 rounded-lg flex-1 ${
              operator === "MTN" ? "bg-yellow-400" : "bg-gray-100"
            }`}
            onClick={() => setOperator("MTN")}
          >
            <Image
              src="/images/mobile-operator/mtn.jpg"
              alt="MTN"
              width={100}
              height={100}
            />
            <span>MTN</span>
          </button>
          <button
            className={`p-4 rounded-lg flex-1 ${
              operator === "Telecel" ? "bg-red-400" : "bg-gray-100"
            }`}
            onClick={() => setOperator("Telecel")}
          >
            <Image
              src="/images/mobile-operator/voda.png"
              alt="Telecel"
              width={100}
              height={100}
            />
            <span>Telecel</span>
          </button>
          <button
            className={`p-4 rounded-lg flex-1 ${
              operator === "AT" ? "bg-blue-400" : "bg-gray-100"
            }`}
            onClick={() => setOperator("AT")}
          >
            <Image
              src="/images/mobile-operator/airteltigo.avif"
              alt="Airtel Tigo"
              width={100}
              height={100}
            />
            <span>AT</span>
          </button>
        </div>

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

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span>↔️</span>
            <p>Offramp USDT/USDC TO GHS</p>
          </div>
          <div className="flex items-center gap-2">
            <p>Free for up to GHS 5k monthly</p>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-lg text-white ${
            isContinueDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-600"
          }`}
          disabled={isContinueDisabled}
          onClick={() => onSubmit(operator, phoneNumber)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
