import React from "react";

const VerifyEmail = () => {
  return (
    <div className="relative w-full h-[760px] overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            ✅ Check Your Email
          </h2>
          <p className="text-gray-400 mb-6">
            We have sent a verification link to your email address.
            Please check your inbox and click on the link to verify your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
