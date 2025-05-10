// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import axios from "axios";
import { 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseAuthSignOut,
  onAuthStateChanged
} from "firebase/auth"; 
import { auth as appAuth } from "@/components/firebase"; // Import your auth instance

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  userEmail: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (payload: any) => Promise<{ success: boolean; message?: string, requiresVerification?: boolean, email?: string }>;
  logout: () => Promise<void>;
}

const BASE_URL = "https://propcidback.onrender.com"; // Your backend URL

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialAuthState = () => {
  if (typeof window !== 'undefined') {
    const authStatus = localStorage.getItem("authenticated") === "true";
    const type = localStorage.getItem("userType") || null;
    const email = localStorage.getItem("userEmail") || null;
    return { authStatus, type, email };
  }
  return { authStatus: false, type: null, email: null };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getInitialAuthState().authStatus);
  const [userType, setUserType] = useState<string | null>(() => getInitialAuthState().type);
  const [userEmail, setUserEmail] = useState<string | null>(() => getInitialAuthState().email);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(appAuth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const localAuth = getInitialAuthState();
          if (localAuth.authStatus && localAuth.email === firebaseUser.email) {
            setIsAuthenticated(true);
            setUserType(localAuth.type);
            setUserEmail(localAuth.email);
          } else {
            if (isAuthenticated || localAuth.authStatus) {
                 console.log("AuthContext: Firebase user verified but local/backend state mismatch. Signing out.");
                 await firebaseAuthSignOut(appAuth);
            } else {
                 // Not locally authenticated anyway, do nothing, next state change will handle
            }
          }
        } else {
          // Email not verified
          if (isAuthenticated) { // If was previously authenticated in our app state
            console.log("AuthContext: Firebase email not verified. Signing out.");
            await firebaseAuthSignOut(appAuth); // This will trigger onAuthStateChanged again
          } else { // Not authenticated in app state, ensure all local items are clear
            setIsAuthenticated(false);
            setUserType(null);
            setUserEmail(null);
            localStorage.removeItem("authenticated");
            localStorage.removeItem("userType");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("firebaseToken");
          }
        }
      } else {
        // No Firebase user / User signed out from Firebase
        setIsAuthenticated(false);
        setUserType(null);
        setUserEmail(null);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("userType");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("firebaseToken");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAuthenticated]); // Added isAuthenticated to re-evaluate if it changes externally


  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const userCredential = await firebaseSignIn(appAuth, email, password); 
      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error("Firebase login failed: No user returned.");
      await firebaseUser.reload();
      if (!firebaseUser.emailVerified) {
        await firebaseAuthSignOut(appAuth); // Sign out if email not verified
        setLoading(false);
        return { success: false, message: "Email not verified. Please check your inbox." };
      }
      const idToken = await firebaseUser.getIdToken(true);
      const backendResponse = await axios.post(`${BASE_URL}/api/auth/login`, { email: firebaseUser.email, token: idToken });
      const { userType: apiUserType, user: apiUserData } = backendResponse.data;

      localStorage.setItem("firebaseToken", idToken);
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("userType", apiUserType);
      localStorage.setItem("userEmail", apiUserData.email);

      setIsAuthenticated(true); // This should trigger re-render for consumers
      setUserType(apiUserType);
      setUserEmail(apiUserData.email);
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error("AuthContext Login Error:", error);
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("userEmail");
      setIsAuthenticated(false);
      setUserType(null);
      setUserEmail(null);
      setLoading(false);
      let message = "Login failed. Please try again.";
      if (error.code) { // Firebase errors often have a code
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          case 'auth/invalid-email':
            message = "Invalid email or password.";
            break;
          // Add other Firebase error codes if needed
        }
      } else if (error.message?.includes("Email not verified")) {
        message = "Email not verified. Please check your inbox.";
      }
      return { success: false, message };
    }
  };

  const signup = async (payload: any): Promise<{ success: boolean; message?: string, requiresVerification?: boolean, email?: string }> => {
    setLoading(true);
    try {
      // Assuming backend handles Firebase user creation & email verification process start
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, payload);
      if (response.data.success) {
        setLoading(false);
        return { 
          success: true, 
          requiresVerification: true, // Assuming backend always requires verification via email
          email: payload.email, 
          message: response.data.message || "Signup successful! Please verify your email." 
        };
      } else {
        throw new Error(response.data.error || "Backend signup failed");
      }
    } catch (error: any) {
      console.error("AuthContext Signup Error:", error);
      setLoading(false);
      return { success: false, message: error.response?.data?.error || error.message || "Signup failed." };
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseAuthSignOut(appAuth);
      // State and localStorage will be cleared by onAuthStateChanged listener
      // Forcing an immediate clear for UI responsiveness:
      setIsAuthenticated(false);
      setUserType(null);
      setUserEmail(null);
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("AuthContext Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(() => ({
    isAuthenticated,
    userType,
    userEmail,
    loading,
    login,
    signup,
    logout,
  }), [isAuthenticated, userType, userEmail, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
