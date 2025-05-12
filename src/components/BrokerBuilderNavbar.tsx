import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import logoImage from '../Logo.jpg';
import {
  Home,
  Plus,
  List,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface BrokerBuilderNavbarProps {
  children: React.ReactNode;
  userType: 'broker' | 'builder';
}

const BrokerBuilderNavbar = ({ children, userType }: BrokerBuilderNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    const storedUserType = localStorage.getItem('userType');

    if (!isAuthenticated || storedUserType !== userType) {
      toast({
        title: 'Access Denied',
        description: 'Please log in to access this page',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    if (userType === 'builder' && !localStorage.getItem('builderProfile')) {
      const initialProfile = {
        companyName: localStorage.getItem('companyName') || '',
        email: localStorage.getItem('userEmail') || '',
        phone: '',
        address: '',
        registrationNumber: '',
        about: '',
        yearsOfExperience: 0,
        completedProjects: 0,
        website: '',
        specialties: [],
        certifications: [],
        totalRevenue: '₹0',
        activeProjects: 0,
        teamSize: 0,
        awards: []
      };
      localStorage.setItem('builderProfile', JSON.stringify(initialProfile));
    }
  }, [userType, navigate, toast]);

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully'
    });
    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: `/${userType}` },
    { name: 'List Property', icon: <Plus className="w-5 h-5" />, path: `/${userType}/list-property` },
    { name: 'My Properties', icon: <List className="w-5 h-5" />, path: `/${userType}/properties` },
    { name: 'Enquiries', icon: <MessageSquare className="w-5 h-5" />, path: `/${userType}/enquiries` },
    { name: 'Profile', icon: <User className="w-5 h-5" />, path: `/${userType}/profile` }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo Left */}
          <Link to={`/${userType}`} className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop Right Content */}
          <div className="hidden md:flex items-center gap-4">
            {/* Home button in Desktop view */}
            <Link to="/" className="text-sm text-gray-600 hover:text-primary">
              Home
            </Link>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-primary capitalize">{userType}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Toggle Right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="flex flex-col h-full">
          <div className="flex-1 px-4 py-4 space-y-1">
            {/* Mobile only extra items */}
            <div className="md:hidden space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                <User className="w-5 h-5 mr-2" />
                <span className="capitalize">{userType}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
              <hr className="my-2" />
            </div>

            {/* Main Menu Items */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-20 md:ml-64 transition-all duration-200">
        <div className="p-4 mx-4">{children}</div>
      </main>
    </div>
  );
};

export default BrokerBuilderNavbar;
