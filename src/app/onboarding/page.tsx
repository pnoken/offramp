"use client";

import React, { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { MobileMoneySetup } from "@/components/onboarding/MobileMoneySetup";
import { VerificationStep } from "@/components/onboarding/VerificationStep";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";
import { useRouter } from "next/navigation";
import withFiatsendNFT from "@/hocs/with-account";
import TermsConditionsModal from "@/components/modals/terms-and-conditons";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState<
    "setup" | "verification" | "complete"
  >("setup");
  const [phoneData, setPhoneData] = useState<{
    operator: string;
    phoneNumber: string;
  } | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMobileSetup = (operator: string, phoneNumber: string) => {
    setPhoneData({ operator, phoneNumber });
    setCurrentStep("verification");
  };

  const handleVerification = (code: string) => {
    // Implement verification logic here
    setCurrentStep("complete");
  };

  const handleComplete = () => {
    router.push("/");
  };

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleAcceptTerms = () => {
    setIsModalOpen(false);
    // You can add additional logic here if needed
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
      <TermsConditionsModal
        isOpen={isModalOpen}
        onClose={() => {
          localStorage.clear();
        }}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};

export default withFiatsendNFT(OnboardingPage);
