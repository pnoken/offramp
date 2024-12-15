import Image from "next/image";
import React from "react";

interface OnboardingCompleteProps {
  onContinue: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onContinue,
}) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <Image src="/success-illustration.svg" alt="Success" className="w-48" />
      </div>

      <h1 className="text-2xl font-bold">Onboarding Completed</h1>
      <p className="text-gray-600">Enjoy sending/converting easily</p>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-purple-600">1000 GHS Limit</h3>
        <p className="text-sm text-gray-600">
          Complete KYC Verification to increase limit
        </p>
      </div>

      <button
        className="w-full bg-purple-600 text-white py-3 rounded-lg"
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
};
