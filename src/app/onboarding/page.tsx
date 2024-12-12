"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import CountrySelection from "@/components/onboarding/CountrySelection";
import MobileMoneyVerification from "@/components/onboarding/MobileMoneyVerification";
import WalletConnectionStep from "@/components/onboarding/WalletConnectionStep";
import VerificationOptions from "@/components/onboarding/VerificationOptions";

const OnboardingPage = () => {
  const { user } = usePrivy();
  const [currentStep, setCurrentStep] = useState<
    "country" | "mobile-money" | "wallet-connection" | "verification-options"
  >("country");

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mobileMoney, setMobileMoney] = useState<string>("");

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setCurrentStep("mobile-money");
  };

  const handleMobileMoneySubmit = (phoneNumber: string) => {
    setMobileMoney(phoneNumber);
    setCurrentStep("wallet-connection");
  };

  const handleWalletConnection = () => {
    setCurrentStep("verification-options");
  };

  const handleSkipVerification = () => {
    // Redirect to dashboard with limited functionality
    // Or show a modal about limited account
  };

  const handleProceedToVerification = () => {
    // Redirect to Persona verification page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {currentStep === "country" && (
          <CountrySelection onCountrySelect={handleCountrySelect} />
        )}

        {currentStep === "mobile-money" && (
          <MobileMoneyVerification
            country={selectedCountry!}
            onSubmit={handleMobileMoneySubmit}
          />
        )}

        {currentStep === "wallet-connection" && (
          <WalletConnectionStep onComplete={handleWalletConnection} />
        )}

        {currentStep === "verification-options" && (
          <VerificationOptions
            onSkip={handleSkipVerification}
            onProceed={handleProceedToVerification}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
