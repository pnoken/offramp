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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Set up Momo Transfers</h1>

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
              src="/images/mobile-operator/momo.svg"
              alt="MTN"
              width={36}
              height={36}
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
              src="/images/mobile-operator/telecel-cash.jpeg"
              alt="Telecel"
              width={36}
              height={36}
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
              src="/images/mobile-operator/at.svg"
              alt="Airtel Tigo"
              width={36}
              height={36}
            />
            <span>Airtel Tigo</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="block">Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter your number"
            className="w-full p-3 border rounded-lg"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span>↔️</span>
            <p>Transfer between USDT/USDC TO GHS</p>
          </div>
          <div className="flex items-center gap-2">
            <span>%</span>
            <p>0% Fees up to GHS 1k monthly, 0.5% after that</p>
          </div>
        </div>

        <button
          className="w-full bg-purple-600 text-white py-3 rounded-lg"
          onClick={() => onSubmit(operator, phoneNumber)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
