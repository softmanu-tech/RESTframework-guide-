
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-drf-700 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 mb-8">
          The URL <code className="bg-gray-100 px-2 py-1 rounded text-drf-600">{location.pathname}</code> could not be found in our documentation.
        </p>
        <Button asChild className="bg-drf-600 hover:bg-drf-700">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
