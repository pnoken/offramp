import React from "react";

interface SignMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  message: string;
  account: string;
}

export const SignMessageModal: React.FC<SignMessageModalProps> = ({
  isOpen,
  onClose,
  onSign,
  message,
  account,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold">Fiatsend Testnet</h2>
        <p className="text-sm mt-2 text-gray-600">Authentication Request</p>

        <div className="mt-4 space-y-2">
          <p className="font-bold">Sign Message</p>
          <p className="text-gray-600">
            Offramps by Fiatsend wants you to sign this message with your
            Ethereum account:
            <span className="block font-mono text-purple-600">{account}</span>
          </p>
          <p className="text-sm text-gray-600">
            Click <span className="text-green-500">Sign</span> or{" "}
            <span className="text-green-500">Approve</span> to prove that you
            are the account owner. This request will not trigger any blockchain
            transactions or cost any gas fees.
          </p>
          <p className="text-sm text-gray-500 italic">
            This testnet flow is for demonstration purposes only. You will not
            be able to purchase any tokens that represent real-world assets on
            the testnet.
          </p>
          <p className="text-gray-600 mt-4">
            Signing with <span className="font-mono">{account}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">No fee to sign</p>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            onClick={onSign}
          >
            Sign
          </button>
        </div>
      </div>
    </div>
  );
};
