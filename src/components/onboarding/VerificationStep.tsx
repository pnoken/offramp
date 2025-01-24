import React, { useState, useRef, useEffect } from "react";

interface VerificationStepProps {
  onVerify: (code: string) => void;
  onResend: () => void;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  onVerify,
  onResend,
}) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isVerifyDisabled = code.some((digit) => digit === "");

  useEffect(() => {
    if (isResending && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (countdown === 0) {
      setIsResending(false);
      setCountdown(30);
    }
  }, [isResending, countdown]);

  const handleResend = () => {
    setIsResending(true);
    onResend();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Verify Your Number</h1>
        <p className="text-sm text-gray-600">
          We&apos;ve sent a 4-digit verification code to your mobile number
        </p>
      </div>

      {/* Code Input */}
      <div className="flex gap-3 justify-center">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              if (value.length <= 1) {
                const newCode = [...code];
                newCode[index] = value;
                setCode(newCode);
                if (value && index < 3) {
                  inputRefs.current[index + 1]?.focus();
                }
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none ${
              digit
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 focus:border-purple-500"
            }`}
            placeholder="•"
          />
        ))}
      </div>

      {/* Resend Section */}
      <div className="text-center">
        {isResending ? (
          <p className="text-sm text-gray-600">
            Resend code in{" "}
            <span className="text-purple-600 font-medium">{countdown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
          >
            Didn&apos;t receive code? Resend
          </button>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => onVerify(code.join(""))}
        disabled={isVerifyDisabled}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isVerifyDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
        }`}
      >
        Verify
      </button>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        Having trouble? Please make sure you&apos;ve entered the correct mobile
        number
      </p>
    </div>
  );
};
