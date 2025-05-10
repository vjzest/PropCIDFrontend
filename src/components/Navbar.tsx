// Correct import for Firebase modular functions
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut, Menu, Search, UserPlus, X, Home, Video, Plus } from "lucide-react";
import logoImage from "../Logo.jpg";
import axios from "axios";
import { Label } from "./ui/label";

// Import Firebase authentication methods from your firebase.tsx file
import { auth, signInWithEmailAndPassword } from "@/components/firebase.tsx";

const BASE_URL = "http://localhost:4000";

// Custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authenticated") === "true"
  );
  const [userType, setUserType] = useState(
    () => localStorage.getItem("userType") || ""
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );

  // ✅ Corrected Login function (no export keyword inside hook)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Step 1: Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Backend login response:", user);

      if (user) {
        // 🔥 Reload user to get updated emailVerified status
        await user.reload();
  
        if (!user.emailVerified) {
          console.error("Email not verified");
          return false;
        }
  
        //  Get fresh token with updated claims
        const idToken = await user.getIdToken(true); // Force refresh token
  
        // Save token
        localStorage.setItem("firebaseToken", idToken);
  
        // Step 2: Call your backend login
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
          email,
           token: idToken,
        });
  
        const { userType, user: userData } = response.data;
  
        // Save user info
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userType", userType);
        localStorage.setItem("authenticated", "true");
  
        // Update React state
        setIsAuthenticated(true);
        setUserType(userType);
        setUserEmail(userData.email);
  
        // Optional: Protected route call
        const protectedResponse = await axios.get(`${BASE_URL}/api/auth/protected-route`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log("Protected data:", protectedResponse.data);
  
        return true;
      } else {
        console.error("No user found");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };
  

  // Logout function
  const logout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("firebaseToken");
    setIsAuthenticated(false);
    setUserType("");
    setUserEmail("");
  };

  // ✅ Return everything
  return { isAuthenticated, userType, userEmail, login, logout };
};

// Email Verification Popup Component
const EmailVerificationPopup = ({ email, onClose }: { email: string; onClose: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-green-600 text-2xl font-bold">Signup Successful!</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            A verification link has been sent to {email}. Please check your email and click the link to verify your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you don't see the email, please check your spam folder.
          </p>
          <Button 
            onClick={() => {
              onClose();
              navigate('/login');
            }} 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Go to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Login Form Component
const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (await login(email, password)) {
      toast({
        title: "Success",
        description: "You have been logged in successfully!",
      });
      onSuccess?.();
      navigate(`/${localStorage.getItem("userType") || ""}`);
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 pt-2">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

// Success Message Component
const SignupSuccessMessage = ({ email, onClose }: { email: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Signup Successful!</h3>
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">
              Please verify your email address
            </p>
            <p className="text-gray-600">
              We have sent a verification link to:
              <br />
              <span className="font-semibold text-primary">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Click the link in your email to verify your account and continue.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Note: If you don't see the email, please check your spam folder.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

// Signup Form Component
const SignupForm = ({
  type,
  onSuccess,
  setAuthDialogOpen,
  setIsSignupDialogOpen,
}: {
  type: "user" | "builder" | "broker" | "admin";
  onSuccess?: () => void;
  setAuthDialogOpen: (open: boolean) => void;
  setIsSignupDialogOpen: (open: boolean) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (!name || !email || !password || !confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
  
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
  
      const payload = {
        name,
        email,
        password,
        userType: type,
        ...(type === "builder" && { companyName }),
        ...(type === "broker" && { licenseNumber }),
      };
  
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, payload);
  
      if (response.data.success) {
        // ✅ Show success message
        toast({
          description: "Please verify your email — verification link sent to your inbox.",
           className: "bg-black text-white"
        });
  
        // Close signup dialog
        setIsSignupDialogOpen(false);
        setShowSuccess(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  if (showSuccess) {
    return <SignupSuccessMessage email={email} onClose={handleSuccessClose} />;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Create Your {type} Account
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Join our community and start your journey
        </p>
      </div>
      <form onSubmit={handleSignup} className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor={`${type}-name`}
            className="text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <Input
            id={`${type}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${type}-email`}
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id={`${type}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${type}-password`}
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id={`${type}-password`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${type}-confirm-password`}
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <Input
            id={`${type}-confirm-password`}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {type === "builder" && (
          <div className="space-y-2">
            <label
              htmlFor="company"
              className="text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Construction Company"
              required
            />
          </div>
        )}
        {type === "broker" && (
          <div className="space-y-2">
            <label
              htmlFor="license"
              className="text-sm font-medium text-gray-700"
            >
              License Number
            </label>
            <Input
              id="license"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="License #"
              required
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
};

// Add Story Login Prompt Component
const AddStoryLoginPrompt = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Login Required</DialogTitle>
          <DialogDescription className="text-gray-600">
            Please login to add your story
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You need to be logged in to share your story with the community.
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Login Now
            </Button>
            <Button
              onClick={() => {
                onClose();
                navigate('/signup');
              }}
              variant="outline"
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, userType, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminSection = location.pathname.startsWith("/admin");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
    scrollToTop();
  };

  if (isAdminSection) {
    return null;
  }

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={scrollToTop}>
            <div className="flex items-center relative">
              <span className="text-2xl font-bold">PROP</span>
              <span className="text-2xl font-bold text-red-500 relative">
                CID
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              </span>
            </div>
          </Link>

          {/* Search Bar - Show on medium and larger screens */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Search properties, builders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Navigation Links - Show on medium and larger screens */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary flex items-center gap-2"
              onClick={scrollToTop}
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Home</span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary"
              onClick={scrollToTop}
            >
              Contact
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-primary"
              onClick={scrollToTop}
            >
              Services
            </Link>
            <div className="relative group">
              <button
                className="text-gray-700 hover:text-primary flex items-center gap-1 px-3 py-2"
                onClick={scrollToTop}
              >
                Properties
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/properties?type=residential"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={scrollToTop}
                >
                  Residential Properties
                </Link>
                <Link
                  to="/properties?type=commercial"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={scrollToTop}
                >
                  Commercial Properties
                </Link>
                <Link
                  to="/properties?type=luxury"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={scrollToTop}
                >
                  Luxury Properties
                </Link>
              </div>
            </div>
          </div>

          {/* Auth Buttons - Show on medium and larger screens */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                      onClick={scrollToTop}
                    >
                      <LogIn className="w-3 h-3 mr-1" />
                      <span className="text-sm">Login</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-primary">
                        Login to PropCID
                      </DialogTitle>
                    </DialogHeader>
                    <LoginForm onSuccess={() => setAuthDialogOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isSignupDialogOpen}
                  onOpenChange={setIsSignupDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white transition-colors duration-200"
                      onClick={() => {
                        setIsSignupDialogOpen(true);
                        scrollToTop();
                      }}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      <span className="text-sm">Sign Up</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-primary">
                        Create your PropCID account
                      </DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="user">
                      <TabsList className="grid grid-cols-4 bg-primary/10">
                        <TabsTrigger value="user">User</TabsTrigger>
                        <TabsTrigger value="builder">Builder</TabsTrigger>
                        <TabsTrigger value="broker">Broker</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                      </TabsList>
                      <TabsContent value="user">
                        <SignupForm
                          type="user"
                          onSuccess={() => setAuthDialogOpen(true)}
                          setAuthDialogOpen={setAuthDialogOpen}
                          setIsSignupDialogOpen={setIsSignupDialogOpen}
                        />
                      </TabsContent>
                      <TabsContent value="builder">
                        <SignupForm
                          type="builder"
                          onSuccess={() => setAuthDialogOpen(true)}
                          setAuthDialogOpen={setAuthDialogOpen}
                          setIsSignupDialogOpen={setIsSignupDialogOpen}
                        />
                      </TabsContent>
                      <TabsContent value="broker">
                        <SignupForm
                          type="broker"
                          onSuccess={() => setAuthDialogOpen(true)}
                          setAuthDialogOpen={setAuthDialogOpen}
                          setIsSignupDialogOpen={setIsSignupDialogOpen}
                        />
                      </TabsContent>
                      <TabsContent value="admin">
                        <SignupForm
                          type="admin"
                          onSuccess={() => setAuthDialogOpen(true)}
                          setAuthDialogOpen={setAuthDialogOpen}
                          setIsSignupDialogOpen={setIsSignupDialogOpen}
                        />
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/${userType}`)}
                  className="text-primary border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <span className="font-medium capitalize">{userType}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              scrollToTop();
            }}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] bg-white z-40">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Search properties, builders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link
                to="/contact"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Contact
              </Link>
              <Link
                to="/services"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                Services
              </Link>
              <div className="space-y-1">
                <div className="p-2 text-gray-700 font-medium">Properties</div>
                <Link
                  to="/properties?type=residential"
                  className="block pl-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  Residential Properties
                </Link>
                <Link
                  to="/properties?type=commercial"
                  className="block pl-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  Commercial Properties
                </Link>
                <Link
                  to="/properties?type=luxury"
                  className="block pl-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  Luxury Properties
                </Link>
              </div>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated ? (
                <div className="pt-4 space-y-2">
                  <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-primary border-primary hover:bg-primary hover:text-white transition-colors duration-200"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToTop();
                        }}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        <span>Login</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-primary">
                          Login to PropCID
                        </DialogTitle>
                      </DialogHeader>
                      <LoginForm onSuccess={() => setAuthDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isSignupDialogOpen}
                    onOpenChange={setIsSignupDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors duration-200"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToTop();
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span>Sign Up</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-primary">
                          Create your PropCID account
                        </DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="user">
                        <TabsList className="grid grid-cols-4 bg-primary/10">
                          <TabsTrigger value="user">User</TabsTrigger>
                          <TabsTrigger value="builder">Builder</TabsTrigger>
                          <TabsTrigger value="broker">Broker</TabsTrigger>
                          <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>
                        <TabsContent value="user">
                          <SignupForm
                            type="user"
                            onSuccess={() => setAuthDialogOpen(true)}
                            setAuthDialogOpen={setAuthDialogOpen}
                            setIsSignupDialogOpen={setIsSignupDialogOpen}
                          />
                        </TabsContent>
                        <TabsContent value="builder">
                          <SignupForm
                            type="builder"
                            onSuccess={() => setAuthDialogOpen(true)}
                            setAuthDialogOpen={setAuthDialogOpen}
                            setIsSignupDialogOpen={setIsSignupDialogOpen}
                          />
                        </TabsContent>
                        <TabsContent value="broker">
                          <SignupForm
                            type="broker"
                            onSuccess={() => setAuthDialogOpen(true)}
                            setAuthDialogOpen={setAuthDialogOpen}
                            setIsSignupDialogOpen={setIsSignupDialogOpen}
                          />
                        </TabsContent>
                        <TabsContent value="admin">
                          <SignupForm
                            type="admin"
                            onSuccess={() => setAuthDialogOpen(true)}
                            setAuthDialogOpen={setAuthDialogOpen}
                            setIsSignupDialogOpen={setIsSignupDialogOpen}
                          />
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <Link
                    to={`/${userType}`}
                    className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToTop();
                    }}
                  >
                    <span className="font-medium capitalize">{userType}</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/" 
            className="flex flex-col items-center justify-center w-1/3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/reels" 
            className="flex flex-col items-center justify-center w-1/3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 -mt-6">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1">Reels</span>
          </Link>
          
          <button 
            className="flex flex-col items-center justify-center w-1/3"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              scrollToTop();
            }}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};

export { useAuth, LoginForm, SignupForm };
export default Navbar;
