import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, LogIn, UserPlus, Building, Briefcase, Home, LogOut, Menu, X, Search } from 'lucide-react';
import logoImage from '../Logo.jpg';

// Mock user authentication state
const useAuth = () => {
  // In a real implementation, this would check localStorage or a context
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });
  
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || '';
  });

  const login = (email: string, password: string, type: string) => {
    // This is a mock implementation - would normally call an API
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserType(type);
    return true;
  };

  const logout = () => {
    // Only remove authentication status, keep user type and email
    localStorage.removeItem('authenticated');
    setIsAuthenticated(false);
    setUserType('');
  };

  return { isAuthenticated, userType, login, logout };
};

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(email, password, data.user.userType); // Use userType from user object
        toast({
          title: "Success",
          description: "You have been logged in successfully!",
        });
        if (onSuccess) onSuccess();
        
        // Navigate based on userType
        navigate(`/${data.user.userType}`);
      } 
      
       else {
        toast({
          title: "Error",
          description: data.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 pt-2">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
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
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          required 
        />
      </div>
      <Button type="submit" className="w-full">Login</Button>
    </form>
  );
};

const OtpVerificationForm = ({ email, onSuccess }: { email: string, onSuccess: () => void }) => {
  const [otp, setOtp] = useState('');
  const { toast } = useToast();

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your account has been verified!",
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: data.message || "Invalid OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Verify Your Email</h3>
        <p className="text-sm text-gray-500 mt-2">
          We've sent a verification code to {email}
        </p>
      </div>
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter Verification Code</label>
          <Input 
            id="otp" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required 
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Verify Account
        </Button>
      </form>
    </div>
  );
};

const SignupForm = ({ type, onSuccess, setAuthDialogOpen, setIsSignupDialogOpen }: { 
  type: 'user' | 'builder' | 'broker' | 'admin', 
  onSuccess?: () => void,
  setAuthDialogOpen: (open: boolean) => void,
  setIsSignupDialogOpen: (open: boolean) => void
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Prepare the data
    const userData = {
      name,
      email,
      password,
      userType: type,
      companyName: type === 'builder' ? companyName : '',
      licenseNumber: type === 'broker' ? licenseNumber : ''
    };

    try {
      const response = await fetch('http://localhost:4000/api/authsignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully! Please verify your email with OTP.",
        });
        setShowOtpForm(true);
      } else {
        toast({
          title: "Error",
          description: data.message || "Error during signup.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleOtpSuccess = () => {
    setIsSignupDialogOpen(false);
    setTimeout(() => {
      setAuthDialogOpen(true);
    }, 100);
  };

  if (showOtpForm) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-lg max-h-[80vh] overflow-y-auto">
        <OtpVerificationForm 
          email={email} 
          onSuccess={handleOtpSuccess}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Create Your Account</h3>
        <p className="text-sm text-gray-500 mt-2">
          Join our community and start your journey
        </p>
      </div>
      <form onSubmit={handleSignup} className="space-y-3">
        <div className="space-y-2">
          <label htmlFor={`${type}-name`} className="text-sm font-medium text-gray-700">Full Name</label>
          <Input 
            id={`${type}-name`} 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${type}-email`} className="text-sm font-medium text-gray-700">Email</label>
          <Input 
            id={`${type}-email`} 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${type}-password`} className="text-sm font-medium text-gray-700">Password</label>
          <Input 
            id={`${type}-password`} 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${type}-confirm-password`} className="text-sm font-medium text-gray-700">Confirm Password</label>
          <Input 
            id={`${type}-confirm-password`} 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required 
          />
        </div>
        {type === 'builder' && (
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
            <Input 
              id="company" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Construction Company" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        )}
        {type === 'broker' && (
          <div className="space-y-2">
            <label htmlFor="license" className="text-sm font-medium text-gray-700">License Number</label>
            <Input 
              id="license" 
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="License #" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        )}
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};


const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdminSection = location.pathname.startsWith('/admin');
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
    scrollToTop();
  };
  
  // Don't render the navbar in admin section
  if (isAdminSection) {
    return null;
  }
  
  return (
    <nav className="bg-white shadow-md px-4 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={scrollToTop}>
          <div className="flex items-center">
            <span className="text-2xl font-bold">PROP</span>
            <span className="text-2xl font-bold text-red-500">CID</span>
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full ml-0.5 mt-0.5"></div>
          </div>
        </Link>

        {/* Search Bar - Show on medium and larger screens */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Input 
              type="search"
              placeholder="Search properties, builders..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Links - Show on medium and larger screens */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary flex items-center gap-2" onClick={scrollToTop}>
            {/* <Home className="w-4 h-4" /> */}
            <span>Home</span>
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary" onClick={scrollToTop}>
            Contact
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-primary" onClick={scrollToTop}>
            Services
          </Link>
          <div className="relative group">
            <button className="text-gray-700 hover:text-primary flex items-center gap-1" onClick={scrollToTop}>
              Properties
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link to="/properties?type=residential" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={scrollToTop}>
                Residential Properties
              </Link>
              <Link to="/properties?type=commercial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={scrollToTop}>
                Commercial Properties
              </Link>
              <Link to="/properties?type=luxury" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={scrollToTop}>
                Luxury Properties
              </Link>
            </div>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white" onClick={scrollToTop}>
                    <LogIn className="w-3 h-3 mr-1" />
                    <span className="text-sm">Login</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-primary">Login to PropCID</DialogTitle>
                  </DialogHeader>
                  <LoginForm onSuccess={() => setAuthDialogOpen(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
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
                    <DialogTitle className="text-primary">Create your PropCID account</DialogTitle>
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
              <span className="text-sm text-gray-700">
                 <span className="font-medium capitalize">{userType}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-primary">
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
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] bg-white z-40">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Input 
                type="search"
                placeholder="Search properties, builders..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link to="/" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={scrollToTop}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link to="/contact" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={scrollToTop}>
                Contact
              </Link>
              <Link to="/services" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={scrollToTop}>
                Services
              </Link>
              <div className="space-y-1">
                <div className="p-2 text-gray-700 font-medium">Properties</div>
                <Link to="/properties?type=residential" className="block pl-4 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={scrollToTop}>
                  Residential Properties
                </Link>
                <Link to="/properties?type=commercial" className="block pl-4 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={scrollToTop}>
                  Commercial Properties
                </Link>
                <Link to="/properties?type=luxury" className="block pl-4 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={scrollToTop}>
                  Luxury Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
