import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Verify = () => {
  const { token } = useParams(); // token in /verify/:token
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("❌ No verification token provided.");
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/user/verify`, {
          headers: {
            Authorization: `Bearer ${token}`, // backend expects Bearer token
          },
        });

        if (res.data.success) {
          setStatus("✅ Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus(
            `❌ Verification failed: ${res.data.message || "Invalid or expired token."}`
          );
        }
      } catch (error) {
        console.error(error);
        const msg =
          error.response?.data?.message ||
          "Verification failed. Please request a new verification email.";
        setStatus(`❌ ${msg}`);
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