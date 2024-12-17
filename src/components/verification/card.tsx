"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import FiatSendABI from "@/abis/FiatSend.json";
import Link from "next/link";

// ... existing code ...

const VerificationCard: React.FC = () => {
  const { address } = useAccount();
  const [isVerified, setIsVerified] = useState(false);

  // Fetch verification status
  const { data: verificationStatus } = useReadContract({
    address: "0x9e4fCd5Cc9D80a49184715c8BA1C3C6729E05A93",
    abi: FiatSendABI.abi,
    functionName: "isVerifiedUser",
    args: [address ? address : undefined],
  });

  useEffect(() => {
    if (address && verificationStatus !== undefined) {
      console.log("verification status", verificationStatus);
      setIsVerified(!!verificationStatus);
    }
  }, [verificationStatus, address]);

  return (
    <div
      className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
      role="alert"
    >
      <span className="font-medium">Take Note:</span> Your account has limited
      functionality because it is not verified{" "}
      <Link
        href="https://app.deform.cc/form/6fcae3e3-eed5-4db8-b71c-85a2053067da/?page_number=0"
        target="_blank"
        className="mt-2 inline-block"
      >
        <button className="w-full py-2 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700">
          Complete Verification Now
        </button>
      </Link>
    </div>
  );
};

export default VerificationCard;
