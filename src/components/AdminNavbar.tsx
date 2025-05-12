import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import logoImage from '../Logo.jpg';

import {
  BarChart2,
  Home,
  Briefcase,
  Building,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminNavbarProps {
  children?: React.ReactNode;
}

const AdminNavbar = ({ children }: AdminNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('pendingUpload');

    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });

    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Dashboard', icon: <BarChart2 className="w-5 h-5" />, path: '/admin' },
    { name: 'Properties', icon: <Home className="w-5 h-5" />, path: '/admin/properties' },
    { name: 'Brokers', icon: <Briefcase className="w-5 h-5" />, path: '/admin/brokers' },
    { name: 'Builders', icon: <Building className="w-5 h-5" />, path: '/admin/builders' },
    { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { name: 'Enquiries', icon: <MessageSquare className="w-5 h-5" />, path: '/admin/enquiries' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
  ];

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      toast({
        title: 'Access Denied',
        description: "You don't have permission to access the admin panel",
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md flex items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/admin" className="flex items-center">
            <img src={logoImage} alt="Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary">
            Home
          </Link>
          <span className="text-sm text-gray-600 font-semibold text-primary">Admin</span>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-700 hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Right: Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg mt-16">
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path || location.pathname.startsWith(item.path + '/')
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

      {/* Mobile Right Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-16 right-0 z-50 w-64 h-full bg-white shadow-lg md:hidden">
          <nav className="flex flex-col p-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}

            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span className="ml-3">Home</span>
            </Link>

            <div className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
              <span className="text-primary">Admin</span>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-start px-4 py-2 text-gray-700 hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-20 md:ml-64">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar;
