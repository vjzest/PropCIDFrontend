import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string;
  userEmail: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const BASE_URL = "https://propcidback.onrender.com";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authenticated") === "true"
  );
  const [userType, setUserType] = useState(
    () => localStorage.getItem("userType") || ""
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, userType } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("userType", userType);
      localStorage.setItem("userEmail", email);

      setIsAuthenticated(true);
      setUserType(userType);
      setUserEmail(email);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserType("");
    setUserEmail("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
