import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Loading Animation */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Processing Transaction
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we process your transaction...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
