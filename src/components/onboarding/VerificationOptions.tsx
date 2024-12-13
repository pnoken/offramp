import React from "react";
import { useRouter } from "next/navigation";

interface VerificationOptionsProps {
  onSkip: () => void;
  onProceed: () => void;
}

const VerificationOptions: React.FC<VerificationOptionsProps> = ({
  onSkip,
  onProceed,
}) => {
  const router = useRouter();

  const handleSkip = () => {
    onSkip();
    router.push("/offramp");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Verification Options</h2>

      <div className="mb-4">
        <p className="text-gray-600">
          Complete your identity verification to unlock full account
          functionality.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onProceed}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Proceed to Verification
        </button>

        <button
          onClick={handleSkip}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded"
        >
          Skip Verification
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Note: Skipping verification limits your account to spending up to 1000
          GHS.
        </p>
      </div>
    </div>
  );
};

export default VerificationOptions;
