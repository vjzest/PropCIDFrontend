// src/components/Navbar.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogDescription, 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut, Menu, Search, UserPlus, X, Home, Video } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

// Signup Success Message UI (Renders directly inside DialogContent controlled by SignupForm)
const SignupSuccessMessageUI = ({ email, onClose }: { email: string; onClose: () => void }) => {
    return (
      <div className="p-6 flex flex-col items-center text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-2">Signup Successful!</h2>
          <div className="mt-2 text-sm text-gray-500 space-y-2">
            <p>A verification link has been sent to:</p>
            <p className="font-semibold text-primary">{email}</p>
            <p>Please verify your email before logging in.</p>
            <p className="text-xs text-gray-400">If you don't see the email, please check your spam folder.</p>
          </div>
          <div className="mt-6 w-full">
            <Button
              type="button"
              className="w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
              onClick={onClose} 
            >
              Go to Login
            </Button>
          </div>
      </div>
    );
};

// Login Form Component (Same as before)
const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      setIsLoading(false); return;
    }
    const result = await login(email, password); 
    if (result.success) {
      toast({ title: "Success", description: "Logged in successfully!" });
      onSuccess?.();
      const userTypeFromStorage = localStorage.getItem("userType");
      navigate(userTypeFromStorage ? `/${userTypeFromStorage}` : "/");
    } else {
      toast({ title: "Error", description: result.message || "Invalid credentials", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 pt-2">
      <div className="space-y-2">
        <label htmlFor="email-login" className="text-sm font-medium">Email</label>
        <Input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="password-login" className="text-sm font-medium">Password</label>
        <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

// Signup Form Component
const SignupForm = ({
  type,
  setAuthDialogOpen,
  setIsSignupDialogOpen, 
}: {
  type: "user" | "builder" | "broker" | "admin";
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
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false); 
  const [signupEmailForPopup, setSignupEmailForPopup] = useState(""); 

  const { signup } = useAuth(); 
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCompanyName("");
    setLicenseNumber("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      if (!name || !email || !password || !confirmPassword) {
        toast({ title: "Error", description: "All fields are required", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
        return;
      }
      if (type === "admin" && (!name || !email || !password)) { 
        toast({ title: "Error", description: "Admin requires Name, Email, and Password.", variant: "destructive" });
        return;
      }

      const payload = { 
        name, 
        email, 
        password, 
        userType: type, 
        ...(type === "builder" && { companyName }), 
        ...(type === "broker" && { licenseNumber }) 
      };

      const result = await signup(payload); 
      
      if (result.success) {
        setSignupEmailForPopup(result.email || email); 
        setShowVerificationSuccess(true); 
        toast({ title: "Success", description: "Please check your email for verification" });
        setIsSignupDialogOpen(false);
        resetForm();
      } else {
        toast({ title: "Error", description: result.message || "Failed to create account", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccessClose = () => {
    setShowVerificationSuccess(true); 
    setIsSignupDialogOpen(false);     
    setAuthDialogOpen(true);          
  };

  if (showVerificationSuccess) {
    console.log("showVerificationSuccess", showVerificationSuccess);
    return (
      <div className="bg-white rounded-lg">
        <SignupSuccessMessageUI email={signupEmailForPopup} onClose={handleVerificationSuccessClose} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg pt-2 pb-4 max-h-[calc(80vh-150px)] overflow-y-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Create Your {type.charAt(0).toUpperCase() + type.slice(1)} Account</h3>
        <p className="text-sm text-gray-500 mt-1">Join our community</p>
      </div>
      <form onSubmit={handleSignup} className="space-y-3 px-2">
        <div className="space-y-1">
          <label htmlFor={`${type}-name-signup`} className="text-xs font-medium text-gray-700">Full Name</label>
          <Input id={`${type}-name-signup`} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="text-sm"/>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${type}-email-signup`} className="text-sm font-medium text-gray-700">Email</label>
          <Input id={`${type}-email-signup`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="text-sm"/>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${type}-password-signup`} className="text-sm font-medium text-gray-700">Password</label>
          <Input id={`${type}-password-signup`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="text-sm"/>
        </div>
        <div className="space-y-1">
          <label htmlFor={`${type}-confirm-password-signup`} className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input id={`${type}-confirm-password-signup`} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="text-sm"/>
        </div>
        {type === "builder" && (
          <div className="space-y-1">
            <label htmlFor="company-signup" className="text-sm font-medium text-gray-700">Company Name</label>
            <Input id="company-signup" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Construction Company" required className="text-sm"/>
          </div>
        )}
        {type === "broker" && (
          <div className="space-y-1">
            <label htmlFor="license-signup" className="text-sm font-medium text-gray-700">License Number</label>
            <Input id="license-signup" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="License #" required className="text-sm"/>
          </div>
        )}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md mt-4" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, userType, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminSection = location.pathname.startsWith("/admin");
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSearch = (e: React.FormEvent) => { 
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); 
      if (mobileMenuOpen) setMobileMenuOpen(false); 
    }
  };
  const handleLogout = async () => { 
    await logout(); 
    toast({ title: "Logged out", description: "Successfully logged out" });
    navigate("/");
    scrollToTop();
  };

  if (isAdminSection) return null;

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={scrollToTop}>
            <div className="flex items-center relative">
              <span className="text-2xl font-bold">PROP</span>
              <span className="text-2xl font-bold text-red-500 relative ml-0.5">
                CID<div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              </span>
            </div>
          </Link>
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input type="search" placeholder="Search properties, builders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:ring-primary focus:border-primary" />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"><Search className="w-4 h-4" /></button>
            </form>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary flex items-center gap-1" onClick={scrollToTop}><Home className="w-4 h-4" /><span>Home</span></Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary" onClick={scrollToTop}>Contact</Link>
            <Link to="/services" className="text-gray-700 hover:text-primary" onClick={scrollToTop}>Services</Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary flex items-center gap-1">Properties
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/properties?type=residential" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary" onClick={scrollToTop}>Residential</Link>
                <Link to="/properties?type=commercial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary" onClick={scrollToTop}>Commercial</Link>
                <Link to="/properties?type=luxury" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary" onClick={scrollToTop}>Luxury</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {authLoading ? (<Button variant="outline" size="sm" disabled>...</Button>) : 
             !isAuthenticated ? (
              <>
                <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white"><LogIn className="w-3 h-3 mr-1" />Login</Button></DialogTrigger>
                  <DialogContent><DialogHeader><DialogTitle className="text-primary">Login to PropCID</DialogTitle></DialogHeader><LoginForm onSuccess={() => setAuthDialogOpen(false)} /></DialogContent>
                </Dialog>
                
                <Dialog 
                  open={isSignupDialogOpen} 
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsSignupDialogOpen(false);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-white" 
                      onClick={() => {
                        setIsSignupDialogOpen(true);
                      }}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto p-0"> 
                    <Tabs defaultValue="user" className="w-full">
                      <DialogHeader className="p-6 pb-2"> 
                        <DialogTitle className="text-primary text-center">Create Account</DialogTitle>
                      </DialogHeader>
                      <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-white z-10 px-6 pt-2 pb-2 shadow-sm"> 
                        <TabsTrigger value="user">User</TabsTrigger>
                        <TabsTrigger value="builder">Builder</TabsTrigger>
                        <TabsTrigger value="broker">Broker</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                      </TabsList>
                      {["user", "builder", "broker", "admin"].map(role => (
                        <TabsContent value={role} key={role} className="p-1"> 
                          <SignupForm 
                            type={role as "user"|"builder"|"broker"|"admin"} 
                            setAuthDialogOpen={setAuthDialogOpen} 
                            setIsSignupDialogOpen={setIsSignupDialogOpen} 
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate(userType ? `/${userType}`: '/')} className="text-primary border-primary hover:bg-primary hover:text-white capitalize">{userType || "Profile"}</Button>
                <Button variant="destructive" size="sm" onClick={handleLogout}><LogOut className="w-3 h-3 mr-1" />Logout</Button>
              </div>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md hover:bg-gray-100"><Menu className="w-6 h-6 text-gray-700" /></button>
        </div>
      </nav>

      {/* Mobile Menu Panel (Same as before) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] bg-white z-40 p-4 space-y-4 overflow-y-auto">
           <form onSubmit={handleSearch} className="relative w-full mb-4">
              <Input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-4 pr-10 py-2 rounded-full border-gray-300 focus:ring-primary focus:border-primary" />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"><Search className="w-5 h-5" /></button>
            </form>
            <Link to="/" className="flex items-center p-3 text-gray-700 hover:bg-primary/10 rounded-md" onClick={() => setMobileMenuOpen(false)}><Home className="w-5 h-5 mr-3 text-primary" />Home</Link>
            <Link to="/contact" className="flex items-center p-3 text-gray-700 hover:bg-primary/10 rounded-md" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/services" className="flex items-center p-3 text-gray-700 hover:bg-primary/10 rounded-md" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <div className="text-gray-700 font-medium p-3">Properties</div>
            <Link to="/properties?type=residential" className="block pl-8 pr-3 py-2 text-sm text-gray-600 hover:bg-primary/10 rounded-md" onClick={() => setMobileMenuOpen(false)}>Residential</Link>
            <Link to="/properties?type=commercial" className="block pl-8 pr-3 py-2 text-sm text-gray-600 hover:bg-primary/10 rounded-md" onClick={() => setMobileMenuOpen(false)}>Commercial</Link>
            <Link to="/properties?type=luxury" className="block pl-8 pr-3 py-2 text-sm text-gray-600 hover:bg-primary/10 rounded-md" onClick={() => setMobileMenuOpen(false)}>Luxury</Link>
            <div className="pt-6 space-y-3 border-t mt-4">
            {authLoading ? (<Button className="w-full" disabled>Loading...</Button>) :
             !isAuthenticated ? (
              <>
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white" onClick={() => { setAuthDialogOpen(true); setMobileMenuOpen(false); }}><LogIn className="w-4 h-4 mr-2" />Login</Button>
                <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={() => { setIsSignupDialogOpen(true); setMobileMenuOpen(false); }}><UserPlus className="w-4 h-4 mr-2" />Sign Up</Button>
              </>
            ) : (
              <>
                <Link to={userType ? `/${userType}`: '/'} className="flex items-center p-3 text-gray-700 hover:bg-primary/10 rounded-md capitalize" onClick={() => setMobileMenuOpen(false)}>{userType || "Profile"}</Link>
                <Button variant="destructive" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
              </>
            )}
            </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation (Same as before) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center justify-center w-1/3 text-gray-600 hover:text-primary data-[active=true]:text-primary" data-active={location.pathname === "/"} onClick={() => setMobileMenuOpen(false)}><Home className="h-6 w-6" /><span className="text-xs mt-1">Home</span></Link>
          <Link to="/reels" className="flex flex-col items-center justify-center w-1/3 text-gray-600 hover:text-primary data-[active=true]:text-primary" data-active={location.pathname === "/reels"} onClick={() => setMobileMenuOpen(false)}>
            <div className={`rounded-full p-2 -mt-6 shadow-lg ${location.pathname === "/reels" ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1">Reels</span>
          </Link>
          <button className="flex flex-col items-center justify-center w-1/3 text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
