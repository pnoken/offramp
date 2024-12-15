"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { MobileMoneySetup } from "@/components/onboarding/MobileMoneySetup";
import { VerificationStep } from "@/components/onboarding/VerificationStep";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";

const OnboardingPage = () => {
  const { user } = usePrivy();
  const [currentStep, setCurrentStep] = useState<
    "setup" | "verification" | "complete"
  >("setup");
  const [phoneData, setPhoneData] = useState<{
    operator: string;
    phoneNumber: string;
  } | null>(null);

  const handleMobileSetup = (operator: string, phoneNumber: string) => {
    setPhoneData({ operator, phoneNumber });
    setCurrentStep("verification");
  };

  const handleVerification = (code: string) => {
    // Implement verification logic here
    setCurrentStep("complete");
  };

  const handleComplete = () => {
    // Redirect to main app or dashboard
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {currentStep === "setup" && (
          <MobileMoneySetup onSubmit={handleMobileSetup} />
        )}

        {currentStep === "verification" && phoneData && (
          <VerificationStep
            phoneNumber={phoneData.phoneNumber}
            onVerify={handleVerification}
            onResend={() => {
              // Implement resend logic
            }}
          />
        )}

        {currentStep === "complete" && (
          <OnboardingComplete onContinue={handleComplete} />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
