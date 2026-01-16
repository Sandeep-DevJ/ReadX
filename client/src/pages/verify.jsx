import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Verify = () => {
  const { token } = useParams(); // Token from URL
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("❌ No verification token provided.");
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/verify`,
          {}, // Body can be empty; token is in headers
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setStatus("✅ Email Verified Successfully!");
          // Redirect to login after 2 seconds
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("❌ Invalid or expired token.");
        }
      } catch (error) {
        console.error(error);
        setStatus("❌ Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="relative w-full min-h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
      </div>
    </div>
  );
};

export default Verify;
