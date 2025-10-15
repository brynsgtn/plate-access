import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 py-12">
      {/* Gradient Hero Section */}
      <div className="hero bg-gradient-to-r from-primary to-accent text-primary-content rounded-3xl shadow-2xl w-full max-w-3xl p-10">
        <div className="hero-content flex flex-col items-center text-center">
          <AlertTriangle className="w-20 h-20 text-white mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold mb-4 text-white">404 - Page Not Found</h1>
          <p className="text-lg mb-8 max-w-md">
            The page you are looking for doesn’t exist or may have been moved.  
            Don’t worry, you can safely head back to your dashboard or homepage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="btn btn-outline btn-accent border-primary-content text-primary-content hover:bg-primary-content hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/dashboard"
              className="btn btn-outline btn-accent border-primary-content text-primary-content hover:bg-primary-content hover:text-primary transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle background section */}
      <div className="mt-16 text-center">
        <p className="text-base-content/70 text-sm">
          Need help? Contact your system administrator for assistance.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
