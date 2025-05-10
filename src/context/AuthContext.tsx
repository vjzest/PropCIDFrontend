// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import axios from "axios";

// Firebase auth methods ko directly 'firebase/auth' se import karein
import { 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseAuthSignOut,
  onAuthStateChanged // onAuthStateChanged ko bhi yahan import karein
} from "firebase/auth"; 

// Apne local firebase.tsx se 'auth' object (instance) import karein
import { auth as appAuth } from "@/components/firebase"; // Path check karein, aur 'auth' ko 'appAuth' jaise naam se import karein taki confusion na ho

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  userEmail: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (payload: any) => Promise<{ success: boolean; message?: string, requiresVerification?: boolean, email?: string }>;
  logout: () => Promise<void>;
}

const BASE_URL = "https://propcidback.onrender.com";

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
    // appAuth (jo @/components/firebase se hai) use karein onAuthStateChanged ke liye
    const unsubscribe = onAuthStateChanged(appAuth, async (firebaseUser) => { // 'onAuthStateChanged' yahan use hoga
      setLoading(true);
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const localAuth = getInitialAuthState();
          if (localAuth.authStatus && localAuth.email === firebaseUser.email) {
            setIsAuthenticated(true);
            setUserType(localAuth.type);
            setUserEmail(localAuth.email);
          } else {
             // Agar hamare backend se login nahi hua ya email mismatch hai to Firebase se bhi logout kar dein
            if (isAuthenticated || localAuth.authStatus) { // Agar locally authenticated the
                 console.log("Mismatch or backend not logged in, signing out from Firebase");
                 await firebaseAuthSignOut(appAuth); // This will trigger this listener again with firebaseUser = null
            }
            // State will be cleared by the 'else' block below or next auth state change when firebaseUser becomes null
          }
        } else {
          // Email not verified, treat as logged out for our app's purposes
          if (isAuthenticated) { // Agar locally authenticated the
            console.log("Email not verified, signing out from Firebase and clearing local state.");
            await firebaseAuthSignOut(appAuth); // This will trigger this listener again with firebaseUser = null
          } else { // Locally bhi logged out the, to bas state ensure karo
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
  }, [isAuthenticated]); // isAuthenticated ko dependency me add kiya taki logout ke baad state turant reflect ho


  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      // appAuth (jo @/components/firebase se hai) use karein
      const userCredential = await firebaseSignIn(appAuth, email, password); 
      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error("Firebase login failed: No user returned.");
      await firebaseUser.reload();
      if (!firebaseUser.emailVerified) {
        // firebase se logout karein agar email verified nahi hai
        await firebaseAuthSignOut(appAuth);
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

      setIsAuthenticated(true);
      setUserType(apiUserType);
      setUserEmail(apiUserData.email);
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error("Login process failed:", error);
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("userEmail");
      setIsAuthenticated(false);
      setUserType(null);
      setUserEmail(null);
      setLoading(false);
      let message = "Login failed. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        message = "Invalid email or password.";
      } else if (error.message?.includes("Email not verified")) {
        message = "Email not verified. Please check your inbox.";
      }
      return { success: false, message };
    }
  };

  const signup = async (payload: any): Promise<{ success: boolean; message?: string, requiresVerification?: boolean, email?: string }> => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, payload);
      if (response.data.success) {
        setLoading(false);
        // Backend is expected to have handled Firebase user creation and email verification sending
        return { success: true, requiresVerification: true, email: payload.email, message: response.data.message || "Signup successful! Please verify your email." };
      } else {
        throw new Error(response.data.error || "Backend signup failed");
      }
    } catch (error: any) {
      console.error("Signup process failed:", error);
      setLoading(false);
      return { success: false, message: error.response?.data?.error || error.message || "Signup failed." };
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseAuthSignOut(appAuth); // Use imported signOut with your auth instance (appAuth)
      // localStorage aur React state onAuthStateChanged listener se clear ho jayenge.
      // Explicitly clear for immediate UI update before listener fires (though listener should handle it)
      setIsAuthenticated(false);
      setUserType(null);
      setUserEmail(null);
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Logout error:", error);
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
