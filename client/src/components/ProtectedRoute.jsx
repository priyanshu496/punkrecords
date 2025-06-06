import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, isCheckingAuth } = useAuthStore();

  // Show loading while checking authentication
  if (isCheckingAuth) {
    console.log("ProtectedRoute: Showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the protected component
  console.log("ProtectedRoute: User authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;