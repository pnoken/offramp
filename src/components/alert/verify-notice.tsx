import React from "react";

const VerifyNoticeCard: React.FC = () => {
  const handleVerifyAccount = () => {
    // Logic to navigate to the verification process
    console.log("Redirecting to account verification...");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow-md">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-yellow-800">
          Limited Functionality Notice
        </h2>
        <p className="text-gray-700">
          Your account is not verified. You can currently only perform
          transactions up to 1,000 GHS. Verify now to increase your limit up to
          100,000 GHS per month.
        </p>
      </div>
      <button
        onClick={handleVerifyAccount}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Verify Account
      </button>
    </div>
  );
};

export default VerifyNoticeCard;
