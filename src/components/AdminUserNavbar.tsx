import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import logoImage from '../Logo.jpg';
import { 
  Home, 
  Briefcase, 
  Building, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Plus,
  List,
  User
} from 'lucide-react';

interface AdminUserNavbarProps {
  children: React.ReactNode;
  userType: 'broker' | 'builder';
}

const AdminUserNavbar = ({ children, userType }: AdminUserNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <Home className="w-5 h-5" />, 
      path: `/${userType}` 
    },
    { 
      name: 'List Property', 
      icon: <Plus className="w-5 h-5" />, 
      path: `/${userType}/list-property` 
    },
    { 
      name: 'My Properties', 
      icon: <List className="w-5 h-5" />, 
      path: `/${userType}/properties` 
    },
    { 
      name: 'View Enquiries', 
      icon: <MessageSquare className="w-5 h-5" />, 
      path: `/${userType}/enquiries` 
    },
    { 
      name: 'Profile', 
      icon: <User className="w-5 h-5" />, 
      path: `/${userType}/profile` 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage}
                alt="Logo" 
                className="h-8 w-auto"
              />
              {/* <span className="ml-2 text-xl font-bold text-primary">Propcid</span> */}
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Logged in as: {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} mt-16`}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
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
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[2.75rem] md:ml-64">
        {/* Content Area */}
        <main className="p-2">
          {children}
        </main>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-50 p-3 rounded-full bg-primary text-white shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AdminUserNavbar; 