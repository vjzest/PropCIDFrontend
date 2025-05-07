import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { Outlet } from 'react-router-dom';

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
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <BarChart2 className="w-5 h-5" />, 
      path: '/admin' 
    },
    { 
      name: 'Properties', 
      icon: <Home className="w-5 h-5" />, 
      path: '/admin/properties' 
    },
    { 
      name: 'Brokers', 
      icon: <Briefcase className="w-5 h-5" />, 
      path: '/admin/brokers' 
    },
    { 
      name: 'Builders', 
      icon: <Building className="w-5 h-5" />, 
      path: '/admin/builders' 
    },
    { 
      name: 'Users', 
      icon: <Users className="w-5 h-5" />, 
      path: '/admin/users' 
    },
    { 
      name: 'Enquiries', 
      icon: <MessageSquare className="w-5 h-5" />, 
      path: '/admin/enquiries' 
    },
    { 
      name: 'Settings', 
      icon: <Settings className="w-5 h-5" />, 
      path: '/admin/settings' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <img 
                src={logoImage}
                alt="Logo" 
                className="h-8 w-auto"
              />
           
            </Link>
          </div>

          {/* Right side - User Info and Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-primary">Admin</span>
            </span>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full pt-16">
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
      <div className="pt-20 md:ml-64">
        {/* Content Area */}
        <main className="p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar; 