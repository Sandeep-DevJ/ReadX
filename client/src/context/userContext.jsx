// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // On first load, ask backend "who am I?"
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/me`, {
          withCredentials: true, // send cookies
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    fetchMe();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // optionally call backend logout endpoint, clear cookie, etc.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}