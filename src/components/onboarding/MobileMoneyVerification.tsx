import React, { useState } from "react";

interface MobileMoneyVerificationProps {
  country: string;
  onSubmit: (phoneNumber: string) => void;
}

const MobileMoneyVerification: React.FC<MobileMoneyVerificationProps> = ({
  country,
  onSubmit,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = () => {
    // Implement OTP sending logic
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic
    onSubmit(phoneNumber);
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
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default MobileMoneyVerification;
