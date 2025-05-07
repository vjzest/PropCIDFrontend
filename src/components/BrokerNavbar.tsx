import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import logoImage from '../Logo.jpg';

const BrokerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    // Redirect to home page
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/broker" className="flex items-center">
              <img
                src={logoImage}
                alt="PropCid"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-primary">PropCid</span>
            </Link>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as Broker</span>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BrokerNavbar; 