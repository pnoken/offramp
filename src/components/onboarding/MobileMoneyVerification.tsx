import React, { useState } from "react";

interface MobileMoneyVerificationProps {
  country: string;
  onSubmit: (phoneNumber: string) => void;
}

const countryCodes: { [key: string]: string } = {
  Uganda: "+256",
  Nigeria: "+234",
  Ghana: "+233",
  Kenya: "+254",
};

const DEFAULT_OTP = "666777"; // Default OTP for testing

const MobileMoneyVerification: React.FC<MobileMoneyVerificationProps> = ({
  country,
  onSubmit,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [isOtpCorrect, setIsOtpCorrect] = useState(true); // Track if OTP is correct

  const handleSendOtp = () => {
    // Simulate sending OTP
    setIsOtpSent(true);
    setError(""); // Reset error when OTP is sent
  };

  const handleVerifyOtp = () => {
    if (otp === DEFAULT_OTP) {
      // If OTP is correct, proceed
      onSubmit(phoneNumber);
    } else {
      // If OTP is incorrect, set error state
      setIsOtpCorrect(false);
      setError("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mobile Money Verification</h2>
      <p className="mb-4">Country: {country}</p>

      <input
        type="tel"
        placeholder="Enter Mobile Money Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {!isOtpSent ? (
        <button
          onClick={handleSendOtp}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Send OTP
        </button>
      ) : (
        <>
          <p className="mb-2">
            Your OTP is: <strong>{DEFAULT_OTP}</strong>
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setIsOtpCorrect(true); // Reset OTP correctness state on input change
            }}
            className={`w-full p-2 border rounded mb-4 ${
              !isOtpCorrect ? "border-red-500" : ""
            }`}
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MobileMoneyVerification;
