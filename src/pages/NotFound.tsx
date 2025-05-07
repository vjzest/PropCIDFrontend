import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return null;
};

export default NotFound;
