"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import MomoNFTABI from "@/abis/MomoNFT.json";
import MobileMoneySetup from "@/components/onboarding/MobileMoneySetup";
import { VerificationStep } from "@/components/onboarding/VerificationStep";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";
import TermsConditionsModal from "@/components/modals/terms-and-conditons";

const NFTContract = "0x701ECdb6823fc3e258c7E291D2D8C16BC52Fbe94";

const OnboardingPage = () => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();
  const [mounted, setMounted] = useState(false);

  const { data: hasNFT, isLoading: isLoadingNFT } = useReadContract({
    address: NFTContract,
    abi: MomoNFTABI.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnecting && !isLoadingNFT && hasNFT) {
      router.replace("/");
    }
  }, [mounted, hasNFT, isConnecting, isLoadingNFT, router]);

  const [currentStep, setCurrentStep] = useState<
    "setup" | "verification" | "complete"
  >("setup");
  const [phoneData, setPhoneData] = useState<{
    operator: string;
    phoneNumber: string;
  }>({ operator: "", phoneNumber: "" });
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
  };

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || isConnecting || isLoadingNFT) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <p className="text-gray-600">Checking account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Fiatsend
          </h1>
          <p className="mt-2 text-gray-600">
            Set up your account to start receiving GHS to mobile money
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {["setup", "verification", "complete"].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-purple-600 text-white"
                      : index <
                        ["setup", "verification", "complete"].indexOf(
                          currentStep
                        )
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index <
                  ["setup", "verification", "complete"].indexOf(currentStep)
                    ? "✓"
                    : index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 ${
                      index <
                      ["setup", "verification", "complete"].indexOf(currentStep)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {currentStep === "setup" && (
            <MobileMoneySetup onSubmit={handleMobileSetup} />
          )}

          {currentStep === "verification" && phoneData && (
            <VerificationStep
              onVerify={handleVerification}
              onResend={() => {
                // Implement resend logic
              }}
            />
          )}

          {currentStep === "complete" && (
            <OnboardingComplete
              onContinue={handleComplete}
              mobileNumber={phoneData.phoneNumber}
            />
          )}
        </div>
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

export default OnboardingPage;
